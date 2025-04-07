import React, { useState, useEffect } from "react";
import { createEditor, Transforms, Editor, Element as SlateElement, Text } from "slate";
import { Slate, Editable, withReact } from "slate-react"; 
import "../../pages/admin/Admin.css"
const FONT_FAMILIES = [
  "Arial", "Courier New", "Georgia", "Times New Roman", "Verdana",
  "Trebuchet MS", "Impact", "Comic Sans MS", "Lucida Console", "Tahoma",
  "Merriweather", "Roboto Slab", "Playfair Display", "Lora", "Roboto",
  "Open Sans", "Nunito", "Poppins"
];


const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 64, 128];

const TextEditor = ({ value, onSave }) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [editorValue, setEditorValue] = useState(value); // 🔹 Editör içeriği state olarak saklanacak
  const [bgColor, setBgColor] = useState(value); // 🔹 Editör içeriği state olarak saklanacak
  const [color, setColor] = useState(value); // 🔹 Editör içeriği state olarak saklanacak
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0]);
  const [fontSize, setFontSize] = useState(FONT_SIZES[0]);
  // ✅ Eğer dışarıdan gelen `value` değişirse, editörü güncelle
  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  // **Formatı Toggle Etme**
  const toggleFormat = (format, e) => {
    e.preventDefault();
    const isActive = isFormatActive(editor, format);
    Transforms.setNodes(
      editor,
      { [format]: isActive ? null : true },
      { match: (n) => Text.isText(n), split: true }
    );
  };

  // **Blok Tipini Değiştirme**
  const toggleBlock = (format, e) => {
    e.preventDefault();
    const isActive = isBlockActive(editor, format);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : format },
      { match: (n) => SlateElement.isElement(n) }
    );
  };
  const toggleBlockList = (format, e) => {
    e.preventDefault();
  
    if (format === "numbered-list") {
      const [match] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === "numbered-list",
      });
  
      if (match) {
        // Eğer numaralı liste zaten varsa, yeni bir liste öğesi ekle
        Transforms.insertNodes(editor, {
          type: "list-item",
          children: [{ text: "" }],
        });
      } else {
        // Eğer numaralı liste yoksa, yeni bir numaralı liste oluştur
        Transforms.insertNodes(editor, {
          type: "numbered-list",
          children: [
            {
              type: "list-item",
              children: [{ text: "Yeni öğe" }],
            },
          ],
        });
      }
    } else {
      const [match] = Editor.nodes(editor, {
        match: (n) => SlateElement.isElement(n) && n.type === "bulleted-list",
      });
  
      if (match) {
        // Eğer numaralı liste zaten varsa, yeni bir liste öğesi ekle
        Transforms.insertNodes(editor, {
          type: "list-item",
          children: [{ text: "" }],
        });
      } else {
        // Eğer numaralı liste yoksa, yeni bir numaralı liste oluştur
        Transforms.insertNodes(editor, {
          type: "bulleted-list",
          children: [
            {
              type: "list-item",
              children: [{ text: "Yeni öğe" }],
            },
          ],
        });
      }
    }
  };
  
  
  // **Format Aktif mi?**
  const isFormatActive = (editor, format) => {
    const [match] = Editor.nodes(editor, { match: (n) => n[format] === true });
    return !!match;
  };

  // **Blok Aktif mi?**
  const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, { match: (n) => n.type === format });
    return !!match;
  };

  // **Klavye Kısayolları**
  const handleKeyDown = (event) => {
    if (event.ctrlKey) {
      switch (event.key) {
        case "b":
          toggleFormat("bold", event);
          break;
        case "i":
          toggleFormat("italic", event);
          break;
        case "u":
          toggleFormat("underline", event);
          break;
        default:
          break;
      }
    }
  };

  // **Yazı Rengini Değiştir**
  const changeColor = (color, e) => {
    e.preventDefault();
    setColor(color)
    Transforms.setNodes(
      editor,
      { color: color },
      { match: (n) => Text.isText(n), split: true }
    );
  };

  // **Arka Plan Rengini Değiştir**
  const changeBackgroundColor = (color, e) => {
    e.preventDefault();
    setBgColor(color)
    Transforms.setNodes(
      editor,
      { backgroundColor: color },
      { match: (n) => Text.isText(n), split: true }
    );
  };
  // **Yazı Tipini Değiştir**
  const changeFontFamily = (font, e) => {
    e.preventDefault();
    setFontFamily(font);
    Transforms.setNodes(
      editor,
      { fontFamily: font },
      { match: (n) => Text.isText(n), split: true }
    );
  };

  // **Yazı Boyutunu Değiştir**
  const changeFontSize = (size, e) => {
    e.preventDefault();
    setFontSize(size);
    Transforms.setNodes(
      editor,
      { fontSize: size + "px" },
      { match: (n) => Text.isText(n), split: true }
    );
  };
  // **Resim Ekleme Fonksiyonu**
  const insertImage = (url, e) => {
    e.preventDefault();
    const imageNode = {
      type: "image",
      url,
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, imageNode);
  };
  // **Metin Hizalama (Sola, Sağa, Ortaya)**
  const changeAlignment = (align, e) => {
    e.preventDefault();
    Transforms.setNodes(
      editor,
      { align: align },
      { match: (n) => SlateElement.isElement(n), split: true }
    );
  };

  //link ekleme fonksiyonu
  const insertLink = (url, e) => {
    e.preventDefault();
    if (!url) return;

    const { selection } = editor;
    const isCollapsed = selection && Editor.string(editor, selection) === "";

    // Eğer metin seçili değilse, direkt URL'yi metin olarak ekleyelim
    const linkText = isCollapsed ? url : Editor.string(editor, selection);

    const linkNode = {
      type: "link",
      url,
      children: [{ text: linkText, underline: true, color: "blue" }],
    };

    // Eğer seçim varsa, seçili metni linke dönüştür
    if (isCollapsed) {
      Transforms.insertNodes(editor, linkNode);
    } else {
      Transforms.wrapNodes(editor, linkNode, { split: true });
    }
  };

  // link silme fonksiyonu
  const removeLink = (e) => {
    e.preventDefault();
    Transforms.unwrapNodes(editor, { match: (n) => n.type === "link" });
  };



  // **RenderLeaf: Metin Stilini Uygula**
  const renderLeaf = ({ attributes, children, leaf }) => {
    return (
      <span
        {...attributes}
        style={{
          fontWeight: leaf.bold ? "bold" : "normal",
          fontStyle: leaf.italic ? "italic" : "normal",
          textDecoration: leaf.underline ? "underline" : "none",
          color: leaf.color || "black", // **Metin Rengi**
          backgroundColor: leaf.backgroundColor || "transparent", // **Arka Plan Rengi**
          fontFamily: leaf.fontFamily || "inherit", // **Yazı Tipi**
          fontSize: leaf.fontSize || "inherit", // **Yazı Boyutu**
        }}
      >
        {children}
      </span>
    );
  };

  // **RenderElement: Blokları Uygula**
  const renderElement = ({ attributes, children, element }) => {
    const style = {
      textAlign: element.align || "left",
      color: element.color || "inherit",
      backgroundColor: element.backgroundColor || "transparent",
      fontSize: element.fontSize || "inherit",
      fontFamily: element.fontFamily || "inherit",
    };

    switch (element.type) {
      case "link":
        return (
          <a
            {...attributes}
            href={element.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {children}
          </a>
        );
      case "heading-one":
        return <h1 {...attributes} style={style}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes} style={style}>{children}</h2>;
      case "heading-three":
        return <h3 {...attributes} style={style}>{children}</h3>;
      case "blockquote":
        return (
          <blockquote {...attributes} style={{ ...style, borderLeft: "4px solid gray", paddingLeft: "10px" }}>
            {children}
          </blockquote>
        );
      case "bulleted-list":
        return (
          <ul {...attributes} style={{ ...style, listStyleType: "disc", paddingLeft: "20px" }}>
            {children.map((child, index) => (
              <li key={index}>{child}</li>
            ))}
          </ul>
        );
      case "numbered-list":
        return (
          <ol {...attributes}>
            {children.map((child, index) => (
              <li key={index}>{child}</li>
            ))}
          </ol>
        );

      case "code":
        return (
          <pre {...attributes} style={{
            ...style,
            background: "#2e2e2e",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "5px",
            fontFamily: "monospace"
          }}>
            {children}
          </pre>
        );
      case "image":
        return (
          <div {...attributes} contentEditable={false} style={{ textAlign: "center" }}>
            <img
              src={element.url}
              alt="User Uploaded"
              style={{ maxWidth: "99%", height: "auto", borderRadius: "5px" }}
            />
          </div>
        );
      default:
        return <p {...attributes} style={style}>{children}</p>;
    }
  };


  return (
    <div className="editor-container">
      {/* Toolbar */}
      <div className="toolbar" style={{ marginBottom: "10px" }}>
        <button onClick={(e) => toggleFormat("bold", e)}>B</button>
        <button onClick={(e) => toggleFormat("italic", e)}>I</button>
        <button onClick={(e) => toggleFormat("underline", e)}>U</button>
        <button onClick={(e) => toggleBlock("heading-one", e)}>H1</button>
        <button onClick={(e) => toggleBlock("heading-two", e)}>H2</button>
        <button onClick={(e) => toggleBlock("heading-three", e)}>H3</button>
        <button onClick={(e) => changeAlignment("left", e)}>Sola Hizala</button>
        <button onClick={(e) => changeAlignment("center", e)}>Ortaya Hizala</button>
        <button onClick={(e) => changeAlignment("right", e)}>Sağa Hizala</button>
        <button onClick={(e) => toggleBlockList("bulleted-list", e)}>• Liste</button>
        <button onClick={(e) => toggleBlockList("numbered-list", e)}>1. Liste</button>
        <button onClick={(e) => toggleBlock("blockquote", e)}>Alıntı</button>
        <button onClick={(e) => insertLink(prompt("Bağlantı URL'sini girin:"), e)}>🔗 Link Ekle</button>
        <button onClick={(e) => removeLink(e)}>❌ Linki Kaldır</button>
        <button onClick={(e) => toggleBlock("code", e)}>Kod</button>
        <select className="border p-1" value={fontFamily} onChange={(e) => changeFontFamily(e.target.value, e)}>
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
        <select className="border p-1" value={fontSize} onChange={(e) => changeFontSize(e.target.value, e)}>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
        <input
          type="color"
          value={color}
          onChange={(e) => changeColor(e.target.value, e)}
          title="Metin Rengi"
        />
        <input
          type="color"
          value={bgColor}
          onChange={(e) => changeBackgroundColor(e.target.value, e)}
          title="Arka Plan Rengi"
        />
        <button onClick={(e) => insertImage(prompt("Resim URL'sini girin:"), e)}>Resim Ekle</button>
      </div>

      {/* Slate Editör */}
      <Slate editor={editor} initialValue={value} value={editorValue} onChange={(editorData) => { setEditorValue(editorData); onSave(editorData); }}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={handleKeyDown}
          placeholder="Buraya yazın..."
          style={{ minHeight: "200px", padding: "10px", maxHeight: "400px", overflowY: "auto" }}
        />
      </Slate>
    </div>
  );
};

export default TextEditor;

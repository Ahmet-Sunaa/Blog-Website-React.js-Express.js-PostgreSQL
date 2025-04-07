const nodemailer = require('nodemailer');

// E-posta gönderme fonksiyonu
const sendMail = async (senderEmail, senderName, messageContent, replyContent) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // Kullanılan e-posta servis sağlayıcı (Gmail örneği)
        auth: {
            user:  process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,   // E-posta şifresi veya Uygulama şifresi
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: senderEmail,  // Mesajı gönderen kişinin e-posta adresi
        subject: `Yeni bir yanıt aldınız: ${senderName}`, // Konu başlığı
        text: `
            Merhaba ${senderName},

            Gönderdiğiniz mesaj:
            ${messageContent}

            Yanıt:
            ${replyContent}
        `,  // Mail içeriği
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
    }
};

module.exports = sendMail;

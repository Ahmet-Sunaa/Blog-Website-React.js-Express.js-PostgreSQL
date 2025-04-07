import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../pages/user/User.css";

import { useLocation } from 'react-router-dom';
import { useLanguage } from "../context/LanguageContext";

const PostCarousel = ({ posts, style }) => {
  const { language } = useLanguage();
  const location = useLocation();



  const slug = location.pathname.split("/").pop(); 
  const settingsMain = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const settingsInner = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const singleSettingsInner = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    adaptiveHeight: true,

  };
  return (
    <div className={slug==="blogs" ? 'multi-post-carousel' : posts.length >= 3 ? 'post-carousel' : 'first-third-post-carousel'}>
      
      {posts.length < 3 && slug!=="blogs" && (
        <React.Fragment key='1'>
          {posts.map((post) => (
            <React.Fragment key={post.id}>
              {language === 'en' && post.entitle !== null && post.endetail !== null && post.entitle !== "" && post.endetail !== "" && (
                <div className="post-card" style={style}>
                  {/* İç Slider - Her post için birden fazla resim */}
                  {post.img_data.length > 1 && (
                    <Slider {...settingsInner}>
                      {post.img_data.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`data:image/png;base64,${image}`}
                            alt={post.title}
                            className="post-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}

                  {/* Tek resimli postlar için özel düzenleme */}
                  {post.img_data.length === 1 && post.img_data[0] !== null && (
                    <div>
                      <img
                        src={`data:image/png;base64,${post.img_data[0]}`}
                        alt={post.title}
                        className="post-image"
                      />
                    </div>
                  )}
                  <Link to={`/post/${post.id}`} className="post-title">

                    {post.entitle.length > 40 ? post.entitle.substring(0, 36) + '...' : post.entitle}
                  </Link>
                  <p className="post-content">
                    {post.endetail.substring(0, 150)}...
                  </p>
                </div>
              )}
              {language === 'tr' && (
                <div key={post.id} className="post-card" style={style}>
                  {/* İç Slider - Her post için birden fazla resim */}
                  {post.img_data.length > 1 && (
                    <Slider {...settingsInner}>
                      {post.img_data.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`data:image/png;base64,${image}`}
                            alt={post.title}
                            className="post-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}

                  {/* Tek resimli postlar için özel düzenleme */}
                  {post.img_data.length === 1 && post.img_data[0] !== null && (
                    <div>
                      <img
                        src={`data:image/png;base64,${post.img_data[0]}`}
                        alt={post.title}
                        className="post-image"
                      />
                    </div>
                  )}
                  <Link to={`/post/${post.id}`} className="post-title">

                    {post.title.length > 40 ? post.title.substring(0, 36) + '...' : post.title}
                  </Link>
                  <p className="post-content">
                    {post.detail.substring(0, 150)}...
                  </p>
                </div>
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      )}

      {posts.length <= 6 && posts.length >= 3 && slug!=="blogs" && (
        <Slider {...settingsMain}>
          {posts.map((post) => (
            <div key={post.id}>
              {language === 'en' && post.entitle !== null && post.endetail !== null && post.entitle !== "" && post.endetail !== "" && (
                <div  className="post-card" style={style}>
                  {/* İç Slider - Her post için birden fazla resim */}
                  {post.img_data.length > 1 && (
                    <Slider {...settingsInner}>
                      {post.img_data.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`data:image/png;base64,${image}`}
                            alt={post.title}
                            className="post-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}

                  {/* Tek resimli postlar için özel düzenleme */}
                  {post.img_data.length === 1 && post.img_data[0] !== null && (
                    <div>
                      <img
                        src={`data:image/png;base64,${post.img_data[0]}`}
                        alt={post.title}
                        className="post-image"
                      />
                    </div>
                  )}

                  {/* Post Bilgileri */}
                  <Link to={`/post/${post.id}`} className="post-title">

                    {post.entitle.length > 40 ? post.entitle.substring(0, 36) + '...' : post.entitle}
                  </Link>
                  <p className="post-content">
                    {post.endetail.substring(0, 150)}...
                  </p>

                </div>
              )}
              {language === 'tr' && (
                <div key={post.id} className="post-card" style={style}>
                  {/* İç Slider - Her post için birden fazla resim */}
                  {post.img_data.length > 1 && (
                    <Slider {...settingsInner}>
                      {post.img_data.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`data:image/png;base64,${image}`}
                            alt={post.title}
                            className="post-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}

                  {/* Tek resimli postlar için özel düzenleme */}
                  {post.img_data.length === 1 && post.img_data[0] !== null && (
                    <div>
                      <img
                        src={`data:image/png;base64,${post.img_data[0]}`}
                        alt={post.title}
                        className="post-image"
                      />
                    </div>
                  )}

                  {/* Post Bilgileri */}
                  <Link to={`/post/${post.id}`} className="post-title">

                    {post.title.length > 40 ? post.title.substring(0, 36) + '...' : post.title}
                  </Link>
                  <p className="post-content">
                    {post.detail.substring(0, 150)}...
                  </p>


                </div>
              )}
            </div>
          ))}
        </Slider>
      )}

      {slug==="blogs" && (
        <React.Fragment >
          {posts.map((post) => (
            <React.Fragment key={post.id}>
              {language === 'en' && post.entitle !== null && post.endetail !== null && post.entitle !== "" && post.endetail !== "" && (
                <div key={post.id} className="post-card" style={style}>
                  {/* İç Slider - Birden fazla resim varsa */}
                  {post.img_data.length > 1 && (
                    <Slider  {...singleSettingsInner}>
                      {post.img_data.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`data:image/png;base64,${image}`}
                            alt={post.title}
                            className="post-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}

                  {/* Tek resimli postlar için özel düzenleme */}
                  {post.img_data.length === 1 && post.img_data[0] !== null && (
                    <div>
                      <img
                        src={`data:image/png;base64,${post.img_data[0]}`}
                        alt={post.title}
                        className="post-image"
                      />
                    </div>
                  )}

                  {/* Post Bilgileri */}

                  <Link to={`/post/${post.id}`} className="post-title">

                    {post.entitle.length > 40 ? post.entitle.substring(0, 36) + '...' : post.entitle}
                  </Link>
                  <p className="post-content">
                    {post.endetail.substring(0, 150)}...
                  </p>

                </div>
              )}
              {language === 'tr' && (
                <div key={post.id} className="post-card" style={style}>
                  {/* İç Slider - Birden fazla resim varsa */}
                  {post.img_data.length > 1 && (
                    <Slider  {...singleSettingsInner}>
                      {post.img_data.map((image, index) => (
                        <div key={index}>
                          <img
                            src={`data:image/png;base64,${image}`}
                            alt={post.title}
                            className="post-image"
                          />
                        </div>
                      ))}
                    </Slider>
                  )}

                  {/* Tek resimli postlar için özel düzenleme */}
                  {post.img_data.length === 1 && post.img_data[0] !== null && (
                    <div>
                      <img
                        src={`data:image/png;base64,${post.img_data[0]}`}
                        alt={post.title}
                        className="post-image"
                      />
                    </div>
                  )}

                  {/* Post Bilgileri */}
                  <Link to={`/post/${post.id}`} className="post-title">

                    {post.title.length > 40 ? post.title.substring(0, 36) + '...' : post.title}
                  </Link>
                  <p className="post-content">
                    {post.detail.substring(0, 150)}...
                  </p>


                </div>
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default PostCarousel;

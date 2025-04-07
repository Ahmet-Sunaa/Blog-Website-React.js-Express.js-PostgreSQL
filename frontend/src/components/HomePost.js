import React from "react";

import PostCarousel from "./PostCarousel";
import "../pages/user/User.css";

const HomePost = ({posts, color}) => {

  return posts ? (
    <div className="home-container" style={{backgroundColor: color[2]}}>
      <div className="posts-container" style={{backgroundColor: color[3]}}>

       <PostCarousel posts={posts} style={{backgroundColor:color[4]}}/>
      </div>
    </div>
  ) : <h2> 404 Not Found</h2>
};

export default HomePost;

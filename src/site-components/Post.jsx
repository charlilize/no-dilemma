import React from "react";
import { Link } from "react-router-dom";


const Post = (props) => {
  return (
    <div className="bg-white p-5 md:w-1/4 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md">
      <Link to={`/postDetails/${props.postid}`}>
        <p>2 hrs ago · 2 answers</p>
        <h1 className="text-xl font-bold overflow-hidden">
          what school shfdsdfsdfsdfdsfould i go to?
        </h1>
      </Link>
    </div>
  );
};

export default Post;

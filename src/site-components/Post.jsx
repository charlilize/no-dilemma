import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUp } from '@fortawesome/free-regular-svg-icons';
import { formatDistanceStrict } from 'date-fns';

const Post = (props) => {
  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return formatDistanceStrict(date, new Date(), { addSuffix: true, includeSeconds: true });
  }

  const formattedTime = formatTimestamp(props.timeCreated);

  const handleClickUpvote = () => {
    window.location = `/postDetails/${props.id}`;
  }

  return (
    <div 
      className="cursor-pointer bg-white p-5 md:w-1/4 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md" 
      onClick={handleClickUpvote}
    >
        <p>{formattedTime} · 2 answers</p>
        <h1 className="text-xl font-bold overflow-hidden">{props.title}</h1>
        <div className="flex gap-2 bg-slate-200 w-16 rounded-lg p-1 items-center">
          <FontAwesomeIcon icon={faCircleUp} className="icon h-6"/>
          <p className="text-md">{props.upvotes}</p>
        </div>
    </div>
  );
};

export default Post;

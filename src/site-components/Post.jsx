import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUp } from '@fortawesome/free-regular-svg-icons';
import { formatDistanceStrict } from 'date-fns';
import { supabase } from "@/client";

const Post = (props) => {
  const [count, setCount] = useState(0);

  const formatTimestamp = useMemo(() => {
    return (timestamp) => {
      const date = new Date(timestamp);
      return formatDistanceStrict(date, new Date(), { addSuffix: true, includeSeconds: true });
    };
  }, []);

  const formattedTime = formatTimestamp(props.timeCreated);

  const handleClickPost = () => {
    window.location = `/postDetails/${props.id}`;
  }

  // Retrieve the number of upvotes the post has from the database
  useEffect(() => {
    const fetchUpvotes = async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("upvotes_count") // Retrieve only the upvotes_count column
          .eq("id", props.id)
          .single(); // Retrieve a single row
  
      if (error) {
        console.error("Error fetching upvotes:", error);
      } else {
        setCount(data.upvotes_count); // Update the local count state with the retrieved upvotes_count value
      }
      } catch (error) {
        console.error("Error fetching upvotes:", error);
      }
    };
  
    fetchUpvotes();
  }, [props.id]);

  // Update the number of upvotes on the local count variable and the database
  const updateUpvotes = async (event) => {
    event.stopPropagation();
    event.preventDefault();

    await supabase 
      .from("posts")
      .update({ upvotes_count: count + 1 })
      .eq("id", props.id)

      setCount((count) => count + 1);
  };

  return (
    <div 
      className="cursor-pointer bg-white p-5 md:w-[480px] w-4/5 flex flex-col border bg-card text-card-foreground shadow-md" 
      onClick={handleClickPost}
    >
        <p>{formattedTime} · {props.totalAnswers} answers</p>
        <h1 className="text-xl font-bold overflow-hidden">{props.title}</h1>
        <div className="flex gap-4">
          <div className="flex gap-2 bg-slate-200 w-16 rounded-lg p-1 items-center">
            <FontAwesomeIcon onClick={updateUpvotes} icon={faCircleUp} className="icon h-6"/>
            <p className="text-md">{count}</p>
          </div>
          <div className="flex w-28 gap-2 bg-slate-200 rounded-lg p-1 items-center">
            <p className="text-md">25 comments</p>
          </div>
        </div>
    </div>
  );
};

export default Post;

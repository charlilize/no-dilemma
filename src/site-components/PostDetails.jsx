import { useEffect, useState } from "react"
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from "../client";
import { formatDistanceStrict } from 'date-fns';
import { Button } from "@/components/ui/button"

const PostDetails = () => {
  const { postid } = useParams(); // get id from the URL
  const [post, setPost] = useState(null); // to hold specific post associated with the id
  const [poll, setPoll] = useState({ poll_id: "", question: "", options: [] });
  
  const [count, setCount] = useState(); 

  const location = useLocation();

  // To fetch the post data
  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", postid)
      .single();
  
    if (error) {
      console.error("Error retrieving post data", error);
    } else {
      setPost(data);
      setCount(data.upvotes_count);
    }
  };
  
  // To fetch the poll data w/ the options
  const fetchPoll = async () => {
    const { data, error } = await supabase
      .from("polls")
      .select()
      .eq("post_id", postid)
      .single();
  
    if (error) {
      console.error("Error retrieving poll question", error);
    } else {
      const pollData = { question: data.question, poll_id: data.id, options: [] };
  
      const { data: optionsData, error: optionsError } = await supabase
        .from("poll_options")
        .select("option")
        .eq("poll_id", data.id);
  
      if (optionsError) {
        console.error("Error retrieving poll options", optionsError);
      } else {
        pollData.options = optionsData.map((option) => option.option);
      }
  
      setPoll(pollData);
    }
  };

  // Fetch the data if the id or location changes
  useEffect(() => {
    const fetchData = async () => {
      await fetchPost();
      await fetchPoll();
    };
  
    fetchData();
  }, [postid, location]); 

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return formatDistanceStrict(date, new Date(), { addSuffix: true, includeSeconds: true });
  }

  
  const chooseOption = () => {

  }

  console.log(poll.options)
  return (
    <div className="w-full h-screen bg-gray-200 rounded-3xl flex flex-col items-center justify-center overflow-y-auto p-4">
      {post ? (
      <>
        <div className="bg-white p-5 h-1/2 md:w-11/12 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md overflow-y-auto">
          <p>{post.created_at && formatTimestamp(post.created_at)} · 2 answers</p>
          <h1 className="text-3xl bold">{post.title}</h1>
          <p>{post.description}</p>
          {post && poll && poll.options !== undefined && poll.options !== null ? (
            poll.options.length > 0 ? (
              <div className=" flex flex-col bg-slate-200 rounded-lg p-4 w-5/12">
                <h2 className="text-xl text-center">{poll.question}</h2>
                {poll.options.map((option, index) => (
                  <Button onClick={chooseOption()} className="bg-slate-100 text-black hover:bg-slate-300" key={index}>{option}</Button>
                ))}
                <Button>Submit</Button>
              </div>
            ) : (
              <p>Loading options...</p>
            )
          ) : (
            <p>Loading poll...</p>
          )}
        </div>
        <div className="bg-white h-1/2 p-5 md:w-11/12 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md max-h-96 overflow-y-auto">
        </div>
      </>
      ) : (
      <p>Loading Post...</p>
    )}
    </div>
  )
};

export default PostDetails;

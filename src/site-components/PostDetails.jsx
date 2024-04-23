import { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
import { supabase } from "../client";
import { formatDistanceStrict } from 'date-fns';
import { Button } from "@/components/ui/button"

const PostDetails = () => {
  const { postid } = useParams(); // get id from the URL
  const [post, setPost] = useState(null); // to hold specific post associated with the id
  const [poll, setPoll] = useState({ poll_id: "", question: "", options: [] });
  
  const [count, setCount] = useState(); 

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return formatDistanceStrict(date, new Date(), { addSuffix: true, includeSeconds: true });
  }
  
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
      .from("posts")
      .select()
      .eq("id", postid)
      .single()
      
      if (error) {
        console.error("Error retrieving post data", error);
      } else {
        setPost(data);
        setCount(data.upvotes_count);
      }
    };
    fetchPost();
  }, [postid]); // rerun when the id changes

  // Find poll question associated with the post
  useEffect(() => {
    const fetchPoll = async () => {
      const { data, error } = await supabase
        .from("polls")
        .select()
        .eq("post_id", postid)
        .single();

      if (error) {
        console.error("Error retrieving poll question", error);
      } else {
        setPoll({ question: data.question, poll_id: data.id })
      }
    }
    fetchPoll();
  }, [postid])

  // Find poll options associated with the poll
  useEffect(() => {
    const fetchPollOptions = async () => {
      if (poll.poll_id) {
        const { data, error } = await supabase
          .from("poll_options")
          .select("option")
          .eq("poll_id", poll.poll_id);
  
        if (error) {
          console.error("Error retrieving poll options", error);
        } else {
          setPoll({ ...poll, options: data.map(option => option.option) });
        }
      }
    };
  
    fetchPollOptions();
  }, [poll.poll_id]);
  

  

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
                  <Button className="bg-slate-100 text-black hover:bg-slate-300" key={index}>{option}</Button>
                ))}
                <Button>Submit</Button>
              </div>
            ) : (
              <p>Loading options...</p>
            )
          ) : (
            ""
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

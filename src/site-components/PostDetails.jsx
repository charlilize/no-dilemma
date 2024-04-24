import { useEffect, useState } from "react"
import { useParams, useLocation } from 'react-router-dom';
import { supabase } from "../client";
import { formatDistanceStrict } from 'date-fns';
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faSquareCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { faCircleUp } from '@fortawesome/free-regular-svg-icons';
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

const PostDetails = () => {
  const { postid } = useParams(); // get id from the URL
  const [post, setPost] = useState(null); // to hold specific post associated with the id
  const [poll, setPoll] = useState({ poll_id: "", question: "", options: [] });
  const [count, setCount] = useState(0); 
  const [highlightedOption, setHighlightedOption] = useState("");
  const [voted, setVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
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
      setTotalVotes(data.answers_count)
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
        const pollData = { question: data.question, poll_id: data.id, options: [] }; // question and poll_id are populated

        const { data: optionsData, error: optionsError } = await supabase
          .from("poll_options")
          .select()
          .eq("poll_id", data.id);

        if (optionsError) {
          console.error("Error retrieving poll options", optionsError);
        } else {
          pollData.options = optionsData.map((option) => ({ // retrieve option and vote count
            option: option.option,
            voteCount: option.vote_count,
          }));
        }
        
        setPoll(pollData); // store all data in usestate poll data
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

  const chooseOption = (option) => {
    if (option === highlightedOption) {
      setHighlightedOption("");
    } else {
      setHighlightedOption(option);
    }
  }

  // Update the number of upvotes on the local count variable and the database
  const updateUpvotes = async (event) => {
    event.preventDefault();
    await supabase 
      .from("posts")
      .update({ upvotes_count: count + 1 })
      .eq("id", postid)

      setCount((count) => count + 1);
    };

  // Vote an option and update supabase
  const voteOption = async (option, event) => {
    try{
      // to find where the option lies in the options array in poll variable
      const selectedOptionIndex = poll.options.findIndex((opt) => opt.option === option)
  
      if (selectedOptionIndex === -1) {
        console.error("Selected option not found in poll options");
        return;
      }

      const selectedOption = poll.options[selectedOptionIndex];
  
      // Update the vote count in the database
      const { error } = await supabase 
        .from("poll_options")
        .update({ vote_count: selectedOption.voteCount + 1 })
        .eq("option", option)
        
        // Update the vote count in the state
        const updatedOptions = [...poll.options];
        updatedOptions[selectedOptionIndex] = {
          ...selectedOption,
          voteCount: selectedOption.voteCount + 1,
        };
  
        setPoll((prevPoll) => ({...prevPoll, options: updatedOptions }))
        setVoted(true);

        const votes = updatedOptions.reduce((acc, option) => {
          return acc + (option.voteCount || 0);
        }, 0);

        await supabase 
          .from("posts")
          .update({ answers_count: votes })
          .eq("id", postid)

        setTotalVotes(votes);
      } catch (error) {
      console.error("Error voting option", error);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-200 rounded-3xl flex flex-col items-center justify-center overflow-y-auto p-4">
      {post ? (
      <>
        <div className="bg-white p-5 md:w-11/12 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md">
          <div className="flex justify-between">
            <Link to="/forum">
              <FontAwesomeIcon className="text-3xl" icon={faSquareCaretLeft} />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <FontAwesomeIcon className="text-3xl" icon={faEllipsis} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit Post</DropdownMenuItem>
                <DropdownMenuItem>Delete Post</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-between items-center">
            <p>{post.created_at && formatTimestamp(post.created_at)} · {totalVotes} answers</p>
          </div>
          <h1 className="text-3xl bold font-extrabold">{post.title}</h1>
          <p>{post.description}</p>
          {post && poll && poll.options !== undefined && poll.options !== null ? (
            poll.options.length > 0 ? (
              <div className=" flex flex-col bg-slate-200 rounded-lg p-4 w-5/12">
                <h2 className="text-xl text-center">{poll.question}</h2>
                {voted === false ? (
                  poll.options.map((option, index) => (
                    <Button 
                      onClick={() => chooseOption(option.option)} 
                      className={`bg-slate-100 text-black justify-start hover:bg-slate-300 ${highlightedOption === option.option ? "bg-red-600 text-white hover:bg-red-500" : ""}`}
                      key={index}>
                      {option.option}
                    </Button>
                  ))
                ) : (poll.options.map((option, index) => (
                  <div className="bg-white flex justify-between h-10 px-4 py-2 text-sm" key={index}>
                    <p>{option.option}</p>
                    <p>{option.voteCount} votes</p>
                  </div>
                )))
                }
                <Button disabled={highlightedOption === "" || voted === true} onClick={() => voteOption(highlightedOption)}>Submit</Button>
              </div>
            ) : (
              <p>Loading options...</p>
            )
          ) : (
            <p>Loading poll...</p>
          )}
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
        <div className="bg-white h-1/2 p-5 md:w-11/12 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md max-h-96 overflow-y-auto">
          <h2 className="text-xl">Comments</h2>
          {/* comments here */}
          <div className="flex "> 
            <Input placeholder="Add a comment.."/>
            <Button>Comment</Button>
          </div>
        </div>
      </>
      ) : (
      <p>Loading Post...</p>
    )}
    </div>
  )
};

export default PostDetails;

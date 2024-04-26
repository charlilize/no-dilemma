import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "../client";
import Comment from "./Comment";

const API_URL = "https://api.api-ninjas.com/v1/randomuser";
const API_KEY = import.meta.env.VITE_RANDOM_USER_API_KEY;

const CommentSection = ({ postid, onDataChange }) => {
  const [userComment, setUserComment] = useState({
    text: "",
    username: "",
  });
  const [failedSubmit, setFailedSubmit] = useState(false);
  const [commented, setCommented] = useState(false);
  const [comments, setComments] = useState([]);

  // Retrieve the all post's comments
  useEffect(() => {
    const fetchComments = async () => {

      const { data, error } = await supabase
        .from("comments")
        .select()
        .eq("post_id", postid);
      
      if (error) {
        console.log("Error retrieving post's comments", error);
      } else {
        setComments(data);
      }
    }
    fetchComments();
    onDataChange(comments.length)
  }, [comments]);

  // retrieve random username when user comments
  useEffect(() => {
    const fetchRandomUser = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            "X-Api-Key": API_KEY,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const username = data.username;
          setUserComment({ username });
        } else {
          console.error("Error fetching random user:", response.status);
        }
      } catch (error) {
        console.error("Error fetching random user:", error);
      }
    };

    fetchRandomUser();
  }, []);

  const handleSubmit = async (event) => {
    if (userComment.text === "") {
      setFailedSubmit(true);
      setCommented(false);
      return;
    }
    setFailedSubmit(false);

    const { error } = await supabase
      .from("comments")
      .insert({
        comment: userComment.text,
        post_id: postid,
        author: userComment.username,
      })
      .select();

    if (error) {
      console.error("Error adding comment");
    } else {
      setUserComment((prevState) => ({ ...prevState, text: "" }));
      document.getElementById("comment").value = "";
      fetchComments();
      setCommented(true);
      onDataChange(comments.length)
    }
  };

  const handleChange = (event) => {
    setUserComment((prevState) => ({
      ...prevState,
      text: event.target.value,
    }));
  };

  return (
    <div className="bg-white p-5 md:w-11/12 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md">
      <h2 className="text-xl">Comments</h2>
      <h3 className="text-red-500">
        {failedSubmit ? "Unable to comment. Please try again." : ""}
      </h3>
      <div className="flex ">
        <Input
          onChange={handleChange}
          id="comment"
          placeholder="Add a comment.."
        />
        <Button type="submit" onClick={handleSubmit}>
          Comment
        </Button>
      </div>
      <h3 className="text-green-500">{commented ? "Sent!" : ""}</h3>
      <div className="flex flex-col">
        {comments ? (
          comments.map((com) => (
            <Comment
              key={com.id}
              user={com.author}
              text={com.comment}
              time={com.created_at}
              id={com.id}
            />
          ))
        ) : (<p>Loading comments...</p>)
        }
      </div>
    </div>
  );
};

export default CommentSection;

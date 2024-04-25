import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "../client";

const API_URL = "https://api.api-ninjas.com/v1/randomuser";
const API_KEY = import.meta.env.VITE_RANDOM_USER_API_KEY;

const CommentSection = ({ postid }) => {
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
  }, [postid]);

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

    const { data, error } = await supabase
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
      setCommented(true);
    }
  };

  const handleChange = (event) => {
    setUserComment((prevState) => ({
      ...prevState,
      text: event.target.value,
    }));
  };

  console.log(userComment.text)
  return (
    <div className="bg-white h-1/2 p-5 md:w-11/12 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md max-h-96 overflow-y-auto">
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
    </div>
  );
};

export default CommentSection;

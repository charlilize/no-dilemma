import { useState } from "react";
import { supabase } from "../client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom"

const CreatePost = () => {
  const [post, setPost] = useState({
    title: "",
    descrip: "",
    question: "",
    options: [""],
  });

  const addPollOption = () => {
    if (post.options.length < 10) {
      setPost((prevPost) => ({ // Update post's poll options
        ...prevPost,
        options: [...prevPost.options, ""],
      }));
    }
  };

  // Update post use state variable
  const handleChange = (event) => {
    const { id, value } = event.target;
    setPost((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  // Push post data to supabase
  const createPost = async (event) => {
    event.preventDefault();

    await supabase
      .from("posts") // call posts table from supabase
      .insert({ title: post.title, description: descrip.type })
      .select();
  
      window.location = "/forum";
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-5 mb-4 flex flex-col border bg-card text-card-foreground shadow-2xl rounded-lg h-screen w-1/2">
        <h1 className="text-3xl bold">New Post</h1>
        <Label htmlFor="title">Title</Label>
        <Input 
          type="title" 
          id="title" 
          placeholder="Post's title..." 
          onChange={handleChange}
        />
        <Label htmlFor="descrip">Description</Label>
        <Textarea
          type="descrip"
          id="descrip"
          placeholder="Explain your dilemma..."
          onChange={handleChange}
        ></Textarea>
        <h2 className="text-2xl bold">Your Poll</h2>
        <Label htmlFor="question">Poll Title</Label>
        <Input
          type="question"
          id="question"
          placeholder="Put your question..."
          onChange={handleChange}
        />
        {post.options.map((option, index) => (
          <Input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) =>
              setPost({
                ...post,
                options: post.options.map((opt, i) => // Update poll option if it changes
                  i === index ? e.target.value : opt
                ),
              })
            }
          />
        ))}
        <Button
          className={`${
            post.options.length >= 10 ? "bg-red-500 cursor-not-allowed hover:bg-red-600" : ""
          }`}
          onClick={addPollOption}
        >
          {post.options.length >= 10
            ? "You've reached the maximum options"
            : "+ Add Poll Option"}
        </Button>
        <div className="flex justify-end">
            <Link to="/forum">
              <Button>Cancel</Button>
            </Link>
            <Button type="submit" value="submit" onClick={createPost} className="bg-red-500 ">Create Post</Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

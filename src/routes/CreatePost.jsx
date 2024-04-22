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
  const [unableToCreatePost, setUnableToCreatePost] = useState(false);

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

    // Prevent adding empty fields
    if (!post.title.trim() || !post.descrip.trim() || !post.question.trim()) {
      setUnableToCreatePost(true);
      return;
    }

    if (post.options.some(option => !option.trim())) {
      setUnableToCreatePost(true);
      return;
    }

    setUnableToCreatePost(false);

    // Create the post
    const { data: postData, error: postError } = await supabase
    .from("posts")
    .insert({ title: post.title, description: post.descrip })
    .select()
    .single();

    if (postError) {
      console.error("Error inserting post:", postError);
      return;
    }

    const postId = postData.id;

    // Create poll
    const { data: pollData, error: pollError } = await supabase
      .from("polls")
      .insert({ question: post.question, post_id: postId })
      .select()
      .single();

    if (pollError) {
      console.error("Error inserting poll:", pollError);
      return;
    }

    const pollId = pollData.id;

    // Insert each poll option
    const optionInsertPromises = post.options.map((option) => 
      supabase.from("poll_options").insert({ poll_id: pollId, option})
    );

    const optionInsertResults = await Promise.all(optionInsertPromises);

    const optionInsertErrors = optionInsertResults.filter((result) => result.error);
  
    if (optionInsertErrors.length > 0) {
      console.error("Error inserting poll options:", optionInsertErrors);
      return;
    }
  
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
            <h3 className="text-red-500">
              {unableToCreatePost == true && (!post.title.trim() || !post.descrip.trim() || !post.question.trim() || post.options.some(option => !option.trim())) ? "A field is empty. Please fill in all fields." : ""}
            </h3>
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

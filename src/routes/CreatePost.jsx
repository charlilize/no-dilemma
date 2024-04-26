import { useState } from "react";
import { supabase } from "../client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea }  from "@/components/ui/textarea";
import { Link } from "react-router-dom"

const CreatePost = () => {
  const [post, setPost] = useState({
    user: "",
    title: "",
    descrip: "",
    question: "",
    options: [""],
  });
  const [unableToCreatePost, setUnableToCreatePost] = useState(false);
  const [duplicateOptions, setDuplicateOptions] = useState(false);

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
    if (!post.title.trim() || !post.descrip.trim() || !post.question.trim() || !post.user.trim()) {
      setUnableToCreatePost(true);
      setDuplicateOptions(false);
      return;
    }
    if (post.options.some(option => !option.trim()) || post.options.length === 0) {
      setUnableToCreatePost(true);
      setDuplicateOptions(false);
      return;
    }
    const uniqueOptions = new Set(post.options.map((option) => option.trim().toLowerCase())); // check if any options have the same name
    if (uniqueOptions.size !== post.options.length) {
      setDuplicateOptions(true);
      console.error('Duplicate options are not allowed.');
      return;
    }
    setUnableToCreatePost(false);
    setDuplicateOptions(false);

    // Create the post
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({ title: post.title, description: post.descrip, author: post.user })
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

  const removeOption = (index) => {
    setPost((prevPost) => ({
      ...prevPost,
      options: prevPost.options.filter((_, i) => i !== index),
    }))
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-5 flex flex-col border bg-card text-card-foreground shadow-2xl rounded-lg w-1/2 gap-3">
        <h1 className="text-3xl font-bold">New Post</h1>
        <Label htmlFor="user">Username</Label>
        <Input 
          type="user" 
          id="user" 
          placeholder="Enter display name for post" 
          onChange={handleChange}
        />
        <Label htmlFor="title">Title</Label>
        <Input 
          type="title" 
          id="title" 
          placeholder="Post's title" 
          onChange={handleChange}
        />
        <Label htmlFor="descrip">Description</Label>
        <Textarea
          type="descrip"
          id="descrip"
          placeholder="Explain your dilemma"
          onChange={handleChange}
        />
        <h2 className="text-2xl mt-2 font-bold">Your Poll</h2>
        <Label htmlFor="question">Poll Title</Label>
        <Input
          type="question"
          id="question"
          placeholder="Put your question"
          onChange={handleChange}
        />
        <Label htmlFor="options">Poll Options</Label>
        {post.options.map((option, index) => (
          <div className="flex">
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
          <Button onClick={() => removeOption(index)}>Remove</Button>
          </div>
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
        <div className="flex justify-end gap-5 my-2">
            <h3 className="text-red-500">
              {unableToCreatePost == true && (!post.title.trim() || !post.descrip.trim() || !post.user.trim() || !post.question.trim() || post.options.some(option => !option.trim())) ? "A field is empty. Please fill in all fields." : ""}
              {duplicateOptions ===  true ? " Options cannot have the same name." : ""}
            </h3>
            <Link to="/forum">
              <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 border-b-4 border-black rounded">Cancel</button>
            </Link>
            <button type="submit" value="submit" onClick={createPost} className="bg-mesa hover:bg-mesa-light text-white font-bold py-2 px-4 border-b-4 border-black rounded">Create Post</button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

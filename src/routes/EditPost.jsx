import { useState, useEffect } from "react";
import { supabase } from "../client";
import { useParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DeletePostButton from "@/site-components/DeletePostButton";

const EditPost = () => {
  const { postid } = useParams();
  const [post, setPost] = useState({
    user: "",
    title: "",
    descrip: "",
    question: "",
    options: [""],
  });
  const [poll, setPoll] = useState({ poll_id: "", question: "", options: [] });
  const [newOptions, setNewOptions] = useState([]); // New state for new poll options
  const [unableToEditPost, setUnableToEditPost] = useState(false);
  const [duplicateOptions, setDuplicateOptions] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, pollData] = await Promise.all([
          fetchPost(),
          fetchPoll(),
        ]);
        setPost({
          user: postData.data.author,
          title: postData.data.title,
          descrip: postData.data.description,
        });
        setPoll(pollData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [postid]);

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
      return { data };
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
      const pollData = {
        question: data.question,
        poll_id: data.id,
        options: [],
      };

      const { data: optionsData, error: optionsError } = await supabase
        .from("poll_options")
        .select()
        .eq("poll_id", data.id);

      if (optionsError) {
        console.error("Error retrieving poll options", optionsError);
      } else {
        pollData.options = optionsData.map((option) => option.option);
      }

      return pollData;
    }
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setPost((prev) => ({ ...prev, [id]: value }));
  };

  const handleNewPollOptionChange = (index, value) => {
    setNewOptions((prevOptions) =>
      prevOptions.map((option, i) => (i === index ? value : option))
    );
  };

  const addNewPollOption = () => {
    if (poll.options.length + newOptions.length < 10) {
      setNewOptions((prevOptions) => [...prevOptions, ""]);
    }
  };

  const removeNewOption = (index) => {
    setNewOptions((prevOptions) => prevOptions.filter((_, i) => i !== index));
  };

  // Edit the post
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent adding empty fields
    if (!post.title.trim() || !post.descrip.trim() || !poll.question.trim() || !post.user.trim()) {
      setUnableToEditPost(true);
      setDuplicateOptions(false);
      return;
    }
    if (newOptions.some(option => !option.trim())) {
      setUnableToEditPost(true);
      setDuplicateOptions(false);
      return;
    }
    const uniqueOptions = new Set(newOptions.map((option) => option.trim().toLowerCase())); // check if any options have the same name
    if (uniqueOptions.size !== newOptions.length) {
      setDuplicateOptions(true);
      console.error('Duplicate options are not allowed.');
      return;
    }
    setUnableToEditPost(false);
    setDuplicateOptions(false);

    try {
      // Edit the post
      await supabase
        .from("posts")
        .update({
          title: post.title,
          description: post.descrip,
          author: post.user,
        })
        .eq("id", postid);

      // Add new poll options
      const newOptionPromises = newOptions.map((opt) =>
        supabase
          .from("poll_options")
          .insert({ option: opt, poll_id: poll.poll_id })
      );

      const newOptionResults = await Promise.all(newOptionPromises);

      const newOptionErrors = newOptionResults.filter((result) => result.error);

      if (newOptionErrors.length > 0) {
        console.error("Error adding new poll options", newOptionErrors);
        return;
      }

      window.location = "/forum";
      // Optionally, you can redirect to the post details page or display a success message
    } catch (error) {
      console.error("Error updating post and poll", error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="bg-white p-5 flex flex-col border bg-card text-card-foreground shadow-2xl rounded-lg w-1/2 gap-3">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        {post && poll.options ? (
          <>
            <Label htmlFor="user">Display Name</Label>
            <Input
              type="user"
              id="user"
              placeholder="Enter display name for post"
              value={post.user}
              onChange={handleChange}
            />
            <Label htmlFor="title">Title</Label>
            <Input
              type="title"
              id="title"
              placeholder="Post's title"
              value={post.title}
              onChange={handleChange}
            />
            <Label htmlFor="descrip">Description</Label>
            <Textarea
              id="descrip"
              placeholder="Explain your dilemma"
              value={post.descrip}
              onChange={handleChange}
            />
            <h2 className="text-2xl mt-2 font-bold">Your Poll</h2>
            <h3 className="text-red-500">
              *Current poll question and options cannot be changed after
              publishing to protect voter intent.
            </h3>
            <Label htmlFor="question">Poll Title</Label>
            <Input
              type="question"
              id="question"
              placeholder="Put your question"
              value={poll.question}
              disabled
            />
            <Label htmlFor="options">Poll Options</Label>
            {poll.options.map((option, index) => (
              <Input key={index} value={option} disabled />
            ))}
            {newOptions.map((option, index) => (
              <div className="flex" key={index}>
                <Input
                  type="text"
                  placeholder={`Option ${poll.options.length + index + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleNewPollOptionChange(index, e.target.value)
                  }
                />
                <Button onClick={() => removeNewOption(index)}>Remove</Button>
              </div>
            ))}
            <Button
              className={`${
                poll.options.length + newOptions.length >= 10
                  ? "bg-red-500 cursor-not-allowed disabled hover:bg-red-600"
                  : ""
              }`}
              onClick={addNewPollOption}
            >
              {poll.options.length + newOptions.length >= 10
                ? "You've reached the maximum options"
                : "+ Add Poll Option"}
            </Button>
            <div className="flex justify-end gap-5 my-2">
              <h3 className="text-red-500">
                {unableToEditPost == true &&
                (!post.title.trim() ||
                  !post.descrip.trim() ||
                  !post.user.trim() ||
                  !poll.question.trim() ||
                  newOptions.some((option) => !option.trim()))
                  ? "A field is empty. Please fill in all fields."
                  : ""}
                  {duplicateOptions ===  true ? " Options cannot have the same name." : ""}
              </h3>
              <Link to="/forum">
                <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 border-b-4 border-black rounded">Cancel</button>
              </Link>
              <DeletePostButton
                postid={postid}
                pollid={poll.poll_id}
                btnCSS={true}
              />
              <button
                type="submit"
                value="submit"
                onClick={handleSubmit}
                className="bg-mesa hover:bg-mesa-light text-white font-bold py-2 px-4 border-b-4 border-black rounded"
              >
                Edit Post
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default EditPost;

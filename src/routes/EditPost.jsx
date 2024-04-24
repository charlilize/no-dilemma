import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import CreatePost from "./CreatePost";
import { supabase } from "@/client";

const EditPost = () => {
  const { postid } = useParams();
  const [post, setPost] = useState({
    user: "",
    title: "",
    descrip: "",
    question: "",
    options: [""],
  });

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("posts")
        .select()
        .eq("id", postid)
        .single();
      setPost(data);
    }
    fetchPost();
  }, [postid]);


  
  

  return (
    <>
    </>
  )

};

export default EditPost;

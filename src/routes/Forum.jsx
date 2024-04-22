import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"
import Post from "../site-components/Post"
import { Link } from "react-router-dom"
import { supabase } from "@/client"

const Forum = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select()
        .order("created_at", { ascending: true });
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="w-full h-screen bg-gray-200 rounded-3xl">
        <div className="flex flex-col items-start my-9 ml-20 gap-3">
        <div className="flex justify-center w-full">
          <h1 className="font-bold text-3xl text-center">Discover and vote on what others are asking...</h1>
        </div>
          <Input placeholder=" Search for a topic or a question" className="w-9/12 text-lg mt-6"/>
          <div className="flex gap-5">
            <Button>Newest</Button>
            <Button>Trending</Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-evenly">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post 
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              timeCreated={post.created_at}
              upvotes={post.upvotes_count}
            />
          ))
        ) : (<p>No posts created</p>)
        }
        </div>
        <Link to="/createPost">
          <Button className="fixed bottom-4 left-1/2 transform -translate-x-1/2">+ Create Post</Button>
        </Link>
      </div>
  )
};

export default Forum;

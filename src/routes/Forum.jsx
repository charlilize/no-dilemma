import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/search-input"
import { Button } from "@/components/ui/button"
import Post from "../site-components/Post"
import { Link } from "react-router-dom"
import { supabase } from "@/client"

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [newestFilter, setNewestFilter] = useState(false);
  const [trendingFilter, setTrendingFilter] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select()
        .order("created_at", { ascending: true });
      setPosts(data);
      setFilteredPosts(data);
    };
    fetchPosts();
  }, []);

  const sortByUpvotes = (arr) => {
    setTrendingFilter(!trendingFilter);
    if (trendingFilter) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(arr.slice().sort((a, b) => b.upvotes_count - a.upvotes_count));
    }
  }

  const sortByNewest = (arr) => {
    setNewestFilter(!newestFilter);
    if (newestFilter) {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(arr.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    }  
  }
  
  return (
    <div className="w-full p-16 min-h-screen bg-gray-200 rounded-3xl">
        <div className="flex flex-col items-start gap-3">
        <div className="flex justify-center w-full">
          <h1 className="font-bold text-3xl text-center">Discover and vote on what others are asking...</h1>
        </div>
          <Input placeholder=" Search for a topic or a question" className="w-9/12 text-lg mt-6"/>
          <div className="flex gap-5">
            <button onClick={() => sortByNewest(posts)}className={`bg-mesa hover:bg-mesa-light text-white font-bold py-2 px-4 rounded ${newestFilter === true ? "border-2 border-black" : ""}`}>Newest</button>    
            <button onClick={() => sortByUpvotes(posts)} className={`bg-mesa hover:bg-mesa-light text-white font-bold py-2 px-4 rounded ${trendingFilter === true ? "border-2 border-black" : ""}`}>Trending</button> 
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex w-full flex-wrap justify-center gap-10 ">
            {filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Post 
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  description={post.description}
                  timeCreated={post.created_at}
                  upvotes={post.upvotes_count}
                  totalAnswers={post.answers_count}
                />
              ))
            ) : (<p>No posts created</p>)
          }
          </div>
        </div>

        <Link to="/createPost">
          <button className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-mesa hover:bg-mesa-light text-white font-bold py-2 px-4 border-b-4 border-black rounded">+ Create Post</button>
        </Link>
      </div>
  )
};

export default Forum;

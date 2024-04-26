import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/search-input"
import Post from "../site-components/Post"
import { Link } from "react-router-dom"
import { supabase } from "@/client"

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [newestFilter, setNewestFilter] = useState(false);
  const [trendingFilter, setTrendingFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select()
        .order("created_at", { ascending: true });
  
      const filteredData = data.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      setPosts(data);
      setFilteredPosts(filteredData);
    };
  
    fetchPosts();
  }, [searchQuery]);

  const sortByUpvotes = (arr) => {
    setTrendingFilter(!trendingFilter);
  
    if (newestFilter && trendingFilter) {
      sortByUpvotesAndNewest(arr);
    }
    else if (trendingFilter) {
      setFilteredPosts(posts);
    } else {
      const filteredData = arr.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const sortedFilteredData = filteredData.sort(
        (a, b) => b.upvotes_count - a.upvotes_count
      );
      setFilteredPosts(sortedFilteredData);
    }
  };
  
  const sortByNewest = (arr) => {
    setNewestFilter(!newestFilter);
  
    if (newestFilter && trendingFilter) {
      sortByUpvotesAndNewest(arr);
    }
    else if (newestFilter) {
      setFilteredPosts(posts);
    } else {
      const filteredData = arr.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const sortedFilteredData = filteredData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFilteredPosts(sortedFilteredData);
    }
  };

  const sortByUpvotesAndNewest = (arr) => {
    const filteredData = arr.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sortedFilteredData = filteredData.sort((a, b) => {
      const upvotesComparison = b.upvotes_count - a.upvotes_count;
      if (upvotesComparison !== 0) {
        return upvotesComparison;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setFilteredPosts(sortedFilteredData);
  };

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  return (
    <div className="w-full p-10 min-h-screen bg-gray-200 rounded-3xl">
        <div className="flex flex-col items-start gap-5">
        <div className="flex justify-center w-full">
          <h1 className="font-extrabold text-3xl text-center">Discover and vote on what others are asking...</h1>
        </div>
          <Input placeholder=" Search for a topic or a question" className="w-9/12 text-lg mt-6" onChange={handleChange}/>
          <div className="flex gap-5">
            <button onClick={() => sortByNewest(posts)}className={`bg-mesa hover:bg-mesa-light text-white font-bold py-2 px-4 rounded ${newestFilter === true ? "border-2 border-black" : "border-2 border-mes"}`}>Newest</button>    
            <button onClick={() => sortByUpvotes(posts)} className={`bg-mesa hover:bg-mesa-light text-white font-bold py-2 px-4 rounded ${trendingFilter === true ? "border-2 border-black" : "border-2 border-mes"}`}>Trending</button> 
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex w-full flex-wrap justify-center mt-10 gap-10 ">
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
            ) : (<p className="text-xl font-bold">No posts found</p>)
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

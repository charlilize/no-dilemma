import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Post from "../site-components/Post"

const Forum = () => {
  return (
    <div className="w-full h-screen bg-gray-200 rounded-3xl">
        <div className="flex flex-col items-start my-9 ml-20 gap-3">
        <h1 className="font-bold text-3xl text-center">Discover and vote on what others are asking...</h1>
          <Input placeholder=" Search for a topic or a question" className="w-9/12 text-lg mt-6"/>
          <div className="flex gap-5">
            <Button>Newest</Button>
            <Button>Trending</Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-evenly">
          {/* <Post/>
          <Post/>
          <Post/> */}
        </div>
        <Button className="fixed bottom-4 left-1/2 transform -translate-x-1/2">+ Create Post</Button>
      </div>
  )
};

export default Forum;

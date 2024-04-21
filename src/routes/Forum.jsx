import React from "react"
import { Input } from "@/components/ui/input"
import Post from "../site-components/Post"

const Forum = () => {
  return (
    <div className="w-full h-screen bg-gray-200 rounded-3xl">
      <div className="flex my-9 ml-20">
        <Input placeholder="Search for a topic or a question" className="w-9/12 text-lg mt-6"/>
      </div>
      <div className="flex flex-wrap justify-evenly">
        <Post/>
        <Post/>
        <Post/>
      </div>
    </div>
  )

};

export default Forum;

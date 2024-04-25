import React from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "../client";

const CommentSection = ({ postid }) => {

  const handleSubmit = () => {
    
  }

  return (
        <div className="bg-white h-1/2 p-5 md:w-11/12 w-4/5 mb-4 flex flex-col border bg-card text-card-foreground shadow-md max-h-96 overflow-y-auto">
        <h2 className="text-xl">Comments</h2>
        <div className="flex "> 
        <Input placeholder="Add a comment.."/>
        <Button onClick={handleSubmit}>Comment</Button>
        </div>
    </div>
  )

};

export default CommentSection;

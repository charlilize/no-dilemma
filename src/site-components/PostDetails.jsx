import React from "react"
import { useParams } from 'react-router-dom';
import { Card, CardTitle } from "@/components/ui/card"
import { supabase } from "../client";

const PostDetails = ({data}) => {
  const {postid} = useParams; 

  return (
    <Card>
      <CardTitle>Post Title</CardTitle>
    </Card>
  )
};

export default PostDetails;

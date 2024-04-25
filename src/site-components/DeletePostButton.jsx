import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "../client";

const DeletePostButton = ({ postid, pollid, btnCSS }) => {
    const deletePost = async (event) => {
        event.preventDefault();
    
        // Delete post
        await supabase.from("posts").delete().eq("id", postid);
    
        // Delete poll and poll options
        await supabase.from("polls").delete().eq("post_id", postid);
        await supabase.from("poll_options").delete().eq("poll_id", pollid);
    
        window.location = "/forum";
    };

 return (
    <AlertDialog>
      <AlertDialogTrigger className={btnCSS === true ? "bg-primary text-sm text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-lg" : ""}>
        Delete
      </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure?
        </AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone. This will permanently delete the post.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={deletePost}>Delete Post</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
 )

}

  export default DeletePostButton;

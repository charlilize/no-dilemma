import { useState } from "react";
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
import { Input } from "@/components/ui/input";

const EditPostBtn = ({ postid, password, pollid }) => {
  const [inputKey, setInputKey] = useState("");
  const [failedAttempt, setFailedAttempt] = useState(false);

  const handleChange = (event) => {
    setFailedAttempt(false);
    setInputKey(event.target.value);
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  };

  const editPost = (event) => {
    event.preventDefault();
    if (inputKey === password) {
      setFailedAttempt(false);
      window.location = `/editPost/${postid}/${pollid + getRandomNumber()}`;
    } else {
      setFailedAttempt(true);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>Edit</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Is this post yours?</AlertDialogTitle>
          <AlertDialogDescription>
            To edit the post, enter the secret key:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input type="text" onChange={handleChange} value={inputKey}/>
        <AlertDialogFooter className="flex items-center">
          <h3 className="text-red-500">
            {failedAttempt ? " Wrong passcode." : ""}
          </h3>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={editPost}>Edit Post</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditPostBtn;

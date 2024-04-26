import { formatDistanceStrict } from "date-fns";
import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "../client";

const Comment = ({ text, user, time, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatTimestamp = useMemo(() => {
    return (timestamp) => {
      const date = new Date(timestamp);
      return formatDistanceStrict(date, new Date(), {
        addSuffix: true,
        includeSeconds: true,
      });
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const deleteComment = async () => {
    await supabase.from("comments").delete().eq("id", id);
  };

  return (
    <div
      className={`p-3 ${(isHovered || isDropdownOpen) ? "bg-gray-100" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between">
        <div className="flex gap-1">
          <h5 className="font-semibold">{user} ·</h5>
          <h5 className="text-gray-400">{formatTimestamp(time)}</h5>
        </div>
        {(isHovered || isDropdownOpen) && (
          <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownToggle}>
            <DropdownMenuTrigger>
              <FontAwesomeIcon className="text-sm" icon={faEllipsis} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={deleteComment}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p>{text}</p>
    </div>
  )
};

export default Comment;

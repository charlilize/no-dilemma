import { formatDistanceStrict } from "date-fns";
import { useMemo } from 'react';

const Comment = ({ text, user, time }) => {
  const formatTimestamp = useMemo(() => {
    return (timestamp) => {
      const date = new Date(timestamp);
      return formatDistanceStrict(date, new Date(), {
        addSuffix: true,
        includeSeconds: true,
      });
    };
  }, []);


  return (
    <div>
        <div className="flex gap-1">
        <h5 className="font-semibold">{user} ·</h5>
        <h5 className="text-gray-400">{formatTimestamp(time)}</h5>
        </div>
        <p>{text}</p>
    </div>
  )
};

export default Comment;

import * as React from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500 translate-y-3" />
      </div>
      <input
        type={type}
        className={cn(
          "shadow-xl flex h-10 rounded-md border border-input bg-background px-3 py-2 pl-10 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export { Input };

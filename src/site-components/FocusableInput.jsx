// FocusableInput.jsx
import React, { useRef, useCallback } from 'react';

const FocusableInput = React.forwardRef(({ onChange, ...props }, ref) => {
  const inputRef = useRef(null);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <input
      {...props}
      ref={(node) => {
        ref.current = node;
        inputRef.current = node;
      }}
      onChange={onChange}
      onFocus={focusInput}
    />
  );
});

export default FocusableInput;

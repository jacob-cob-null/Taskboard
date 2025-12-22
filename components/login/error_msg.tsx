import React from "react";

interface ErrorMsgProp {
  onClose: () => void;
}

const Error_msg = ({ onClose }: ErrorMsgProp) => {
  return (
    <div>
      <p>Login Failed, Try again</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Error_msg;

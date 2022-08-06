import React, { useState } from "react";

export type CopyMssg = "Click to copy" | "Copied!" | "Please try again";

const useCopy = () => {
  const [copyStatus, setCopyStatus] = useState<CopyMssg>("Click to copy");

  const copyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopyStatus("Copied!"))
      .catch((err) => {
        console.log(err);
        setCopyStatus("Please try again");
      });
  };

  return { copyStatus, copyText };
};

export default useCopy;

"use client";
import JoditEditor from "jodit-react";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import { useEffect, useMemo, useRef, useState } from "react";

const RichTextEditor = ({ onChange, value }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const config = {
    readonly: false,
    height: 400,
    buttons:
      "bold,italic,underline,link,strikethrough,eraser,ul,ol,paragraph,lineHeight,paste",
  };
  useEffect(() => {
    if (value) {
      setContent(value);
    } else {
      setContent("");
    }
  }, [value]);
  return (
    <Wrapper>
      <JoditEditor
        ref={editor}
        value={content}
        tabIndex={1}
        config={config}
        onBlur={(newContent) => {
          setContent(newContent);
          onChange(newContent);
        }}
        onChange={(newContent) => {}}
      />
    </Wrapper>
  );
};

export default RichTextEditor;

"use client";
import IconAddition from "@/assets/icons/IconAddition";
import IconCheck from "@/assets/icons/IconCheck";
import IconCloseDrawer from "@/assets/icons/IconCloseDrawer";
import React, { useEffect, useRef, useState } from "react";

const Tags = ({ selectAll, setSelectAll, placeholder }) => {
  const [selectedValue, setSelectedValue] = useState([]);
  const dropdownRef = useRef(null);
  const [tags, setTags] = useState("");
  const [filterdTags, setfilterdTags] = useState([]);
  const [showCross, setShowCross] = useState(false);
  const handleBlur = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
      setShowCross(false);
    }
  };
  // Handle paste event 
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const parts = text
      .split(/[,\n]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    
    if (parts.length > 0) {
      const existing = Array.isArray(selectAll?.tags) ? selectAll.tags : [];
      const merged = Array.from(new Set([...existing, ...parts]));
      setSelectAll(merged || []);
      setSelectedValue(merged);
      setTags("");
      setfilterdTags([]);
    }
  };

  // const removeTag = (tag) => {
  //   const allTags = selectAll?.tags;
  //   const filteredTags = allTags.filter((item) => item != tag);
  //   setSelectAll(filteredTags || []);
  //   setTags(filteredTags);
  // };

  const removeTag = (tag) => {
    const allTags = selectAll?.tags;
    const filteredTags = allTags.filter((item) => item != tag);
    setSelectAll(filteredTags || []);
    setSelectedValue(filteredTags || []);
    setTags("");
    setfilterdTags([]);
  };

  const getKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const text = (tags || "").trim();
      if (!text) return;
      const parts = text
        .split(/[,\n]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      if (parts.length > 0) {
        const existing = Array.isArray(selectAll?.tags) ? selectAll.tags : [];
        const merged = Array.from(new Set([...existing, ...parts]));
        setSelectAll(merged || []);
        setSelectedValue(merged);
        setTags("");
        setfilterdTags([]);
      }
    }
  };
  // const getKeyPress = (e) => {
  //   if (e.keyCode === 13 && !selectedValue.includes(tags)) {
  //     const allTags = selectAll?.tags;
  //     allTags.push(tags);
  //     setSelectAll(allTags || []);
  //     setTags("");
  //   }
  // };
  // const getTag = (item, tag) => {
  //   if (tag.includes(",")) {
  //     const parts = tag
  //       .split(/[,\n]+/)
  //       .map((t) => t.trim())
  //       .filter((t) => t.length > 0);
  //     const existing = Array.isArray(selectAll?.tags) ? selectAll.tags : [];
  //     const merged = Array.from(new Set([...existing, ...parts]));
  //     setSelectAll(merged || []);
  //     setTags("");
  //     setfilterdTags([]);
  //     return;
  //   }
  //   setTags(tag);
  //   const filterdTag = selectAll?.tags.filter((filtertag) => {
  //     const tg = filtertag.toLowerCase();
  //     return tg.includes(tag.toLowerCase());
  //   });
  //   setfilterdTags(filterdTag);
  // };

  const getTag = (item, tag) => {
    setTags(tag);
    const filterdTag =
      selectAll?.tags?.filter((filtertag) => {
        const tg = (filtertag || "").toLowerCase();
        return tg.includes((tag || "").toLowerCase());
      }) || [];
    setfilterdTags(filterdTag);
  };

  // const addTag = (item, tag) => {
  //   if (!selectedValue.includes(tags)) {
  //     const allTags = selectAll?.tags;
  //     allTags.push(tag);
  //     setSelectAll(allTags || []);
  //     setTags("");
  //   }
  // };
  const addTag = (item, tag) => {
    const text = tag || "";
    const parts = text
      .split(/[,\n]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (parts.length > 0) {
      const existing = Array.isArray(selectAll?.tags) ? selectAll.tags : [];
      const merged = Array.from(new Set([...existing, ...parts]));
      setSelectAll(merged || []);
      setTags("");
      setfilterdTags([]);
    }
  };
  const setValue = (e, label) => {
    let selectedTags = [];
    if (selectedValue.includes(label)) {
      selectedTags = selectedValue.filter((item) => item != label);
      setSelectedValue(selectedTags);
    } else {
      selectedTags = [...selectedValue, label];
      setSelectedValue(selectedTags);
    }
    setSelectAll(selectedTags || []);
  };
  useEffect(() => {
    if (selectAll?.tags) {
      setSelectedValue(selectAll?.tags);
    }
  }, [selectAll?.tags, tags]);
  return (
    <div ref={dropdownRef} className="w-full h-full">
      <button
        type="button"
        onBlur={(e) => handleBlur(e)}
        className="w-full h-full"
        onClick={() => setShowCross(true)}
      >
        {selectAll?.tags?.length > 0 && (
          <div
            className={`flex  gap-1 p-2 ${
              showCross ? "flex-wrap" : " overflow-hidden"
            } `}
          >
            {selectAll?.tags.map((tag, i) => (
              <div
                key={i}
                className="bg-gray-75 rounded px-2 py-1 font-satoshi text-xs gap-0.5 flex items-center whitespace-nowrap"
              >
                {tag}
                {showCross && (
                  <span
                    className="hover:bg-light-150 rounded-sm w-3.5 flex items-center cursor-pointer justify-center h-3.5"
                    onClick={() => removeTag(tag)}
                  >
                    <IconCloseDrawer className="w-2 h-2 fill-black" />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={tags}
            autoFocus
            onChange={(e) => getTag(null, e.target.value)}
            // onKeyUp={(e) => getKeyPress(e)}
            onKeyDown={(e) => getKeyPress(e)}
            onPaste={handlePaste}
            data-type={"tag_name"}
            placeholder={placeholder || "Add Keyword"}
            className={`placeholder-opacity-0 placeholder-transparent h-[43px] px-[15px] py-3 bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex w-full text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi
                            ${selectAll?.tags?.length > 0 ? "py-1" : "py-3"}
                            `}
            name="tag_name"
          />
          {tags.length > 0 && (
            <ul className="absolute z-[1] w-full bg-white transition-all max-h-[250px] overflow-auto duration-300 origin-top p-3 min-w-[150px] top-[49px] hide-scroll-bar  shadow-large rounded ">
              {tags && (
                <li
                  onClick={() => addTag(null, tags)}
                  className="flex items-center gap-1 overflow-hidden bg-light-50 p-1 rounded-md text-sm"
                >
                  <IconAddition className="fill-heading w-3 h-3" />{" "}
                  <strong>Add</strong> {tags}
                </li>
              )}
              {filterdTags &&
                filterdTags.map((tag, i) => (
                  <li
                    key={i}
                    className={`cursor-pointer capitalize relative  py-[11px]  flex items-center gap-2 text-heading text-sm leading-[19px] ${
                      selectedValue.includes(tag)
                        ? "font-medium"
                        : "font-normal"
                    }
                     ${i > 0 ? "border-t border-stroke" : ""}
                     `}
                  >
                    <span
                      onClick={(e) => setValue(e, tag)}
                      onBlur={handleBlur}
                      className={`w-5 h-5 min-w-5 cursor-pointer rounded border flex items-center justify-center
                              before:top-0 before:left-0 before:w-full before:h-[calc(100%+1px)] before:absolute
             ${
               selectedValue.includes(tag)
                 ? " bg-positive border-positive"
                 : "border-[#eaeaea]  bg-white"
             } `}
                    >
                      {selectedValue.includes(tag) && <IconCheck />}
                    </span>
                    {tag}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </button>
    </div>
  );
};

export default Tags;

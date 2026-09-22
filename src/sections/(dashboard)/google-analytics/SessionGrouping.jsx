"use client";
import { useEffect, useState } from "react";

const SessionGrouping = ({
  sessionGroupingValues,
  heading,
  keyHead,
  valueHead,
}) => {
  let sum = 0;
  let length = 0;
  const [limit, setLimit] = useState(0);
  const [show, setShow] = useState(false);
  if(sessionGroupingValues){
  Object.keys(sessionGroupingValues).map((item, i) => {
    sum += sessionGroupingValues[item];
    ++length;
  });
}
  useEffect(() => {
    if (show) {
      setLimit(length);
    } else {
      setLimit(8);
    }
  }, [show]);

  return (
    <div className="bg-white p-6 rounded-lg border-dark-100  flex-1">
      <h2 className="text-2xl font-semibold text-dark-100 mb-2 empty:hi">
        {heading}
      </h2>
      <ul>
        <li className="relative flex justify-between border-b border-lightblue-100 py-2">
          <span> {keyHead} </span>
          <span>{valueHead}</span>
        </li>
        {sessionGroupingValues &&
          Object.keys(sessionGroupingValues).map((item, i) =>
            i < limit ? (
              <li
                key={i}
                className="relative flex justify-between border-b border-lightblue-100 py-2"
              >
                <span className="font-semibold">{item.slice(0,30)}{item.length > 30 && '...' }</span>
                <span>{sessionGroupingValues[item]}</span>
                <span
                  style={{
                    width: `${(sessionGroupingValues[item] / sum) * 100}%`,
                  }}
                  className="absolute -bottom-[1px] left-0 bg-dark-100 h-[2px] transition-all duration-300"
                ></span>
              </li>
            ) : null
          )}
      </ul>
      {length > 7 && (
        <button
          className="mx-auto block mt-4 underline underline-offset-4"
          onClick={() => setShow((prev) => !prev)}
        >
          {show ? "Show less" : "Show all"}
        </button>
      )}
    </div>
  );
};

export default SessionGrouping;

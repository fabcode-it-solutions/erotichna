"use client";
import useTheme from "@/contexts/theme/ThemeProvider";
import React, { useEffect, useState } from "react";

const Index = ({data}) => {
  const { fonts } = useTheme();
  const [pageData, setPageData] = useState({});

  useEffect(() => {
    setPageData(data)
  }, [data]);

  return (
    <div className="privacy-container">
      <div className="privacy-title">
        {pageData && pageData.title || '18 U.S.C. §§ 2257–2257A Record-Keeping Compliance Statement'}
      </div>
      <div className={`privacy-description ${fonts.cormorant_Garamond_non} `}>
        <div className={`entry-content ${fonts.open_Sans}`}>
          {pageData && (
            <div
              dangerouslySetInnerHTML={{
                __html: pageData.description,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

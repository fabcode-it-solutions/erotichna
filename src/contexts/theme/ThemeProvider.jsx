"use client";
import React, { useContext, useEffect, useState } from "react";
import { Open_Sans, Cormorant_Garamond, Cinzel, Oswald, Playfair } from "next/font/google";
import Image from "next/image";
import { usePathname } from "next/navigation";
const cormorant_Garamond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  style: "italic",
});
const cormorant_Garamond_non = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
const cinzel = Cinzel({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const open_Sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const oswald = Oswald({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
const playfair = Playfair({
  weight: ["300", "400", "500", "600", "700", '800'],
  subsets: ["latin"],
});
const ThemeContext = React.createContext();

export default function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children, session }) {
  const [fonts, setfonts] = useState(false);
  const [hideHeaderMain, setHideHeaderMain] = useState(false);
  const [hideFooterMain, setHideFooterMain] = useState(false);
  const [headerData, setHeaderData] = useState({});
  const [homeData, setHomeData] = useState({});
  const [hideLoader, setHideLoader] = useState(false);
  const [bannerData, setBannerData] = useState([])
  const [topVideosData, setTopVideosData] = useState([])
  const [latestVideosData,setLatestVideosData] = useState([])
  const [performersData,setPerformersData]= useState([])
  const [singleImage, setSingleImage] = useState()
  const [singleImageSecond, setSingleImageSecond] = useState()
  const [upcomingData,setUpcomingData]= useState()
  const [homeSeo,setHomeSeo]= useState()
  const path = usePathname();


  const fetchData = async (section, setData) => {
    try {
      const response = await fetch(`/api/admin/homepage?section=${section}`);
      const data = await response.json();
      if (data) {
        setData(data.data);
      }
    } catch (error) {
      console.error(`Error fetching ${section} data:`, error);
    }
  };



  useEffect(() => {
    fetchData("banner", setBannerData);
    fetchData("topVideos", setTopVideosData);
    fetchData("singleImage", setSingleImage);
    fetchData("latestVideos", setLatestVideosData);
    fetchData("performers", setPerformersData);
    fetchData("singleImageSecond", setSingleImageSecond);
    fetchData("upcoming", setUpcomingData);
    fetchData("seo", setHomeSeo)

  }, []);

  const getHeaderData = async () => {
    try {
      const response = await fetch("/api/admin/header");
      const data = await response.json();
      if (data) {
        setHeaderData(data.data[0]);
      }
    } catch (error) {
    } finally {
    }
  };
  const getHomeData = async () => {
    try {
      const response = await fetch("/api/admin/homepage");
      const data = await response.json();
      if (data) {
        setHomeData(data.data[0]);
        setTimeout(() => {
          setHideLoader(true);
        }, 1500);
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    setfonts({
      open_Sans: open_Sans.className,
      cinzel: cinzel.className,
      oswald:oswald.className,
      playfair:playfair.className,
      cormorant_Garamond: cormorant_Garamond.className,
      cormorant_Garamond_non: cormorant_Garamond_non.className
    });
    getHeaderData();
    // getHomeData();
  }, []);
  useEffect(() => {
    setfonts({
      open_Sans: open_Sans.className,
      cinzel: cinzel.className,
      oswald:oswald.className,
      playfair:playfair.className,
      cormorant_Garamond: cormorant_Garamond.className,
      cormorant_Garamond_non: cormorant_Garamond_non.className
    });
  }, [session]);
  const value = {
    fonts,
    hideHeaderMain,
    setHideHeaderMain,
    hideFooterMain,
    setHideFooterMain,
    headerData,
    getHeaderData,
    homeData,
    getHomeData,
    bannerData,
    setBannerData,
    topVideosData,
    setTopVideosData,
    singleImage,
    setSingleImage,
    latestVideosData,
    setLatestVideosData,
    performersData,
    setPerformersData,
    upcomingData,
    fetchData,
    homeSeo,
    setUpcomingData,
    singleImageSecond,
    setSingleImageSecond
  };
  return (
    <ThemeContext.Provider value={value}>
      {/* {path === '/' &&   <div className={`bg-black fixed top-0 left-0 w-full h-full flex justify-center items-center z-[999999] duration-500 ${hideLoader ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Image src="/assets/images/erotichna-logo-bg.svg" width={250} height={100} alt="Logo"/>
      </div>} */}
      <main className={`${open_Sans.className}`}>{children}</main>
    </ThemeContext.Provider>
  );
}

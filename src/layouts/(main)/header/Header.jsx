"use client";
import IconCloseDrawer from "@/assets/icons/IconCloseDrawer";
import Anchor from "@/components/global/Anchor/Anchor";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import useAuth from "@/contexts/auth/AuthProvider";
import useTheme from "@/contexts/theme/ThemeProvider";
import Performers from "@/sections/Performers";
import TopVideo from "@/sections/TopVideo";
import { Container, Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = ({ headerData }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { hideHeaderMain } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { allmodels, getAllModels } = useAdmin();
  const pathName = usePathname();

  useEffect(() => {
    getAllModels("publish", 0, 0, "latest-scenes");
  }, []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ models: [], videos: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showInstallButtonIOS, setShowInstallButtonIOS] = useState(false);
  const [showInstallButtonIOSDialog, setShowInstallButtonIOSDialog] =
    useState(false);
  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length <= 2) {
        setResults({ models: [], videos: [] });
        setError("");
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/search?query=${query}`);
        const data = await response.json();
        if (data.models.length === 0 && data.videos.length === 0) {
          setError("No Products found.");
        }
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("An error occurred while searching.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    setDrawerOpen(false);
    setMobileMenu(false);
  }, [pathName]);

  const { user } = useAuth();

  function handleNavbarMenu() {
    setDrawerOpen((prev) => !prev);
    setMobileMenu((prev) => !prev);
  }
  const handleInstallClick = async () => {
    console.log(deferredPrompt);

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallButton(false);
      localStorage.setItem("installPWA", "true");
    } else {
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };
  function isTablet() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android(?!.*mobile)|tablet|kindle|silk/.test(userAgent);
  }
  function isSafari() {
    return /^((?!chrome).)*safari/i.test(navigator.userAgent);
  }
  function isIOS() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /ipad/.test(userAgent);
  }
  useEffect(() => {
    if (isIOS() && isSafari()) {
      setShowInstallButtonIOS(true);
    }
    if (navigator.userAgent.indexOf("Mac") > 1) {
      setShowInstallButtonIOS(true);
    }
    if (isTablet()) {
      setShowInstallButton(true);
    }
    window.addEventListener("scroll", function () {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        if (document.querySelector("header")) {
          document.querySelector("header").classList.add("sticky-header");
        }
      } else {
        if (document.querySelector("header")) {
          document.querySelector("header").classList.remove("sticky-header");
        }
      }
    });
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);

      if (navigator.userAgent.indexOf("Mac") > 1) {
      } else {
        setShowInstallButton(true);
      }
    };

    window.addEventListener("beforeinstallprompt", (e) => handler(e));
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  return hideHeaderMain ? (
    ""
  ) : (
    <div>
      <header className="fixed py-6 tab-lg:py-2 left-0 w-full z-[999] transition-all duration-500">
        {showInstallButton && !localStorage.getItem("installPWA") && (
          <div
            className={`fixed p-4 left-0 w-full bg-dark-150 bg-opacity-50 backdrop-blur bottom-0 hidden max-lg-tab:flex items-center justify-between
          ${isTablet() ? "!flex" : ""}
          `}
          >
            <button
              onClick={() => setShowInstallButton(false)}
              className="absolute right-2 -top-4 bg-white bg-opacity-90 backdrop-blur-none w-5 h-5 rounded-full flex justify-center items-center"
            >
              <IconCloseDrawer stroke="#000" className="w-2 h-2" />
            </button>
            <div className="flex items-center gap-2">
              <Image
                src={"/favicon_512X512.png"}
                unoptimized={true}
                width={40}
                height={40}
                className="max-w-[40px] h-auto rounded"
                alt="Site Logo"
              />
              <div>
                <h3 className="text-lg text-white font-bold font-satoshi">
                  Get Erotichna App
                </h3>
              </div>
            </div>
            <div>
              <button
                onClick={() => handleInstallClick()}
                className="bg-[#ff4040] uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[44px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1 max-sm-tab:px-6"
              >
                Get App
              </button>
            </div>
          </div>
        )}
        {showInstallButtonIOS && !localStorage.getItem("installPWA") && (
          <div
            className={`fixed p-4 left-0 w-full bg-dark-150 bg-opacity-50 backdrop-blur bottom-0 hidden max-lg-mb:flex items-center justify-between
          ${isIOS() && isSafari() ? "!flex" : ""}         `}
          >
            <button
              onClick={() => {
                setShowInstallButton(false);
                localStorage.setItem("installPWA", "true");
              }}
              className="absolute right-2 -top-4 bg-white bg-opacity-90 backdrop-blur-none w-5 h-5 rounded-full flex justify-center items-center"
            >
              <IconCloseDrawer stroke="#000" className="w-2 h-2" />
            </button>
            <div className="flex items-center gap-2">
              <Image
                src={"/favicon_512X512.png"}
                width={40}
                unoptimized={true}
                height={40}
                className="max-w-[40px] ] h-auto rounded"
                alt="Site Logo"
              />
              <div>
                <h3 className="text-lg text-white font-bold font-satoshi">
                  Get Erotichna App
                </h3>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  setShowInstallButtonIOSDialog({
                    active: true,
                  });
                  setTimeout(() => {
                    setShowInstallButtonIOSDialog({
                      active: true,
                      activeAnimation: true,
                    });
                  }, 300);
                }}
                className="bg-[#ff4040] uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[44px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1 max-sm-tab:px-6"
              >
                Get App
              </button>
            </div>
          </div>
        )}
        {showInstallButtonIOSDialog?.active &&
          !localStorage.getItem("installPWA") && (
            <div
              className={`fixed top-0 left-0 w-full h-full bg-dark-150 bg-opacity-50 backdrop-blur flex items-center justify-center ${
                showInstallButtonIOSDialog?.activeAnimation
                  ? "opacity-100"
                  : "opacity-0"
              } transition-all duration-300`}
            >
              <div
                className={`max-w-[300px] w-full mx-auto bg-white rounded-[20px] relative `}
              >
                <div className="min-h-[182px]">
                  <Image
                    src={"/add-to-home.png"}
                    width={300}
                    unoptimized={true}
                    height={300}
                    className="w-full min-h-[182px] h-auto"
                    alt="Site Logo"
                  />
                </div>
                <button
                  onClick={() => setShowInstallButtonIOSDialog(false)}
                  className="absolute right-0 -top-6  bg-opacity-90 backdrop-blur-none w-5 h-5 rounded-full flex justify-center items-center"
                >
                  <IconCloseDrawer stroke="#fff" className="w-3 h-3" />
                </button>
                <div className="p-4">
                  <h3 className="text-lg text-dark-150 font-bold font-satoshi mb-3">
                    Get app for Notifications
                  </h3>
                  <ul className="list-none p-0 m-0 text-sm">
                    <li className="flex items-center gap-2">
                      1. Tap <b> &quot;Share&quot;</b>{" "}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000"
                      >
                        <path d="M264.62-80Q237-80 218.5-98.5 200-117 200-144.62v-390.76q0-27.62 18.5-46.12Q237-600 264.62-600h84.61v40h-84.61q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v390.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69h430.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-390.76q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69h-84.61v-40h84.61q27.62 0 46.12 18.5Q760-563 760-535.38v390.76q0 27.62-18.5 46.12Q723-80 695.38-80H264.62ZM460-340v-435.46l-84 84L347.69-720 480-852.31 612.31-720 584-691.46l-84-84V-340h-40Z" />
                      </svg>
                    </li>
                    <li className="flex items-center gap-2 mt-2">
                      2. Tap <b>&quot;Add to Home Screen&quot; </b>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000"
                      >
                        <path d="M460-300h40v-160h160v-40H500v-160h-40v160H300v40h160v160ZM224.62-160q-27.62 0-46.12-18.5Q160-197 160-224.62v-510.76q0-27.62 18.5-46.12Q197-800 224.62-800h510.76q27.62 0 46.12 18.5Q800-763 800-735.38v510.76q0 27.62-18.5 46.12Q763-160 735.38-160H224.62Zm0-40h510.76q9.24 0 16.93-7.69 7.69-7.69 7.69-16.93v-510.76q0-9.24-7.69-16.93-7.69-7.69-16.93-7.69H224.62q-9.24 0-16.93 7.69-7.69 7.69-7.69 16.93v510.76q0 9.24 7.69 16.93 7.69 7.69 16.93 7.69ZM200-760v560-560Z" />
                      </svg>
                    </li>
                  </ul>
                </div>
                <svg
                  width="42"
                  height="23"
                  className="absolute left-1/2 -translate-x-1/2 -bottom-[23px]"
                  viewBox="0 0 42 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M42 0L21 23L0 0H42Z" fill="white" />
                </svg>
              </div>
            </div>
          )}
        <Container className="dex-3xl:px-6 tab-lg:px-4 px-4">
          <Flex justify={"between"} align={"center"} className="">
            <nav className="flex items-center gap-6 tab-lg:flex-1  tab-lg:gap-2">
              <button
                onClick={() => setMobileMenu((prev) => !prev)}
                className="tab-lg:block hidden"
              >
                {mobileMenu ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#fff"
                  >
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#fff"
                  >
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                  </svg>
                )}
              </button>
              <Link
                className="cursor-pointer"
                href={headerData?.logo?.link || ""}
              >
                <Image
                  src={
                    headerData?.logo?.src?.replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    ) || "/assets/images/erotichna-logo-bg.svg"
                  }
                  width={250}
                  height={39}
                  unoptimized={true}
                  alt="Site Logo"
                />
              </Link>
              <ul className="flex items-center gap-6 tab-lg:hidden">
                {headerData?.menus?.length > 0 &&
                  headerData?.menus.map((item, i) => (
                    <li key={i} className="block">
                      <Link
                        className="uppercase block text-white text-base font-medium"
                        href={item?.link || "#"}
                      >
                        {item?.label}
                      </Link>
                    </li>
                  ))}
                {headerData?.searchBtn && (
                  <li className="uppercase text-white text-base font-medium">
                    <button
                      className="uppercase  text-white text-base font-medium flex items-center gap-2"
                      onClick={() => setDrawerOpen((prev) => !prev)}
                    >
                      <Image
                        src="/assets/icons/search-svgrepo-com.svg"
                        width={24}
                        height={24}
                        unoptimized={true}
                        alt="Search"
                      />
                      Search
                    </button>
                  </li>
                )}
              </ul>
            </nav>
            <Flex
              align={"center"}
              gap={"48px"}
              className="tab-lg:flex-1 tab-lg:!justify-end"
            >
              {headerData?.loginBtn && (
                <span>
                  {" "}
                  {user ? (
                    <Link
                      className="uppercase block text-white text-base font-medium tab-lg:hidden"
                      href={
                        user.role === "admin" || user.role === "editor"
                          ? "/dashboard"
                          : "/profile"
                      }
                    >
                      {user?.username || user?.firstName}
                    </Link>
                  ) : (
                    <Link
                      className="uppercase block text-white text-base font-medium tab-lg:hidden"
                      href={"/login"}
                    >
                      Login
                    </Link>
                  )}
                </span>
              )}
              {headerData?.customButton && (
                <Anchor
                  href={
                    user?.subscription?.active &&
                    user?.subscription?.status === "active"
                      ? "/subscription-dashboard"
                      : headerData?.customButton?.link || "/get-access"
                  }
                  label={
                    user?.subscription?.active &&
                    user?.subscription?.status === "active"
                      ? "View Plan"
                      : headerData?.customButton?.label || "Get Access"
                  }
                  className="tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5 max-sm-tab:px-4"
                />
              )}
            </Flex>
          </Flex>
          <div
            className={`bg-black fixed bottom-0 left-0 w-full overflow-y-auto h-[80vh] p-6 z-[999] transition-all duration-300 ${
              drawerOpen
                ? "transform translate-y-0"
                : "transform translate-y-full"
            }`}
            style={{
              transform: drawerOpen ? "translateY(0)" : "translateY(100%)",
            }}
          >
            <div className="flex flex-row-reverse gap-2   py-[30px] justify-between items-center mb-4">
              <button onClick={() => setDrawerOpen(false)} className="m-4 ">
                <IconCloseDrawer
                  className={
                    "fill-white w-[40px] h-[40px] max-lg-mb:w-6 max-lg-mb:h-6"
                  }
                  stroke={"white"}
                />
              </button>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="text-xl  md:text-4xl p-3 max-lg-mb:text-[84%] font-satoshi uppercase font-bold w-[80%] mx-auto bg-black text-white border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                placeholder="Search for models or videos"
              />
            </div>
            <div className="w-full  border-white border-[0.2px] opacity-35"></div>
            <div className="flex justify-center gap-2 flex-wrap pt-[50px]">
              {allmodels &&
                allmodels.length > 0 &&
                allmodels.map((item, index) => {
                  return (
                    index < 10 && (
                      <div
                        onClick={() => setQuery(item.title)}
                        key={index}
                        className="text-white uppercase  font-satoshi gap-4 border border-white bg-black hover:bg-red-600 cursor-pointer px-2"
                      >
                        {item.title}
                      </div>
                    )
                  );
                })}
            </div>
            {query.length < 1 && (
              <span className="text-white uppercase font-satoshi gap-4 flex justify-center mt-4 text-center w-full ">
                Start typing to see models or videos you are looking for.
              </span>
            )}
            {results?.videos.length > 0 && (
              <TopVideo
                title={"Videos"}
                query={query}
                videos={results?.videos.slice(0, 3)}
                showAllVideo={results?.videos}
                showAllVideoButton={results?.videos.length > 0}
              />
            )}
            {results?.models.length > 0 && (
              <Performers
                title="Models"
                query={query}
                items={results?.models.slice(0, 6) || []}
                showAllVideo={results?.models.length > 0}
              />
            )}
          </div>
        </Container>
      </header>
      <div
        className={`bg-black fixed top-0 left-0 p-6 pt-20 w-full h-full  transition-all duration-300 z-20 ${
          mobileMenu ? "opacity-100" : "opacity-0 invisible pointer-events-none"
        } `}
      >
        <nav>
          <ul className="gap-4 flex flex-col">
            {headerData?.menus?.length > 0 &&
              headerData?.menus.map((item, i) => (
                <li key={i} className="block">
                  <Link
                    className="uppercase block text-white text-base font-medium text-center"
                    href={item?.link || "#"}
                  >
                    {item?.label}
                  </Link>
                </li>
              ))}
            {headerData?.searchBtn && (
              <li className="uppercase text-white text-base font-medium">
                <button
                  className="uppercase  text-white text-base font-medium flex items-center gap-2 justify-center w-full"
                  onClick={handleNavbarMenu}
                >
                  <Image
                    src="/assets/icons/search-svgrepo-com.svg"
                    width={24}
                    height={24}
                    unoptimized={true}
                    alt="Search"
                    className="hidden"
                  />
                  Search
                </button>
              </li>
            )}
            {headerData?.loginBtn && (
              <li>
                <Link
                  className="uppercase block text-white text-base font-medium text-center"
                  href={"/login"}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
        <div
          className={`bg-black fixed bottom-0 left-0 w-full h-[80vh] overflow-y-auto p-6 z-[999] transition-all duration-300 ${
            drawerOpen
              ? "transform translate-y-0"
              : "transform translate-y-full"
          }`}
          style={{
            transform: drawerOpen ? "translateY(0)" : "translateY(100%)",
          }}
        >
          <div className="flex flex-row-reverse gap-2 py-[30px] justify-between items-center mb-4">
            <button onClick={() => setDrawerOpen(false)} className="m-4">
              <IconCloseDrawer
                className="fill-white w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
                stroke="white"
              />
            </button>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              className="text-2xl sm:text-3xl md:text-4xl max-lg-mb:text-xl p-3 font-satoshi uppercase font-bold w-[80%] mx-auto bg-black text-white border border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              placeholder="Search for models or videos"
            />
          </div>

          <div className="w-full border-white border-[0.2px] opacity-35"></div>

          <div className="flex flex-wrap justify-center  gap-2 pt-[50px]">
            {allmodels &&
              allmodels.length > 0 &&
              allmodels.map(
                (item, index) =>
                  index < 10 && (
                    <div
                      key={index}
                      className="text-white uppercase font-satoshi gap-4 border border-white bg-black hover:bg-red-600 cursor-pointer px-2 py-1 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl w-full sm:w-auto"
                    >
                      {item.title}
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

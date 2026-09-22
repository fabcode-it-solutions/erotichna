/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Anchor from "@/components/global/Anchor/Anchor";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import useAuth from "@/contexts/auth/AuthProvider";
import useTheme from "@/contexts/theme/ThemeProvider";
import { Box, Container, Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Footer = ({ footerData }) => {
  const { hideFooterMain } = useTheme();
  const { user } = useAuth();
  const { getFooterDataAPI } = useAdmin();
  const [email, setEmail] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("/");
  const [instagramUrl, setInstagramUrl] = useState("/");

  useEffect(() => {
    if (!footerData) {
      getFooterDataAPI();
    }
  }, []);

  return hideFooterMain ? (
    ""
  ) : (
    <footer className="bg-black">
      <Container className="py-10 px-4">
        <Flex className="" justify={"center"}>
          <Anchor
            href={
              user?.subscription?.type != "180 Day Full Access"
                ? "/get-access"
                : "/profile"
            }
            label={
              !user?.subscription?.active
                ? "Get Your Full Access"
                : user?.subscription?.type != "180 Day Full Access"
                ? "Upgrade Plan"
                : "View Plan"
            }
          />
        </Flex>
        <Flex className="!gap-16 mt-10 tab-sm:flex-col-reverse tab-sm:px-0 tab-sm:!gap-6">
          <Box className="flex-1">
            <div
              dangerouslySetInnerHTML={{ __html: footerData[0].description }}
              className="text-white text-xs leading-5 mt-3"
            ></div>

            <ul className="flex my-7 items-center flex-wrap gap-3">
              {footerData &&
                footerData[0].inner_pages.map((menu, index) => {
                  return (
                    <div key={index} className="flex items-center gap-2">
                      {index > 0 && (
                        <li
                          key={index + index}
                          className="bg-white w-[1px] h-[14px]"
                        ></li>
                      )}
                      <li
                        className={`${index === 0 ? "block" : " block "}`}
                        key={index}
                      >
                        <Link
                          href={menu.link}
                          className="text-white text-sm leading-none block tab-sm:text-[11px]"
                        >
                          {menu.label}
                        </Link>
                      </li>
                    </div>
                  );
                })}
              {!footerData && (
                <li className={`block`}>
                  <Link
                    href={"/privacy-policy"}
                    className="text-white text-sm leading-none block tab-sm:text-[11px]"
                  >
                    Privacy Policy
                  </Link>
                </li>
              )}
              {!footerData && <li className="bg-white w-[1px] h-[14px]"></li>}
              {!footerData && (
                <li className={` block `}>
                  <Link
                    href={"/terms-conditions"}
                    className="text-white text-sm leading-none block tab-sm:text-[11px]"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              )}
              <li className="bg-white w-[1px] h-[14px]"></li>
              <li className={` block `}>
                <Link
                  href={"/pages/removal"}
                  className="text-white text-sm leading-none block tab-sm:text-[11px]"
                >
                  Content removal policy
                </Link>
              </li>
              <li className="bg-white w-[1px] h-[14px]"></li>
              <li className={` block `}>
                <Link
                  href={"/pages/safety"}
                  className="text-white text-sm leading-none block tab-sm:text-[11px]"
                >
                  Trust and safety
                </Link>
              </li>
            </ul>
            <div className="mt-2 mb-3">
              <Link
                href="/pages/2257"
                className="text-gray-200 underline text-xsm leading-none "
              >
                18 U.S.C. §§ 2257–2257A Record-Keeping Compliance Statement
              </Link>
            </div>
            <Link target="_blank" href={"https://www.rtalabel.org/"}>
              <Image
                src={"/assets/images/rta-logo.webp"}
                width={120}
                height={60}
                unoptimized={true}
                alt="rta"
                className="h-auto max-w-[60px]"
              />
            </Link>
            <div className="flex gap-2 mt-4">
              <Image
                src={"/assets/images/visa-card.png"}
                width={107}
                height={63}
                unoptimized={true}
                alt="visa"
                className="h-auto max-w-[48px]"
              />
              <Image
                src={"/assets/images/master-card.png"}
                width={107}
                height={63}
                unoptimized={true}
                alt="master card"
                className="h-auto max-w-[48px]"
              />
            </div>
          </Box>
          <Box className="max-w-[450px] w-full">
            <h4 className="text-white text-lg font-medium">Newsletter</h4>
            <div className="relative omnisend-embedded-from ">
              <div id="omnisend-embedded-v2-679330f54677e250387b1073"></div>
            </div>
            <ul className="flex gap-3 items-center justify-end mt-3">
              <li className="">
                <Link href="https://x.com/erotichna" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="text-white w-4 h-4"
                  >
                    <path
                      fill="#fff"
                      d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"
                    />
                  </svg>
                </Link>
              </li>
              <li className="">
                <Link
                  href="https://www.instagram.com/erotichnaofficial/"
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="text-white w-4 h-4"
                  >
                    <path
                      fill="#fff"
                      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    />
                  </svg>
                </Link>
              </li>
              <li className="">
                <Link href="https://t.me/erotichna" target="_blank">
                  <svg
                    width="1000px"
                    height="1000px"
                    viewBox="0 0 1000 1000"
                    className="w-4 h-4"
                    version="1.1"
                  >
                    <defs>
                      <linearGradient
                        x1="50%"
                        y1="0%"
                        x2="50%"
                        y2="99.2583404%"
                        id="linearGradient-1"
                      >
                        <stop stopColor="#2AABEE" offset="0%"></stop>
                        <stop stopColor="#229ED9" offset="100%"></stop>
                      </linearGradient>
                    </defs>
                    <g
                      id="Artboard"
                      stroke="none"
                      strokeWidth="1"
                      fill="none"
                      fillRule="evenodd"
                    >
                      <circle
                        id="Oval"
                        fill="url(#linearGradient-1)"
                        cx="500"
                        cy="500"
                        r="500"
                      ></circle>
                      <path
                        d="M226.328419,494.722069 C372.088573,431.216685 469.284839,389.350049 517.917216,369.122161 C656.772535,311.36743 685.625481,301.334815 704.431427,301.003532 C708.567621,300.93067 717.815839,301.955743 723.806446,306.816707 C728.864797,310.92121 730.256552,316.46581 730.922551,320.357329 C731.588551,324.248848 732.417879,333.113828 731.758626,340.040666 C724.234007,419.102486 691.675104,610.964674 675.110982,699.515267 C668.10208,736.984342 654.301336,749.547532 640.940618,750.777006 C611.904684,753.448938 589.856115,731.588035 561.733393,713.153237 C517.726886,684.306416 492.866009,666.349181 450.150074,638.200013 C400.78442,605.66878 432.786119,587.789048 460.919462,558.568563 C468.282091,550.921423 596.21508,434.556479 598.691227,424.000355 C599.00091,422.680135 599.288312,417.758981 596.36474,415.160431 C593.441168,412.561881 589.126229,413.450484 586.012448,414.157198 C581.598758,415.158943 511.297793,461.625274 375.109553,553.556189 C355.154858,567.258623 337.080515,573.934908 320.886524,573.585046 C303.033948,573.199351 268.692754,563.490928 243.163606,555.192408 C211.851067,545.013936 186.964484,539.632504 189.131547,522.346309 C190.260287,513.342589 202.659244,504.134509 226.328419,494.722069 Z"
                        id="Path-3"
                        fill="#FFFFFF"
                      ></path>
                    </g>
                  </svg>
                </Link>
              </li>
            </ul>
          </Box>
        </Flex>
      </Container>
    </footer>
  );
};

export default Footer;

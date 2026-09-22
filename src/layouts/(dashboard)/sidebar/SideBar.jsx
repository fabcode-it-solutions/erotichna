"use client";
import IconAnalytics from "@/assets/icons/IconAnalytics";
import IconArrowDown from "@/assets/icons/IconArrowDown";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import IconEdit from "@/assets/icons/IconEdit";
import IconHome from "@/assets/icons/IconHome";
import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import IconInstatQuote from "@/assets/icons/IconInstatQuote";
import IconListing from "@/assets/icons/IconListing";
import IconLogout from "@/assets/icons/IconLogout";
import IconPersonalCard from "@/assets/icons/IconPersonalCard";
import IconSearchStatus from "@/assets/icons/IconSearchStatus";
import IconSellOrders from "@/assets/icons/IconSellOrders";
import IconSidebarAccordion from "@/assets/icons/IconSidebarAccordion";
import IconSourcing from "@/assets/icons/IconSourcing";
import IconUser from "@/assets/icons/IconUser";
import IconWalletMoney from "@/assets/icons/IconWalletMoney";
import IconWalletMoney2 from "@/assets/icons/IconWalletMoney2";
import useAuth from "@/contexts/auth/AuthProvider";
import { Box } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import IconClose from "@/assets/icons/IconClose";
import IconCloseDrawer from "@/assets/icons/IconCloseDrawer";

const Sidebar = () => {
  const route = useRouter();
  const { sideMenu, setSideMenu } = useAdmin();
  const { user, setUser, setUserloggedIn, setUserSession } = useAuth();
  useEffect(() => {}, []);
  const handleClearCookie = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });

      if (res.ok) {
        setUserloggedIn(false);
        setUser(false);
        setUserSession(false);
        route.push("/login");

        console.log("Cookie cleared successfully!");
      } else {
        console.error("Failed to clear the cookie");
      }
    } catch (error) {
      console.error("Error clearing the cookie:", error);
    }
  };

  const path = usePathname();
  const sellingMenu = {
    label: "Videos & Pages",
    menuWithIcon: {
      label: "Videos",
      icon: <IconListing />,
      link: "/dashboard/videos",
    },
    children: [
      {
        label: "All Videos",
        active: path === "/dashboard/videos",
        link: "/dashboard/videos",
      },
      {
        label: "Add a Video",
        active: path.includes("/dashboard/videos/create"),
        link: "/dashboard/videos/create",
      },
      {
        label: "Categories",
        active: path.includes("/dashboard/categories"),
        link: "/dashboard/categories",
      },
    ],
  };
  const pagesEditor = {
    menuWithIcon: {
      label: "Editor",
      icon: <IconEdit className="fill-[#242424] w-5 h-5" />,
      link: "/all-pages",
    },
    children: [
      {
        label: "Pages",
        type: "pages",
      },
      {
        label: "Homepage",
        active: path.includes("/dashboard/editor/homepage"),
        link: "/dashboard/editor/homepage",
      },
      {
        label: "Models",
        active: path.includes("/editor/models"),
        link: "/editor/models",
      },
      {
        label: "Terms And Conditions",
        active: path.includes("/editor/terms-and-conditions"),
        link: "/editor/terms-and-conditions",
      },
      {
        label: "Privacy Policy",
        active: path.includes("/editor/privacy-policy"),
        link: "/editor/privacy-policy",
      },
      {
        label: "Be Our Model",
        active: path.includes("/editor/be-our-model"),
        link: "/editor/be-our-model",
      },
      {
        label: "Pages",
        active: path.includes("/dashboard/editor/pages"),
        link: "/dashboard/editor/pages",
      },
      {
        label: "Sections",
        type: "sections",
      },
      {
        label: "Header",
        active: path.includes("/editor/header"),
        link: "/editor/header",
      },
      {
        label: "Footer",
        active: path.includes("/editor/footer"),
        link: "/editor/footer",
      },
    ],
  };

  const buyingMenu = {
    label: "Subscription & Payments",
    menuWithIcon: {
      label: "Subscription",
      icon: <IconWalletMoney2 className="w-5 h-5" />,
      link: "/subscriptions",
    },
    children: [
      {
        label: "All Subscriptions",
        active: path.includes("/dashboard/subscriptions"),
        link: "/dashboard/subscriptions",
      },
      // {
      //   label: "Create Subscriptions",
      //   active: path.includes("/create-subscription"),
      //   link: "/create-subscription",
      // },
    ],
  };
  const payments = {
    menuWithIcon: {
      label: "Payments & Invoices",
      icon: <IconWalletMoney className="w-5 h-5" />,
      link: "/payments",
    },
    children: [
      {
        label: "All payments",
        active: path.includes("/dashboard/payments"),
        link: "/dashboard/payments",
      },
      // {
      //   label: "Invoices",
      //   active: path.includes("/dashboard/invoices"),
      //   link: "/dashboard/invoices",
      // },
    ],
  };

  const models = {
    menuWithIcon: {
      label: "Models",
      icon: <IconUser />,
      link: "/models",
    },
    children: [
      {
        label: "All Models",
        active: path === "/dashboard/models",
        link: "/dashboard/models",
      },
      {
        label: "Add a Model",
        active: path === "/dashboard/models/create",
        link: "/dashboard/models/create",
      },
    ],
  };

  return (
    <div
      className={`${
        sideMenu ? "max-md-tab:left-0" : "max-md-tab:-left-full"
      } max-md-tab:z-[99999] max-md-tab:transition-all max-md-tab:duration-300 max-md-tab:fixed  max-md-tab:top-0 max-md-tab:max-w-full max-w-[262px] min-w-[262px] w-full h-screen overflow-auto hide-scroll-bar pb-px sticky top-0 flex justify-between`}
    >
      <div className="p-4 pt-[27px] bg-[#f5f4f2] flex-1 flex justify-between flex-col max-md-tab:max-h-[100dvh] max-md-tab:overflow-auto max-md-tab:bg-opacity-90 max-md-tab:backdrop-blur">
        <div>
          <div className="w-full justify-start items-start mb-6 flex max-md-tab:justify-between max-md-tab:items-center">
            <Link
              href="/dashboard"
              className="flex-col justify-start items-start gap-[9.28px] flex max-md-tab:w-[150px]"
            >
              <Image
                src="/assets/images/erotichna-logo-bg.svg"
                alt="Logo"
                unoptimized={true}
                width={213}
                height={35}
                className="w-full"
              />
            </Link>
            <button
              className="hidden max-md-tab:block"
              onClick={() => setSideMenu(false)}
            >
              <IconCloseDrawer />
            </button>
          </div>
          <MenuWithIcon
            icon={<IconHome />}
            link="/dashboard"
            active={path === "/dashboard"}
            label="Home"
          />
          <hr className="border-[#EBEBEB] w-full my-4" />
          <div className="mb-0">
            {sellingMenu?.label && (
              <label className="text-xsm  block font-normal leading-[18.2px] font-satoshi text-[#2a292c] capitalize px-3 pb-1.5 opacity-65">
                {sellingMenu?.label}
              </label>
            )}
            <MenuAccordion
              sellingMenu={sellingMenu}
              active={path === "/categories" || path.includes("/videos")}
            />
          </div>
          <MenuAccordion
            sellingMenu={models}
            //  icon={<Iconmo}
          />
          <MenuWithIcon
            icon={<IconInstatQuote />}
            link="/dashboard/comments"
            active={path.includes("/comments")}
            label="Comments"
          />

          <div className="mb-0">
            <MenuAccordion sellingMenu={pagesEditor} />
          </div>
          {user?.role == "admin" && (
            <hr className="border-[#EBEBEB] w-full my-4" />
          )}
          {user?.role == "admin" && (
            <div className="mb-4">
              {buyingMenu?.label && (
                <label className="text-xsm block font-normal leading-[18.2px] font-satoshi text-[#2a292c] capitalize px-3 pb-1.5 opacity-65">
                  {buyingMenu?.label}
                </label>
              )}
              <MenuAccordion sellingMenu={buyingMenu} />
              <MenuAccordion sellingMenu={payments} />
            </div>
          )}
          <hr className="border-[#EBEBEB] w-full my-4" />
          <div className="mb-4">
            <label className="text-xsm block font-normal leading-[18.2px] font-satoshi text-[#2a292c] capitalize px-3 pb-1.5 opacity-65">
              More
            </label>
            {user?.role == "admin" && (
              <MenuWithIcon
                icon={<IconUser className="block w-5 h-5" />}
                link="/dashboard/users"
                active={path.includes("/users")}
                label="Users"
              />
            )}
            <MenuWithIcon
              icon={<IconSearchStatus className="block w-5 h-5" />}
              link="/dashboard/seo"
              active={path.includes("/seo")}
              label="SEO"
            />
            {user?.role == "admin" && (
              <MenuWithIcon
                icon={<IconAnalytics className="block fill-[#292D32]" />}
                link="/dashboard/analytics"
                active={path.includes("/account")}
                label="Analytics"
              />
            )}
            {user?.role == "admin" && (
              <MenuWithIcon
                icon={<IconPersonalCard className="block w-5 h-5" />}
                link="/dashboard/customers"
                active={path.includes("/dashboard/customers")}
                label="Customers"
              />
            )}
            <button
              onClick={handleClearCookie}
              className="flex gap-x-2 px-3 py-2"
            >
              <IconLogout />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);

const MenuWithIcon = ({ icon, link, active, label, count }) => {
  return (
    <Link
      className={`w-full px-3 py-2 transition-all duration-300 rounded-md justify-between items-center gap-2 flex
            text-heading text-sm font-medium font-satoshi leading-7
            ${active ? "bg-[#edebe7]" : ""}`}
      href={link || ""}
    >
      <span className="flex items-center gap-2">
        <div className="w-5 h-5 relative">{icon}</div>
        {label}
      </span>
      {count && (
        <span className="text-white text-xs font-medium leading-[16.8px] font-satoshi py-0.5 px-1.5 bg-positive rounded-md">
          {count}
        </span>
      )}
    </Link>
  );
};

const MenuAccordion = ({ sellingMenu, active }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };
  useEffect(() => {
    if (active) {
      setIsOpen(true);
    }
  }, [active]);
  return (
    <>
      {sellingMenu?.menuWithIcon && (
        <Box
          className="w-full px-3 py-2 transition-all duration-300 rounded-md justify-between items-center gap-2 !flex
      text-heading text-sm font-medium font-satoshi leading-7 cursor-pointer"
          onClick={toggleAccordion}
        >
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 relative">
              {sellingMenu?.menuWithIcon?.icon}
            </div>
            {sellingMenu?.menuWithIcon?.label}
          </div>
          <IconSidebarAccordion
            className={
              isOpen
                ? "transition-all duration-300 rotate-180"
                : "transition-all duration-300"
            }
          />
        </Box>
      )}
      {sellingMenu?.children && (
        <div
          className={`duration-300 transition-all ${
            isOpen ? "max-h-[1000px]" : "max-h-[0]"
          } overflow-hidden`}
        >
          {sellingMenu?.children.map((item, i) =>
            item?.link ? (
              <Link
                key={i}
                href={item?.link || "#"}
                className={`w-full px-3 py-2
${item?.active ? "bg-[#edebe7] text-main-black" : "text-[#636363]"}
rounded-md justify-start items-center gap-2 inline-flex hover:bg-[#edebe7] transition-all duration-300 text-sm font-medium font-satoshi leading-7`}
              >
                {item?.label}
              </Link>
            ) : (
              <label
                key={i}
                className="text-xsm  block font-normal leading-[18.2px] font-satoshi text-[#2a292c] capitalize px-3 py-1.5 opacity-80  bg-stroke rounded-md mb-2"
              >
                {item?.label}
              </label>
            )
          )}
        </div>
      )}
    </>
  );
};

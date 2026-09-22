"use client";
import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import ImageUploader from "@/components/dashboard/ImageUploader/ImageUploader";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import SuccessNotification from "@/components/global/alerts/SuccessNotification";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import Switch from "@/components/ui/switch/Switch";
import useTheme from "@/contexts/theme/ThemeProvider";
import { HeadingWrapper } from "@/sections/(dashboard)/create-post/CreateListingForm";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Index = () => {
  const { headerData, getHeaderData } = useTheme();
  const [formData, setFormData] = useState({});
  const [activeEditMenu, setActiveEditMenu] = useState(-1);
  const [menuDataRows, setMenuDataRows] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [editMenuData, setEditMenuData] = useState([]);
  const [error, setError] = useState({});
  const [menuItemData, setMenuItemData] = useState({ label: "", link: "" });
  const [success, setSuccess] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const addNewRow = () => {
    setMenuDataRows([...menuDataRows, { label: "", link: "" }]);
  };
  const cancelAddingMenu = () => {
    setMenuDataRows((prevItems) => prevItems.slice(0, -1));
  };
  const addMenuItem = () => {
    if (menuItemData?.label && menuItemData?.link) {
      setError((prev) => ({ ...prev, menuLink: false, menuLabel: false }));
      setMenuData([
        ...menuData,
        { label: menuItemData?.label, link: menuItemData?.link },
      ]);
      setMenuItemData({ label: "", link: "" });
      cancelAddingMenu();
    } else if (menuItemData?.label == "" && menuItemData?.link == "") {
      setError((prev) => ({ ...prev, menuLabel: true, menuLink: true }));
    } else if (menuItemData?.label == "") {
      setError((prev) => ({ ...prev, menuLabel: true }));
    } else if (menuItemData?.link == "") {
      setError((prev) => ({ ...prev, menuLink: true }));
    }
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      menus: menuData,
    }));
  }, [menuData]);
  useEffect(() => {
    if (headerData) {
      setMenuData(headerData?.menus || []);
      setEditMenuData(headerData?.menus || []);
      setFormData(headerData);
    }
  }, [headerData]);
  const updateHeader = async () => {
    try {
      setBtnLoading(true);
      const response = await fetch("/api/admin/header", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await response.json();
      if (!data.error) {
        setBtnLoading(false);
        setSuccess({
          active: true,
          message: "Header data Successfully updated.",
        });
        getHeaderData();
      } else {
        setBtnLoading(false);
        setError({
          active: true,
          message: data.error,
        });
      }
    } catch (error) {
      setBtnLoading(false);
      setError({
        active: true,
        message: "Something went wrong!",
      });
    } finally {
    }
  };
  const updateMenuData = async () => {
    try {
      setBtnLoading(true);
      const response = await fetch("/api/admin/header", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menus: editMenuData,
        }),
      });
      const data = await response.json();
      if (!data.error) {
        setBtnLoading(false);
        setSuccess({
          active: true,
          message: "Menus Successfully updated.",
        });
        setActiveEditMenu(-1);
        getHeaderData();
      } else {
        setBtnLoading(false);
        setError({
          active: true,
          message: data.error,
        });
      }
    } catch (error) {
      setBtnLoading(false);
      setError({
        active: true,
        message: "Something went wrong!",
      });
    } finally {
    }
  };
  const deleteMenuItem = async (label) => {
    const text = "Are you sure?\n You want to delete the Menu item.";
    if (confirm(text) == true) {
      try {
        setBtnLoading(true);
        const response = await fetch("/api/admin/header", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "remove-menu",
            _id: headerData?._id,
            label: label,
          }),
        });
        const data = await response.json();
        if (data) {
          setBtnLoading(false);
          setSuccess({
            active: true,
            message: "Menu Successfully Deleted.",
          });
          setActiveEditMenu(-1);
          getHeaderData();
        }
      } catch (error) {
        setBtnLoading(false);
      } finally {
      }
    }
  };
  return (
    <div className="">
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}
      {error?.active && (
        <ToastError
          active={error?.active}
          message={error?.message}
          setError={setError}
        />
      )}
      <div className="justify-between flex items-start">
        <HeaderHeading
          title="Header"
          description="Edit site header and navigation"
        />
        <MobileHeader heading='Header' />
        <button
          onClick={() => (btnLoading ? "" : updateHeader())}
          type="button"
          className={`text-center py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi max-md-tab:hidden ${
            btnLoading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {btnLoading ? "Updating" : "Save Changes"}
        </button>
      </div>
      <form className="pt-8">
        <HeadingWrapper heading="Site Logo" description="Update site logo">
          <Box className=" max-lg-mb:max-w-full w-full mb-4">
            <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
              Add Logo  <span className="text-xs text-text-secondary font-satoshi">(250X40px with max size 1MB)</span>
            </label>
            <ImageUploader
            label={"(250X40px with max size 1MB)"}
              id="header-logo"
              exportImage={(name, e) =>
                setFormData((prev) => ({
                  ...prev,
                  logo: {
                    src: e,
                    name: name,
                    link: formData?.logo?.link || "",
                  },
                }))
              }
              prevImage={formData?.logo?.src?.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net"
              )}
            />
          </Box>
          <InputDashboard
            name="link"
            placeholder="Add a Link"
            label="Add Link"
            value={formData?.logo?.link || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                logo: {
                  src: formData?.logo?.src,
                  link: e.target.value,
                },
              }))
            }
          />
        </HeadingWrapper>
        <HeadingWrapper
          heading="Header Navigation"
          description="Add site main links here"
        >
          {menuData.length > 0 && (
            <div className="mb-6">
              <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
                Menu Items
              </label>
              <div className="mt-4">
                {menuData.map((item, index) => (
                  <div key={index}>
                    <div
                      className={`bg-warm rounded-lg py-3 px-5 ${
                        index > 0 ? "mt-2" : ""
                      }`}
                    >
                   <div className="flex items-center justify-between gap-4 max-lg-mb:flex-wrap">
                        {item?.label}

                        <div className="flex gap-4 items-center justify-end max-md-tab:gap-2 max-md-tab:w-full max-md-tab:justify-start">
                          {activeEditMenu === index && (
                            <button
                              onClick={() => updateMenuData()}
                              type="button"
                              className="bg-black max-lg-mb:text-xs text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
             
            "
                            >
                              Update
                            </button>
                          )}
                          <button 
                            onClick={() =>
                              setActiveEditMenu(
                                activeEditMenu === index ? -1 : index
                              )
                            }
                            type="button"
                            className={` text-sm max-lg-mb:text-xs max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
               ${activeEditMenu === index ? "bg-red-500" : "bg-black"}
              `}
                          >
                            {activeEditMenu === index ? "Cancel" : "Edit"}
                          </button>

                          <button
                            onClick={() => deleteMenuItem(item?.label)}
                            type="button"
                            className="text-custom-red max-lg-mb:text-xs max-w-[130px] w-full border border-custom-red  text-sm font-medium font-satoshi rounded-lg leading-[19px] px-4 py-1 min-w-[75px] min-h-[39px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    {activeEditMenu === index && (
                      <div className="flex gap-2 max-md-tab:flex-wrap items-start w-full my-4">
                        <div className="w-full">
                          <InputDashboard
                            name="label"
                            placeholder="Update label"
                            label="Update label"
                            value={editMenuData[index].label || item.label}
                            setInputData={(e) =>
                              setEditMenuData((prev) =>
                                prev.map((menu, i) =>
                                  i === index
                                    ? { ...menu, label: e.target.value }
                                    : menu
                                )
                              )
                            }
                          />
                        </div>
                        <div className="w-full">
                          <InputDashboard
                            name="link"
                            placeholder="Update Link"
                            label="Update Link"
                            value={editMenuData[index].link || item.link}
                            setInputData={(e) =>
                              setEditMenuData((prev) =>
                                prev.map((menu, i) =>
                                  i === index
                                    ? { ...menu, link: e.target.value }
                                    : menu
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {menuDataRows.length > 0 &&
            menuDataRows.map((item, index) => (
              <div className={`${index > 0 ? "mt-3" : ""}`} key={index}>
                <div className="flex gap-2 max-md-tab:flex-wrap items-start w-full">
                  <div className="w-full">
                    <InputDashboard
                      name="label"
                      placeholder="Add a label"
                      label="Add label"
                      value={menuItemData.label}
                      setInputData={(e) =>
                        setMenuItemData((prev) => ({
                          ...prev,
                          label: e.target.value,
                        }))
                      }
                    />
                    {error?.menuLabel && (
                      <div className="text-red-500 text-sm font-satoshi">
                        This field is required.
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <InputDashboard
                      name="link"
                      placeholder="Add a Link"
                      label="Add Link"
                      value={menuItemData.link}
                      setInputData={(e) =>
                        setMenuItemData((prev) => ({
                          ...prev,
                          link: e.target.value,
                        }))
                      }
                    />
                    {error?.menuLink && (
                      <div className="text-red-500 text-sm font-satoshi">
                        This field is required.
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 items-center mt-2 justify-end">
                  <button
                    onClick={() => addMenuItem()}
                    type="button"
                    className="bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
             
            "
                  >
                    Add
                  </button>
                  <button
                    onClick={() => cancelAddingMenu()}
                    type="button"
                    className="text-custom-red underline text-sm font-medium  font-satoshi leading-[19px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          <button
            type="button"
            className="w-full text-center py-3 border-dashed border border-black border-opacity-20  rounded-2xl mt-3 text-sm font-satoshi"
            onClick={addNewRow}
          >
            + Add menu
          </button>
        </HeadingWrapper>

        <HeadingWrapper heading="Additional buttons">
          <label
            className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 flex justify-between items-center
        border-b border-stroke pb-3
        "
          >
            Show Login Button{" "}
            <Switch
              defaultState={formData?.loginBtn}
              getState={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  loginBtn: e,
                }))
              }
            />
          </label>
          <label
            className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 flex justify-between items-center
        border-b border-stroke pb-3
        "
          >
            Show Search Button{" "}
            <Switch
              defaultState={formData?.searchBtn}
              getState={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  searchBtn: e,
                }))
              }
            />
          </label>
          <label className=" text-[#232323] text-base font-medium font-satoshi leading-[19px] mb-3 flex justify-between items-center">
            Custom Button
          </label>
          <div className="flex gap-2 max-md-tab:flex-wrap">
            <InputDashboard
              name="label"
              placeholder="Add a label"
              label="Add label"
              value={formData?.customButton?.label || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customButton: {
                    label: e.target.value,
                    link: formData?.customButton?.link,
                  },
                }))
              }
            />
            <InputDashboard
              name="link"
              placeholder="Add a Link"
              label="Add Link"
              value={formData?.customButton?.link || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customButton: {
                    link: e.target.value,
                    label: formData?.customButton?.label,
                  },
                }))
              }
            />
          </div>
          <button
            onClick={() => (btnLoading ? "" : updateHeader())}
            type="button"
            className={`w-full text-center py-3 bg-black text-white rounded-lg mt-6 text-sm font-satoshi ${
              btnLoading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {btnLoading ? "Updating" : "Save Changes"}
          </button>
        </HeadingWrapper>
      </form>
      {btnLoading && <Loader message="Updating Header..." />}
    </div>
  );
};

export default Index;

"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import RichTextEditor from "@/components/dashboard/RichTextEditor/RichTextEditor";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { HeadingWrapper } from "@/sections/(dashboard)/create-post/CreateListingForm";
import React, { useEffect, useState } from "react";

const Index = () => {
  const { getFooterDataAPI, footerData } = useAdmin();
  const [formData, setFormData] = useState({
    description: "",
    inner_pages: [],
    social_media: [],
  });

const [activeEditMenu, setActiveEditMenu] = useState(-1);
  const [editMenuData, setEditMenuData] = useState([]);
  useEffect(() => {
    if (footerData) {
      setFormData({
        description: formData.description || "",
        inner_pages: formData.inner_pages || [],
        social_media: formData.social_media || [],
      })
    }
  }, [footerData])

  const [menuDataRows, setMenuDataRows] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [error, setError] = useState({});
  const [menuItemData, setMenuItemData] = useState({ label: "", link: "" });
  const [success, setSuccess] = useState({});

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
      inner_pages: menuData,
    }));
  }, [menuData]);

  useEffect(() => {
    if (footerData) {
      setEditMenuData(footerData[0]?.inner_pages || []);
      setMenuData(footerData[0]?.inner_pages || []);
      setFormData(footerData[0]);
    }
  }, [footerData]);

  const updateHeader = async () => {
    try {
      const response = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await response.json();
      if (data) {
        setSuccess({
          active: true,
          message: "Footer data Successfully updated.",
        });
        getFooterDataAPI();
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    if (!footerData) {
      getFooterDataAPI();
    }
  }, [])

  const updateMenuData = async ()=>{
    try {
      const response = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inner_pages:editMenuData,
        }),
      });
      const data = await response.json();
      if (data) {
        setSuccess({
          active: true,
          message: "Menus Successfully updated.",
        });
        setActiveEditMenu(-1);
        getFooterDataAPI();
      }
    } catch (error) {
    } finally {
    }
  }
  const deleteMenuItem = async(label)=>{
    
    const text = 'Are you sure?\n You want to delete the Menu item.'
    if(confirm(text) == true){
    try {
      const response = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type:'remove-menu',
          _id:footerData[0]?._id,
          label:label
        }),
      });
      const data = await response.json();
      if (data) {
        setSuccess({
          active: true,
          message: "Menu Successfully Deleted.",
        });
        setActiveEditMenu(-1);
        getFooterDataAPI();
      }
    } catch (error) {
    } finally {
    }
  }
  }

  return (
    <div className="">
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}
      <div className="justify-between flex items-start">
        <HeaderHeading
          title="Footer"
          description="Edit site Footer and navigation"
        />
        <MobileHeader heading='Footer' />
        <button
          onClick={() => updateHeader()}
          type="button"
          className="text-center py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi max-md-tab:hidden"
        >
          Save Changes
        </button>
      </div>
      <form className="pt-8 max-md-tab:pt-4">

        <HeadingWrapper
          heading="Footer Description"
          description="Add Footer description here"  >
               <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
               Add Description*
              </label>
            <RichTextEditor 
             onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e,
              }))
            }
            value={formData?.description || ""}
            />       

        </HeadingWrapper>

        <HeadingWrapper
          heading="Footer Navigation"
          description="Add site main links here"
        >
          {menuData.length > 0 && (
            <div className="mb-6">
              <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
                Footer Menus
              </label>
              <div className="mt-4">
                {menuData.map((item, index) => {
             
                  return (
                  <div key={index}>
                  <div
                    key={index}
                    className={`bg-warm rounded-lg py-3 px-5 ${index > 0 ? "mt-2" : ""
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
                            className={` text-sm max-w-[130px] max-lg-mb:text-xs items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
               ${activeEditMenu === index ? "bg-red-500" : "bg-black"}
              `}
                          >
                            {activeEditMenu === index ? "Cancel" : "Edit"}
                          </button>

                          <button
                            onClick={() => deleteMenuItem(item?.label)}
                            type="button"
                            className="text-custom-red max-w-[130px] w-full border max-lg-mb:text-xs border-custom-red  text-sm font-medium font-satoshi rounded-lg leading-[19px] px-4 py-1 min-w-[75px] min-h-[39px]"
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
                  )

                })}
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

        <HeadingWrapper heading="Social Media Buttons">
          <label className=" text-[#232323] text-base font-medium font-satoshi leading-[19px] mb-3 flex justify-between items-center">
            Instagram Button
          </label>
          <div className="flex gap-2 max-md-tab:flex-wrap">
            <InputDashboard
              name="label"
              placeholder="Add a label"
              label="Add label"
              value={formData?.social_media[0]?.label || ""}
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
              value={formData?.social_media[0]?.link || ""}
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
          <label className=" text-[#232323] text-base font-medium font-satoshi leading-[19px] mb-3 flex justify-between items-center mt-[40px]">
            Twitter Button
          </label>
          <div className="flex gap-2 max-md-tab:flex-wrap">
            <InputDashboard
              name="label"
              placeholder="Add a label"
              label="Add label"
              value={formData?.social_media[1]?.label || ""}
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
              value={formData?.social_media[1]?.link || ""}
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
            onClick={() => updateHeader()}
            type="button"
            className="w-full text-center py-3 bg-black text-white rounded-lg mt-6 text-sm font-satoshi"
          >
            Save Changes
          </button>
        </HeadingWrapper>
      </form>
    </div>
  );
};

export default Index;

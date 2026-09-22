"use client";
import GetCategoryVideos from "@/components/dashboard/GetCategoryVideosCount/GetCategoryVideos";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { CreateSlug } from "@/utils/createSlug";
import { Box } from "@radix-ui/themes";
import Link from "next/link";
import { useState } from "react";

const Index = () => {
  const { categories, getAllCategories } = useAdmin();
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
  });
  const addCategoryDB = async () => {
    setBtnLoading(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData?.title,
          slug: formData?.slug,
          description: formData?.description,
        }),
      });
      const data = await response.json();
      if (data) {
        setBtnLoading(false);
        setFormData({
          title: "",
          slug: "",
          description: "",
        });
        getAllCategories();
      }
    } catch (error) {
      setBtnLoading(false);
    } finally {
    }
  };
  const trashCategory = async (id) => {
    const text = 'Are you sure?\n You want to delete the category.'
    if(confirm(text) == true){
    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        body: JSON.stringify({ id, status: "archive" }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data) {      
        getAllCategories();
      }
    } catch (error) {
    } finally {
    }
}
  };

  return (
    <div className="">
      <HeaderHeading
        description="Add and update categories."
        title="Categories"
        notification={false}
        home={true}
        search={true}
      />
      <MobileHeader heading='Categories' />
      <div className="flex gap-8 mt-8 max-md-tab:flex-wrap">
        <div className="flex-1 max-md-tab:flex-none max-md-tab:w-full">
          <div>
            <InputDashboard
              required={true}
              name="title"
              placeholder="Add a title"
              label="Add Title*"
              value={formData?.title || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: CreateSlug(e.target.value),
                }))
              }
            />
          </div>
          <div className="mt-4">
            <InputDashboard
              required={true}
              name="slug"
              placeholder="Slug"
              label="Add Slug"
              value={formData?.slug || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: CreateSlug(e.target.value),
                }))
              }
            />
          </div>
          <Box className=" max-lg-mb:max-w-full mt-4 w-full">
            <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
              Description
            </label>
            <textarea
              value={formData?.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="border border-stroke rounded-lg min-h-[151px] py-3 px-[15px]   w-full
           font-satoshi placeholder:text-text-input placeholder:font-normal leading-normal text-sm font-medium text-[#242424]"
              placeholder=""
            ></textarea>
          </Box>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => (btnLoading ? "" : addCategoryDB())}
              className={`bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
             ${btnLoading ? "opacity-50 pointer-events-none" : ""}
            `}
            >
              {btnLoading ? "Publishing" : "Publish"}
            </button>
          </div>
        </div>
        <div className="flex-1">
          {categories?.length > 0 && (
            <ul className="flex bg-warm p-2">
              <li className="w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
                S.no
              </li>
              <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
                Name
              </li>
              <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
                Description
              </li>
              <li className="flex-1 text-center text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
                Slug
              </li>
              <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative text-right  text-[#151516] ">
                Videos Count
              </li>
            </ul>
          )}
          {categories?.length > 0 && (
            <ul className="border-x border-warm">
              {categories.map((item, i) => (
                <li
                  className={`flex p-2 ${i % 2 == 1 ? "bg-warm" : ""}`}
                  key={i}
                >
                  <div className="capitalize w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="capitalize text-sm font-bold font-satoshi leading-6 relative   text-[#151516]">
                      {item?.title}
                    </div>
                    <div className="flex gap-2 max-md-tab:flex-wrap items-center">
                      <Link href={`/dashboard/categories/edit/${item?.slug}`} className="text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                        Edit
                      </Link>
                      <div className="w-[1px] h-3 bg-text-secondary"></div>
                      <button
                        onClick={() => trashCategory(item?.id)}
                        className="text-sm font-medium font-satoshi leading-6 relative   text-red-500"
                      >
                        Trash
                      </button>
                      <div className="w-[1px] h-3 bg-text-secondary hidden"></div>
                      <button className="text-sm hidden font-medium font-satoshi leading-6 relative   text-[#151516]">
                        View
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                    {item?.description
                      ? item?.description.slice(0, 50) + "..."
                      : "-"}
                  </div>
                  <div className="flex-1 text-center text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                    {item?.slug}
                  </div>
                  <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative  text-right text-[#151516]">
                    <GetCategoryVideos title={item?.title} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

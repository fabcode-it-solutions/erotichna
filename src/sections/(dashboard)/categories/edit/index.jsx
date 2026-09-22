"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { CreateSlug } from "@/utils/createSlug";
import { Box } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Index = ({slug}) => {
    const router = useRouter();
    const {getAllCategories} = useAdmin();
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
  });
  useEffect(()=>{
    if(slug){
        getCategory(slug);
    }
  },[slug])
  const getCategory = async (slug) => {
    try {
      const response = await fetch(
        `/api/admin/categories?slug=${encodeURIComponent(slug)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();  
      
      setFormData(data?.data)
    } catch (error) {
      console.error("Error fetching category videos:", error);
      return 0; 
    }
  };
  const addCategoryDB = async (id) => {
    setBtnLoading(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id:id,
          title: formData?.title,
          slug: formData?.slug,
          status:'active',
          description: formData?.description,
        }),
      });
      const data = await response.json();
      if (data) {
        setBtnLoading(false);  
        getAllCategories();  
        router.push('/dashboard/categories'); 
   
      }
    } catch (error) {
      setBtnLoading(false);
    } finally {
    }
  };
 
  return (
    <div className="">
      <HeaderHeading
        description="Add and update categories."
        title="Edit Category"
        notification={false}
        home={true}
        search={true}
      />
      <MobileHeader heading='Edit Category' />
      <div className="flex gap-8 mt-8 max-md-tab:flex-wrap">
        <div className="flex-1 max-w-[700px] max-md-tab:flex-none max-md-tab:max-w-full">
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
              onClick={() => (btnLoading ? "" : addCategoryDB(formData?.id))}
              className={`bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
             ${btnLoading ? "opacity-50 pointer-events-none" : ""}
            `}
            >
              {btnLoading ? "Updaing" : "Update"}
            </button>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default Index;

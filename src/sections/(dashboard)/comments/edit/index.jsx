"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Index = ({ slug }) => {
  const router = useRouter();
  const { getComments } = useAdmin();
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    _id: slug,
    author: {
      name: "",
      email: "",
    },
    comment: "",
  });
  const getSingleComment = async () => {
    try {
      const response = await fetch(`/api/admin/comments?singleId=${slug}`);
      const data = await response.json();
      if (data) {
        setFormData(data.data);
      }
    } catch (error) {
    } finally {
    }
  };
  useEffect(() => {
    getSingleComment();
  }, []);
  const editComments = async (e) => {
    e.preventDefault();
    const text = "Are you sure?\n You want to change the comment data.";
    if (confirm(text) == true) {
      try {
        setBtnLoading(true);
        const response = await fetch("/api/admin/comments", {
          method: "PUT",
          body: JSON.stringify({ ...formData, type: "edit" }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data) {
          setBtnLoading(false);
          getComments();
          router.push("/dashboard/comments");
        }
      } catch (error) {
        setBtnLoading(false);
      } finally {
      }
    }
  };
  return (
    <div>
      <HeaderHeading
        description="Edit users comments"
        title="Edit Comment"
        notification={false}
        home={true}
        search={true}
      />
      <MobileHeader heading='Edit Comment' />
      <form
        onSubmit={(e) => editComments(e)}
        className="w-full mt-8 max-w-[700px]"
      >
        <div>
          <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] block mb-3">
            Comment
          </label>
          <textarea
            required
            value={formData?.comment || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, comment: e.target.value }))
            }
            placeholder="Comment"
            className=" placeholder-opacity-0 placeholder-transparent           
          min-h-[200px] px-[15px] py-3 bg-white rounded-lg border
           border-[#eaeaea] justify-start items-center gap-2.5 flex w-full
            text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi
          "
          ></textarea>
        </div>
        <div className="flex gap-3 max-md-tab:flex-wrap mt-3">
          <InputDashboard
            required={true}
            name="name"
            placeholder="Author Name"
            label="Author Name*"
            value={formData?.author?.name || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                author: { ...prev.author, name: e.target.value },
              }))
            }
          />
          <InputDashboard
            required={true}
            name="name"
            placeholder="Author Email"
            label="Author Email*"
            value={formData?.author?.email || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                author: { ...prev.author, email: e.target.value },
              }))
            }
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className={`${
              btnLoading ? "opacity-30 pointer-events-none" : "opacity-100"
            } bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg  `}
          >
            {btnLoading ? "Updating" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Index;

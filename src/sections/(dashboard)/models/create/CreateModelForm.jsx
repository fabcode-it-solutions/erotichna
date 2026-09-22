"use client";
import IconCalander from "@/assets/icons/IconCalander";
import IconCheck from "@/assets/icons/IconCheck";
import IconInfo from "@/assets/icons/IconInfo";
import IconStatus from "@/assets/icons/IconStatus";
import ImageUploader from "@/components/dashboard/ImageUploader/ImageUploader";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import RichTextEditor from "@/components/dashboard/RichTextEditor/RichTextEditor";
import Tags from "@/components/dashboard/Tags/Tags";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { CreateSlug } from "@/utils/createSlug";
import { getFormattedDate } from "@/utils/getDate";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import Loader from "@/components/global/Loading/Loader";

const CreateModelForm = ({ modelData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "publish",
    upcoming_scene_video: "", // Corrected typo
    upcoming_scene_thumbnail_image: null, // We'll use null initially for an image file
    profile_image: null, // Use null initially
    categories: [],
    tags: [],
    seo: {
      title: "",
      description: "",
      permalink: "",
      keywords: [],
    },
  });

  useEffect(() => {
    if (modelData) {
      setFormData({
        title: modelData.title || "",
        description: modelData.description || "",
        status: modelData.status !== undefined ? modelData.status : "publish",
        upcoming_scene_video: modelData.upcoming_scene_video || "",
        categories: modelData.categories || [],
        profile_image: modelData.profile_image || "",
        tags: modelData.tags || [],
        seo: {
          title: modelData.seo?.title || "",
          description: modelData.seo?.description || "",
          permalink: modelData.seo?.permalink || "",
          keywords: modelData.seo?.keywords || [],
        },
      });
    }
  }, [modelData]);
  return (
    <Wrapper className="mt-8 pt-8 border-t border-stroke max-md-tab:border-0 max-md-tab:mt-0">
      <Flex className="!gap-16 max-md-tab:!flex-wrap max-md-tab:!gap-6">
        <Wrapper className="max-md-tab:flex hidden w-full">
          {" "}
          <Publish
            formData={formData}
            setFormData={setFormData}
            modelData={modelData}
          />
        </Wrapper>
        <Flex className="gap-4 !flex-col max-w-[70%] w-full max-md-tab:max-w-full">
          <InputDashboard
            required={true}
            name="title"
            placeholder="Add name"
            label="Add Model Name*"
            value={formData?.title || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
                seo: {
                  ...prev.seo,
                  title: e.target.value,
                  permalink: CreateSlug(e.target.value || ""),
                },
              }))
            }
          />

          {/* <div className="flex gap-4">
            <InputDashboard
              required={true}
              name="upcoming_scene_video"
              placeholder="Add video id"
              label="Add Upcoming Scene Video*"
              className=""
              value={formData?.upcoming_scene_video || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  upcoming_scene_video: e.target.value,
                }))
              }
            />
          </div> */}

          {/* Display video */}
          {/* {formData?.upcoming_scene_video && (
            <Wrapper>
              <VideoPlayer
                autoplay={"false"}
                 className='aspect-video'
                videoId={formData?.upcoming_scene_video}
              />
            </Wrapper>
          )} */}

          {/* File upload for thumbnail image */}
          {/* <Box className=" max-lg-mb:max-w-full w-full ">
            <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
              Upcoming Scene Thumbnail Image
            </label>
            <ImageUploader
              id="upcoming_scene_thumbnail_image"
              exportImage={(name, e) =>
                setFormData((prev) => ({
                  ...prev,
                  upcoming_scene_thumbnail_image: { name, file: e },
                }))
              }
              prevImage={modelData?.upcoming_scene_thumbnail_image}
            />
          </Box> */}

          {/* File upload for profile image */}
          <Box className=" max-lg-mb:max-w-full w-full ">
            <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
              Add Profile Picture{" "}
              <span className="text-xs text-text-secondary font-satoshi">
                (1080X1920px with max size 1MB)
              </span>
            </label>
            <ImageUploader
              label={"(1080X1920px with max size 1MB)"}
              id="profile_image"
              exportImage={(name, e) =>
                setFormData((prev) => ({
                  ...prev,
                  profile_image: { name, file: e },
                }))
              }
              prevImage={modelData?.profile_image?.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net"
              )}
            />
          </Box>

          {/* Model description */}
          <Box className=" max-lg-mb:max-w-full w-full">
            <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
              Add Model Description
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
          </Box>

          {/* SEO Fields */}
          <Wrapper className="mt-8  border-t border-stroke">
            <Box className="pt-8 pb-6 font-satoshi relative max-lg-mb:w-full text-base font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center max-lg-mb:text-[15px] max-lg-mb:leading-[22px]">
              SEO
            </Box>

            <InputDashboard
              required={true}
              name="meta-title"
              placeholder="Add a title"
              label="Meta Title"
              value={formData?.seo?.title || formData?.title || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  seo: {
                    ...prev.seo,
                    title: e.target.value,
                  },
                }))
              }
            />

            {/* Permalink */}
            <Box className=" max-lg-mb:max-w-full w-full mt-4">
              <InputDashboard
                required={true}
                name="meta-permalink"
                placeholder="Add a Permalink"
                label="Permalink"
                value={
                  formData?.seo?.permalink || CreateSlug(formData?.title || "")
                }
                setInputData={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      permalink: CreateSlug(e.target.value),
                    },
                  }))
                }
              />
            </Box>
            <Box className=" max-lg-mb:max-w-full w-full mt-4">
              <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
                Meta Description
              </label>
              <textarea
                maxLength={160}
                value={formData?.seo?.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      description: e.target.value,
                    },
                  }))
                }
                className="border border-stroke rounded-lg min-h-[151px] py-3 px-[15px] w-full font-satoshi placeholder:text-text-input placeholder:font-normal leading-normal text-sm font-medium text-[#242424]"
                placeholder="Meta Description"
              />
            </Box>

            {/* Keywords */}
            <Box className=" max-lg-mb:max-w-full w-full mt-4">
              <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
                Keywords
              </label>
              <Tags
                selectAll={{ tags: formData?.seo?.keywords || [] }}
                setSelectAll={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    seo: {
                      ...prev.seo,
                      keywords: e,
                    },
                  }))
                }
              />
            </Box>
          </Wrapper>
        </Flex>

        {/* Categories and Tags section */}
        <Flex className="flex-1">
          <Box className="w-full">
            <Wrapper className="max-md-tab:hidden w-full">
              {" "}
              <Publish
                formData={formData}
                setFormData={setFormData}
                modelData={modelData}
              />
            </Wrapper>
            <Categories setFormData={setFormData} formData={formData} />
            <Box className=" max-lg-mb:max-w-full w-full mt-4">
              <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
                Tags
              </label>
              <Tags
                placeholder="Type a tag"
                selectAll={{ tags: formData?.tags || [] }}
                setSelectAll={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e,
                  }))
                }
              />
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default CreateModelForm;

const Categories = ({ formData, setFormData }) => {
  const { categories, getAllCategories } = useAdmin();
  const [addCategory, setAddCategory] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [newcategory, setNewCategory] = useState("");
  const getAllSelectedCategories = (categories) => {
    setFormData((prev) => ({ ...prev, categories: categories }));
  };
  const addCategoryDB = async (newcategory) => {
    setBtnLoading(true);
    const slug = CreateSlug(newcategory);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newcategory,
          slug: slug,
        }),
      });
      const data = await response.json();
      if (data) {
        setBtnLoading(false);
        setNewCategory("");
        getAllCategories();
      }
    } catch (error) {
      console.error(error);
      setBtnLoading(false);
    } finally {
    }
  };
  return (
    <Wrapper className="w-full p-5 mt-6 rounded-lg border bg-gray-75 border-stroke max-lg-mb:p-3 max-md-tab:max-w-full max-lg-mb:border-0 max-lg-mb:shadow-10xl-large max-lg-mb:bg-white">
      <Box
        className={`pt-0 pb-6 font-satoshi relative max-lg-mb:w-full 
    text-base font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center
max-lg-mb:text-[15px] max-lg-mb:leading-[22px]
justify-between
`}
      >
        Categories
      </Box>
      {categories?.length === 0 && (
        <div className=" text-[#232323] text-sm font-medium  font-satoshi leading-[19px] mb-3  gap-1 text-center">
          No Record found.
        </div>
      )}
      {categories?.length > 0 && (
        <ul>
          {categories.map((item, i) => (
            <CheckBox
              key={i}
              label={item?.title}
              allselected={formData?.categories}
              setSelected={getAllSelectedCategories}
            />
          ))}
        </ul>
      )}
      <div className="flex justify-between items-center w-full border-t border-stroke mt-6 pt-3">
        <button
          className="text-custom-black underline text-sm font-medium  font-satoshi leading-[19px]"
          onClick={() => setAddCategory((prev) => !prev)}
        >
          + Add New Category
        </button>
      </div>
      {addCategory && (
        <div className="mt-3">
          <InputDashboard
            required={true}
            name="category"
            placeholder="Add a Category"
            value={newcategory}
            setInputData={(e) => setNewCategory(e.target.value)}
          />
          <button
            onClick={() => (btnLoading ? "" : addCategoryDB(newcategory))}
            className={`bg-black text-sm mt-3 items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
              ${btnLoading ? "opacity-50 pointer-events-none" : ""}
              `}
          >
            {btnLoading ? "Adding" : "Add Category"}
          </button>
        </div>
      )}
    </Wrapper>
  );
};
const CheckBox = ({ label, value, setSelected, allselected }) => {
  const [selectAll, setSelectAll] = useState(false);
  const handleSelect = () => {
    setSelectAll((prev) => !prev);
    const prevSelected = allselected || [];
    if (selectAll) {
      setSelected(prevSelected.filter((item) => item !== label));
    } else {
      if (!prevSelected.includes(label)) {
        setSelected([...prevSelected, label]);
      }
    }
  };
  useEffect(() => {
    if (!allselected) {
      setSelectAll(false);
    }
  }, [allselected]);
  return (
    <li
      onClick={() => handleSelect()}
      className=" text-[#232323] text-sm font-medium  font-satoshi leading-[19px] mb-3 cursor-pointer flex items-center gap-1"
    >
      <div
        className={`w-5 h-5 l rounded border flex items-center justify-center  ${
          selectAll
            ? " bg-positive border-positive"
            : "border-[#eaeaea]  bg-white"
        } `}
      >
        {selectAll && <IconCheck />}
      </div>
      {label}
    </li>
  );
};
const Publish = ({ formData, setFormData, modelData }) => {
  const date = new Date();
  const [status, setStatus] = useState("publish");
  const [published, setPublished] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loaderText, setLoaderText] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [scheduleBtn, setScheduleBtn] = useState(false);
  const [getScheduleDate, setScheduleDate] = useState(
    `${date.getFullYear}-${date.getMonth() + 1}-${date.getDate()}`
  );
  const [scheduleMinutes, setScheduleMinutes] = useState("00");
  const [scheduleHours, setScheduleHours] = useState("00");
  const [scheduleFullDate, setScheduleFullDate] = useState("");
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("publish");
  const router = useRouter();
  const submitForm = async (status) => {
    setFormData((prev) => ({ ...prev, status: status }));

    if (
      !formData?.title ||
      // !formData?.upcoming_scene_video ||
      !formData?.profile_image
    ) {
      setError({
        active: true,
        message: "Please enter required fields.",
      });
    } else {
      try {
        const response = await fetch("/api/admin/models", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            status: "publish",
          }),
        });
        const data = await response.json();
        if (!data.error) {
          setBtnLoading(false);
          setFormData({});
          setSuccess({
            active: true,
            message: `Model is successfully ${status}.`,
          });
          router.push("/dashboard/models");
        } else {
          setError({
            active: true,
            message: data.error,
          });
        }
      } catch (error) {
        setBtnLoading(false);
        setError({
          active: true,
          message: "Something went wrong! Please try again later.",
        });
      } finally {
      }
    }
  };

  const editForm = async (status) => {
    setLoaderText("Updating Data...");
    setFormData((prev) => ({ ...prev, status: status }));
    if (!formData?.title) {
      setError({
        active: true,
        message: "Please enter required fields.",
      });
    } else {
      setBtnLoading(true);
      try {
        const response = await fetch(
          `/api/admin/models/edit/${modelData.seo.permalink}`,
          {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
            }),
          }
        );
        const data = await response.json();
        console.log(data);

        if (!data.error) {
          setBtnLoading(false);
          setFormData({});
          setSuccess({
            active: true,
            message: `Model is successfully ${status}.`,
          });
          setTimeout(() => {
            router.push("/dashboard/models");
          }, 2000);
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
          message: "Something went wrong! Please try again later.",
        });
      } finally {
        setBtnLoading(false);
      }
    }
  };

  return (
    <Wrapper className="w-full p-5 rounded-lg border bg-gray-75 border-stroke max-lg-mb:p-3 max-md-tab:max-w-full max-lg-mb:border-0 max-lg-mb:shadow-10xl-large max-lg-mb:bg-white">
      {btnLoading && <Loader message={loaderText} />}
      <ul>
        <li className=" text-[#232323] text-sm font-medium  font-satoshi leading-[19px] mb-3 flex items-center gap-1">
          <IconStatus /> Status:{" "}
          <strong className="capitalize">{selectedStatus}</strong>
          <button
            className="text-custom-red underline"
            onClick={() => setStatus((prev) => !prev)}
          >
            Edit
          </button>
        </li>
        {status && (
          <li className="flex justify-normal items-center gap-3 mb-6">
            <select
              name="post_status"
              onChange={(e) => setSelectedStatus(e.target.value)}
              id="post_status"
              defaultValue="pending"
              className="bg-white max-w-[180px] text-sm items-center justify-center text-black font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 w-full flex gap-2 max-md-tab:flex-wrap rounded-lg"
            >
              <option value="publish">Publish</option>
              <option value="draft">Draft</option>
            </select>
            <button
              onClick={() => {
                setStatus(false);
              }}
              className="bg-black text-sm max-w-[60px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg"
            >
              Save
            </button>
            <button
              className="text-custom-red underline text-sm font-medium  font-satoshi leading-[19px]"
              onClick={() => setStatus(false)}
            >
              Cancel
            </button>
          </li>
        )}
        <li className=" text-[#232323] text-sm font-medium  font-satoshi leading-[19px] mb-3 hidden items-center gap-1">
          <IconCalander /> Published on: <strong>Jun 20, 2022 at 10:21</strong>
        </li>
        <li className=" text-[#232323] text-sm font-medium  font-satoshi leading-[19px] mb-3 flex items-center gap-1">
          <IconCalander /> Publish on:{" "}
          <strong>{scheduleFullDate || "Immediately"}</strong>
          {/* <button
            className="text-custom-red underline"
            onClick={() => setSchedule((prev) => !prev)}
          >
            Schedule
          </button> */}
        </li>
        {schedule && (
          <li className="flex justify-normal items-center gap-3 mb-6">
            <div className=" flex gap-2 max-md-tab:flex-wrap items-center">
              <input
                type="date"
                name="schedule-date"
                value={getScheduleDate || getFormattedDate()}
                min={getFormattedDate()}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full h-[39px] max-w-[150px]
               placeholder-opacity-0 placeholder-transparent  
          relative
      px-[15px] py-3 bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi
          
              "
              />
              <select
                onChange={(e) => setScheduleHours(e.target.value)}
                name="hours"
                id="hours"
                defaultValue={"00"}
                className=" placeholder-opacity-0 placeholder-transparent  w-[60px]
          h-[39px] px-[0px]  bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi
          "
              >
                <option value="00">00</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
              </select>

              <select
                onChange={(e) => setScheduleMinutes(e.target.value)}
                name="minutes"
                id="minutes"
                defaultValue={"00"}
                className=" placeholder-opacity-0 placeholder-transparent  w-[60px]
          h-[39px] px-[0px]  bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi
          "
              >
                <option value="00">00</option>
                <option value="01">01</option>
                <option value="02">02</option>
                <option value="03">03</option>
                <option value="04">04</option>
                <option value="05">05</option>
                <option value="06">06</option>
                <option value="07">07</option>
                <option value="08">08</option>
                <option value="09">09</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
                <option value="32">32</option>
                <option value="33">33</option>
                <option value="34">34</option>
                <option value="35">35</option>
                <option value="36">36</option>
                <option value="37">37</option>
                <option value="38">38</option>
                <option value="39">39</option>
                <option value="40">40</option>
                <option value="41">41</option>
                <option value="42">42</option>
                <option value="43">43</option>
                <option value="44">44</option>
                <option value="45">45</option>
                <option value="46">46</option>
                <option value="47">47</option>
                <option value="48">48</option>
                <option value="49">49</option>
                <option value="50">50</option>
                <option value="51">51</option>
                <option value="52">52</option>
                <option value="53">53</option>
                <option value="54">54</option>
                <option value="55">55</option>
                <option value="56">56</option>
                <option value="57">57</option>
                <option value="58">58</option>
                <option value="59">59</option>
              </select>
            </div>
            <button
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  scheduleTime: `${getScheduleDate}T${scheduleHours}:${scheduleMinutes}:00`,
                  status: "schedule",
                }));
                setScheduleBtn(true);
                setSchedule(false);
              }}
              className="bg-black text-sm max-w-[60px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg"
            >
              Save
            </button>
            <button
              className="text-custom-red underline text-sm font-medium  font-satoshi leading-[19px]"
              onClick={() => setSchedule(false)}
            >
              Cancel
            </button>
          </li>
        )}
      </ul>

      <div className="flex justify-between items-center w-full border-t border-stroke mt-4 pt-4">
        <button
          className="text-custom-red underline text-sm font-medium  font-satoshi leading-[19px]"
          onClick={() => setFormData({})}
        >
          Cancel
        </button>
        {!scheduleBtn && (
          <button
            onClick={() => {
              if (btnLoading) return; // If button is loading, do nothing
              return modelData
                ? editForm(selectedStatus === "publish" ? "published" : "draft")
                : submitForm(
                    selectedStatus === "publish" ? "published" : "draft"
                  );
            }}
            className={`bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
             ${btnLoading ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            {btnLoading
              ? selectedStatus === "publish"
                ? modelData
                  ? "Updating"
                  : "Publishing"
                : "Saving"
              : selectedStatus === "publish"
              ? modelData
                ? "Update"
                : "Publish"
              : "Save Draft"}
          </button>
        )}
        {scheduleBtn && (
          <button
            onClick={() => (btnLoading ? "" : editForm("schedule"))}
            className={`bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
             ${btnLoading ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            {btnLoading ? "Saving" : "Schedule"}
          </button>
        )}
      </div>

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
    </Wrapper>
  );
};

export const HeadingWrapper = ({
  heading,
  description,
  children,
  tooltip,
  className,
  headingStyle,
}) => {
  return (
    <Box
      className={`py-8 border-t border-stroke max-md-tab:border-0 w-full max-lg-mb:py-6 ${
        className || ""
      }`}
    >
      <Flex className="max-xsm-tab:flex-col max-lg-mb:!gap-5 max-lg-dx:!gap-8">
        <Box className="max-w-[41.1604714%] w-full max-xsm-tab:max-w-full">
          <Box
            className={`font-satoshi relative max-lg-mb:w-full text-base font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center
            max-lg-mb:text-[15px] max-lg-mb:leading-[22px]
           ${headingStyle || ""} `}
          >
            {heading}
            <Box className=" group/tooltip cursor-pointer max-lg-mb:!block !hidden">
              <Box className="relative">
                <IconInfo className="fill-[#242424] opacity-60 w-4 h-4" />
                <Image
                  src="/assets/images/polygon.svg"
                  width={14}
                  unoptimized={true}
                  height={14}
                  alt="polygon"
                  className="absolute bottom-[-17px] left-1/2 -translate-x-1/2 group-hover/tooltip:opacity-100 opacity-0 transition-all duration-300"
                />
              </Box>
              <Box
                className="
            absolute pointer-events-none z-[9]
                   top-[calc(100%+10px)] group-hover/tooltip:opacity-100
                    opacity-0 transition-all duration-300   left-1/2  -translate-x-1/2 
                     min-w-[200px]  text-center bg-[#242424] bg-opacity-60 backdrop-blur-[7px] rounded-[10px]
                     text-white leading-5 p-2 w-full
                     font-satoshi text-xs font-normal
            "
              >
                {description}
              </Box>
            </Box>
            {tooltip ? (
              <Box className=" group/tooltip cursor-pointer">
                <Box className="relative">
                  <IconInfo className="fill-[#242424] opacity-60 w-4 h-4" />
                  <Image
                    src="/assets/images/polygon.svg"
                    width={14}
                    unoptimized={true}
                    height={14}
                    alt="polygon"
                    className="absolute bottom-[-17px] left-1/2 -translate-x-1/2 group-hover/tooltip:opacity-100 opacity-0 transition-all duration-300"
                  />
                </Box>
                <Box
                  className="absolute pointer-events-none z-[9]
                   top-[calc(100%+10px)] group-hover/tooltip:opacity-100
                    opacity-0 transition-all duration-300   left-1/2  -translate-x-1/2 
                     min-w-[200px]  text-center bg-[#242424] bg-opacity-60 backdrop-blur-[7px] rounded-[10px]
                     text-white leading-5 p-2
                     font-satoshi text-xs font-normal
                     "
                >
                  {tooltip}
                </Box>
              </Box>
            ) : (
              ""
            )}
          </Box>

          <p className="max-w-[350px] max-lg-mb:hidden w-full mt-2 font-satoshi text-[#242424] text-opacity-70 text-[13px] leading-5 font-normal">
            {description}
          </p>
        </Box>
        <Box className="flex-1">{children}</Box>
      </Flex>
    </Box>
  );
};

export const RadioButton = ({
  label,
  value,
  tooltip,
  onChange,
  name,
  selected,
  sublabel,
}) => {
  return (
    <label
      className="bg-[#F7F8F9] py-1.5 px-3 gap-2 flex items-center rounded-[45px] font-satoshi leading-6 font-medium text-[15px]
       text-[#242424] text-opacity-90
       max-lg-mb:text-sm max-lg-mb:leading-6 relative
       "
    >
      <Box
        className={` border w-4 h-4 min-w-4 min-h-4 rounded-full relative ${
          selected ? "border-[#00BFB3]" : "border-[#DFDFE7]"
        }`}
      >
        {selected ? (
          <Box className="w-2.5 h-2.5 bg-[#00BFB3] rounded-full absolute top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 max-lg-mb:m-0.5"></Box>
        ) : (
          ""
        )}
      </Box>
      {label}{" "}
      {sublabel ? (
        <span className="text-[rgba(116,116,116,0.90)] block -ml-1">
          {sublabel}
        </span>
      ) : (
        ""
      )}
      {tooltip ? (
        <Box className=" group/tooltip cursor-pointer max-lg-mb:!block !hidden">
          <Box className="relative">
            <IconInfo className="fill-[#242424] opacity-60 w-4 h-4" />
            <Image
              src="/assets/images/polygon.svg"
              width={14}
              unoptimized={true}
              height={14}
              alt="polygon"
              className="absolute bottom-[-17px] left-1/2 -translate-x-1/2 group-hover/tooltip:opacity-100 opacity-0 transition-all duration-300"
            />
          </Box>
          <Box
            className="
          absolute pointer-events-none z-[9]
                 top-[38px] group-hover/tooltip:opacity-100
                  opacity-0 transition-all duration-300   right-0
                     text-center bg-[#242424] bg-opacity-60 backdrop-blur-[7px] rounded-[10px]
                   text-white leading-5 p-2 w-full
                   font-satoshi text-xs font-normal
          "
          >
            {tooltip}
          </Box>
        </Box>
      ) : (
        ""
      )}
      <input
        type="radio"
        className="hidden"
        checked={selected}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e)}
      />
    </label>
  );
};

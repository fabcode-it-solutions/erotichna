/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import IconCalander from "@/assets/icons/IconCalander";
import IconCheck from "@/assets/icons/IconCheck";
import IconDelete from "@/assets/icons/IconDelete";
import IconDragDots from "@/assets/icons/IconDragDots";
import IconImage from "@/assets/icons/IconImage";
import IconInfo from "@/assets/icons/IconInfo";
import IconStatus from "@/assets/icons/IconStatus";
import IconView from "@/assets/icons/Iconview";
import ImageUploader from "@/components/dashboard/ImageUploader/ImageUploader";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MultiSelect from "@/components/dashboard/MultiSelectInput/MultiSelectInput";
import RichTextEditor from "@/components/dashboard/RichTextEditor/RichTextEditor";
import Tags from "@/components/dashboard/Tags/Tags";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import useAuth from "@/contexts/auth/AuthProvider";
import { CreateSlug } from "@/utils/createSlug";
import { getFormattedDate } from "@/utils/getDate";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";

const CreateListingForm = ({ edit }) => {
  const list = useRef(null);
  const [formData, setFormData] = useState({});
  const [content, setContent] = useState("");
  const [modelsData, setModelsData] = useState(null);
  const [error, setError] = useState({});

  const handleModelChange = (selectedData) => {
    const array = Object.keys(selectedData).map((item, i) => ({
      id: selectedData[item]?.id,
      name: selectedData[item]?.label,
      link: selectedData[item]?.link,
    }));
    setFormData((prev) => ({
      ...prev,
      model: array || [],
    }));
  };
  const [images, setImages] = useState([]);
  const [previewSelected, setPreviewSelected] = useState([]);
  const getImages = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // Validations for image size and image count
      const MAX_IMAGES = 70;
      const MAX_SIZE = 1.4 * 1024 * 1024; // 1.4MB
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const validFiles = [];
      const errors = [];

      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];

        // Check type (JPG/JPEG.PNG)
        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name} (invalid format)`);
          continue;
        }
        /* if file size  > 170KB (max size) */
        if (file.size > MAX_SIZE) {
          errors.push(`${file.name} (exceeds 1.4MB)`);
          continue;
        }

        validFiles.push(file);
      }

      console.log("valid files -->", validFiles);
      console.log("error files -->", errors);

      /* alerady uploaded images + new Images > 70(max images) */
      if (images.length + validFiles.length > MAX_IMAGES) {
        setError({
          active: true,
          message: `You can only upload up to ${MAX_IMAGES} images.`,
        });
        return;
      }

      /* Show error for skipped images (if any) */
      if (errors.length) {
        // setError({
        //   active: true,
        //   message: `Some images were skipped: ${errors.join(", ")}`,
        // });
        setError({
          active: true,
          message: errors.map((e) => `• ${e}`).join("\n"),
        });
      }

      const newImages = [
        ...images,
        ...validFiles.map((file) => URL.createObjectURL(file)),
      ];

      const datImages = [];
      const fileReadPromises = validFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base = reader.result.split("base64,");
            resolve({ image: base[1], name: file.name });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReadPromises).then((results) => {
        setFormData((prev) => ({
          ...prev,
          galleryImages: {
            results,
          },
        }));
      });

      setImages(newImages);

      setTimeout(() => {
        if (typeof window !== "undefined") {
          const listElm = list.current;
          if (listElm) {
            Sortable.create(listElm, {
              handle: ".dragIcon",
              onEnd: (event) => {
                const updatedImages = Array.from(listElm.children).map((item) =>
                  item.getAttribute("data-src"),
                );
                setImages(updatedImages);
                setFormData((prev) => ({
                  ...prev,
                  previewIndexes: (previewSelected || []).map((src) =>
                    updatedImages.indexOf(src),
                  ),
                }));
              },
            });
          }
        }
      }, 200);

      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const removeImage = (image) => {
    const filterImages = images.filter((item) => item !== image);
    setImages(filterImages);
    const newPreviewSelected = previewSelected.filter((src) => src !== image);
    setPreviewSelected(newPreviewSelected);
    setFormData((prev) => ({
      ...prev,
      previewIndexes: newPreviewSelected.map((src) =>
        filterImages.indexOf(src),
      ),
    }));
  };

  const { getAllModels, allmodels } = useAdmin();

  useEffect(() => {
    getAllModels("all", 0);
  }, []);

  return (
    <Wrapper className="mt-8 pt-8 border-t border-stroke max-md-tab:border-0 max-md-tab:mt-0">
      <Flex className="!gap-16 max-md-tab:!flex-wrap max-md-tab:gap-6">
        <Wrapper className="max-md-tab:flex hidden w-full">
          {" "}
          <Publish formData={formData} setFormData={setFormData} />
        </Wrapper>
        <Flex className="gap-4 !flex-col max-w-[70%] max-md-tab:max-w-[100%] w-full">
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
                seo: {
                  title: e.target.value,
                  permalink: CreateSlug(e.target.value || ""),
                },
              }))
            }
          />
          <div className="flex gap-4">
            <InputDashboard
              required={true}
              name="video"
              placeholder="Add Full video id"
              label="Add Full Video*"
              className=""
              value={formData?.video?.src || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  video: {
                    src: e.target.value,
                    poster: formData?.video?.poster || "",
                    duration: formData?.video?.duration || "",
                  },
                }))
              }
            />
            <InputDashboard
              required={true}
              name="video-duration"
              placeholder="Add video duration"
              label="Video Duration"
              className=""
              value={formData?.video?.duration || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  video: {
                    duration: e.target.value,
                    src: formData?.video?.src || "",
                  },
                }))
              }
            />
          </div>
          {formData?.video?.src && (
            <Wrapper>
              <VideoPlayer
                videoId={formData?.video?.src}
                autoplay={"false"}
                className="aspect-video"
              />
            </Wrapper>
          )}
          <div className="flex gap-4">
            <div className="flex-1">
              <InputDashboard
                required={true}
                name="hoveredVideo"
                placeholder="Add Hover video id"
                label="Add Hover Video*"
                className=""
                value={formData?.hoveredVideo?.src || ""}
                setInputData={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hoveredVideo: {
                      src: e.target.value,
                    },
                  }))
                }
              />
              {formData?.hoveredVideo?.src && (
                <Wrapper className="mt-3">
                  {formData?.hoveredVideo?.src && (
                    <Wrapper>
                      <VideoPlayer
                        autoplay={"false"}
                        videoId={formData?.hoveredVideo?.src}
                        className="aspect-video"
                      />
                    </Wrapper>
                  )}
                </Wrapper>
              )}
            </div>
            <div className="flex-1">
              <InputDashboard
                required={true}
                name="trailer"
                placeholder="Add trailer id"
                label="Add Trailer*"
                className=""
                value={formData?.trailer?.src || ""}
                setInputData={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trailer: {
                      src: e.target.value,
                    },
                  }))
                }
              />
              {formData?.trailer?.src && (
                <Wrapper className="mt-3">
                  {formData?.trailer?.src && (
                    <Wrapper>
                      <VideoPlayer
                        autoplay={"false"}
                        videoId={formData?.trailer?.src}
                        className="aspect-video"
                      />
                    </Wrapper>
                  )}
                </Wrapper>
              )}
            </div>
          </div>
          <Box className=" max-lg-mb:max-w-full w-full ">
            <label className=" text-[#232323] block text-sm font-medium font-satoshi leading-[19px] mb-3">
              Add Video Thumbnail{" "}
              <span className="text-xs text-text-secondary font-satoshi">
                (1920X1080px with max size 1MB)
              </span>
            </label>
            <ImageUploader
              label={"(1920X1080px with max size 1MB)"}
              id="poster"
              exportImage={(name, e) =>
                setFormData((prev) => ({
                  ...prev,
                  poster: e,
                  posterData: { name, src: e },
                }))
              }
              prevImage={formData?.poster?.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net",
              )}
            />
          </Box>
          <Wrapper className="flex gap-4">
            {allmodels && (
              <MultiSelect
                options={allmodels}
                onSelectionChange={handleModelChange}
              />
            )}
          </Wrapper>
          <InputDashboard
            required={true}
            name="directedBy"
            placeholder="Directed By"
            label="Directed By*"
            value={formData?.directedBy || ""}
            setInputData={(e) =>
              setFormData((prev) => ({
                ...prev,
                directedBy: e.target.value,
              }))
            }
          />
          <Box className=" max-lg-mb:max-w-full w-full">
            <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
              Add Description
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
          <Box className=" max-lg-mb:max-w-full w-full">
            <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
              Expert
            </label>
            <textarea
              value={formData?.expert || ""}
              maxLength={150}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expert: e.target.value,
                }))
              }
              className="border border-stroke rounded-lg min-h-[151px] py-3 px-[15px]   w-full
           font-satoshi placeholder:text-text-input placeholder:font-normal leading-normal text-sm font-medium text-[#242424]"
              placeholder="Caption of post"
            ></textarea>
          </Box>
          <Wrapper className="mt-8  border-t border-stroke">
            <Box
              className={`pt-8 pb-6 font-satoshi relative max-lg-mb:w-full text-base font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center
            max-lg-mb:text-[15px] max-lg-mb:leading-[22px]
           `}
            >
              Thumbnails{" "}
              <span className="text-xs text-text-secondary font-satoshi">
                (1280X800px with max size 1.4 MB)
              </span>
            </Box>
            <Box className=" max-lg-mb:max-w-full w-full">
              <label
                htmlFor="images"
                className="min-h-[238px] max-lg-mb:min-h-[159px] max-lg-mb:border-0 cursor-pointer bg-[#F7F8F9] rounded-xl flex items-center justify-center border border-dashed border-black border-opacity-20"
              >
                <Flex direction={"column"} justify={"center"} align={"center"}>
                  <IconImage />

                  <p className="text-[#92929D] max-lg-mb:hidden text-center mt-1 mb-[5px] font-satoshi text-sm leading-6 font-normal">
                    <u className="font-medium text-[#1B2432]">
                      Click to upload
                    </u>{" "}
                    or drag and drop
                  </p>
                  <u className="font-medium text-[#1B2432] text-xsm leading-6 font-satoshi hidden max-lg-mb:block">
                    Upload images
                  </u>
                  <span className="text-center font-satoshi block text-[10px] font-normal leading-[18.1px] text-[#92929D]">
                    PNG, JPG, JPEG (1280X800px with max size 1.4MB)
                  </span>
                </Flex>
              </label>
              <input
                onChange={(e) => getImages(e)}
                type="file"
                id="images"
                accept="image/png, image/jpeg"
                className="hidden"
                multiple
              />
              <div className="max-lg-mb:overflow-auto max-lg-mb:max-w-[calc(100vw-16px)] max-lg-mb:-mr-4">
                {images.length > 0 && (
                  <ul
                    ref={list}
                    className="list flex flex-wrap gap-[13px] mt-5 max-lg-mb:mt-4 max-lg-mb:flex-nowrap"
                  >
                    {images.map((image, i) => (
                      <li
                        key={image}
                        data-src={image}
                        className="flex max-w-[calc(20%-10.4px)] max-lg-mb:min-w-[90px] items-center justify-center bg-white rounded-md border border-[#EFF0F5] relative"
                      >
                        <button
                          onClick={() => removeImage(image)}
                          className="delete w-5 h-5 absolute top-1 left-1 bg-white rounded-full flex justify-center items-center"
                        >
                          <IconDelete className="w-2.5 h-2.5 fill-negative" />
                        </button>
                        <button className="dragIcon absolute top-1.5 right-1.5 z-10 cursor-move">
                          <IconDragDots className="" />
                        </button>
                        <button
                          onClick={() => {
                            const already = previewSelected.includes(image);
                            if (already) {
                              const updated = previewSelected.filter(
                                (src) => src !== image,
                              );
                              setPreviewSelected(updated);
                              setFormData((prev) => ({
                                ...prev,
                                previewIndexes: updated.map((src) =>
                                  images.indexOf(src),
                                ),
                              }));
                            } else {
                              if (previewSelected.length >= 4) {
                                setError({
                                  active: true,
                                  message:
                                    "You can only select 4 preview images.",
                                });
                              } else {
                                const updated = [...previewSelected, image];
                                setPreviewSelected(updated);
                                setFormData((prev) => ({
                                  ...prev,
                                  previewIndexes: updated.map((src) =>
                                    images.indexOf(src),
                                  ),
                                }));
                              }
                            }
                          }}
                          className={`absolute bottom-1 left-1 z-10 px-2 py-0.5 rounded-md text-[10px] font-satoshi ${
                            previewSelected.includes(image)
                              ? "bg-black text-white"
                              : "bg-white text-black border"
                          }`}
                          title="Mark as public preview"
                        >
                          {previewSelected.includes(image)
                            ? `Preview ${previewSelected.indexOf(image) + 1}`
                            : "Preview"}
                        </button>

                        <Image
                          src={
                            image.replace(
                              "https://storage.bunnycdn.com/assets-erotichna",
                              "https://files-erotichna.b-cdn.net",
                            ) || "/assets/images/placeholder-light.png"
                          }
                          width={90}
                          height={90}
                          alt={`image-${i}`}
                          className="object-cover rounded-md min-w-[90px] max-h-[90px] min-h-[90px]"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Box>
          </Wrapper>
          <Wrapper className="mt-8  border-t border-stroke">
            <Box
              className={`pt-8 pb-6 font-satoshi relative max-lg-mb:w-full text-base font-medium leading-6 text-[#242424] text-opacity-90 !flex gap-1.5 items-center
            max-lg-mb:text-[15px] max-lg-mb:leading-[22px]
           `}
            >
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
                maxLength={500}
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
                className="border border-stroke rounded-lg min-h-[151px] py-3 px-[15px]   w-full
           font-satoshi placeholder:text-text-input placeholder:font-normal leading-normal text-sm font-medium text-[#242424]"
                placeholder="Meta Description"
              ></textarea>
            </Box>
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
        <Flex className="flex-1">
          <Box className="w-full">
            <Wrapper className="max-md-tab:hidden">
              {" "}
              <Publish formData={formData} setFormData={setFormData} />
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

export default CreateListingForm;

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
const Publish = ({ formData, setFormData }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState(false);
  const [published, setPublished] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [scheduleBtn, setScheduleBtn] = useState(false);
  const [getScheduleDate, setScheduleDate] = useState(null);
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [selectedHour, setSelectedHour] = useState("05"); // Default to 5 AM
  const [selectedMinute, setSelectedMinute] = useState("30"); // Default to 30 mins
  const [cronJobTime, setCronJobTime] = useState(null); // Stores the combined cron job time
  const validateForm = () => {
    const validations = [
      { condition: !formData?.title, message: "Please enter title." },
      { condition: !formData?.video?.src, message: "Please enter Video Id." },
      {
        condition: !formData?.hoveredVideo?.src,
        message: "Please enter Hover Video Id.",
      },
      {
        condition: !formData?.trailer?.src,
        message: "Please enter trailer Id.",
      },
      {
        condition: !(formData?.model?.length > 0),
        message: "Please select at least one model.",
      },

      {
        condition: !formData?.directedBy,
        message: "Please enter director name.",
      },
      {
        condition: !formData?.poster,
        message: "Please enter thumbnail image.",
      },
      // {
      //   condition: (formData?.previewIndexes || []).length !== 4,
      //   message: "Please select exactly 4 preview images.",
      // },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        setError({ active: true, message: validation.message });
        return false;
      }
    }

    setError({ active: false, message: "" });
    return true;
  };

  const submitForm = async (status) => {
    setFormData((prev) => ({ ...prev, status: status }));
    if (validateForm()) {
      setBtnLoading(true);
      try {
        const response = await fetch("/api/admin/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-token": user.userID,
          },
          body: JSON.stringify({
            ...formData,
            status: status,
          }),
        });
        const data = await response.json();
        if (!data.error) {
          if (status === "schedule") {
            const nowDate = new Date();

            const selectedDate = new Date(
              `${getScheduleDate}T${selectedHour}:${selectedMinute}:00`,
            );
            const scheduledTime = selectedDate - nowDate;

            const slug = formData.seo.permalink;

            const CronJob = await fetch(`/api/admin/cron`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "x-token": user.userID,
              },
              body: JSON.stringify({ scheduledTime, slug }),
            });

            const CronJobResponse = await CronJob.json();
          }
          setBtnLoading(false);
          setFormData((prev) => ({
            ...prev,
            viewlink: data.link,
          }));
          setSuccess({
            active: true,
            message: `Video is successfully ${status}.`,
          });
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

  return (
    <Wrapper className="w-full p-5 rounded-lg border bg-gray-75 border-stroke max-lg-mb:p-3 max-md-tab:max-w-full max-lg-mb:border-0 max-lg-mb:shadow-10xl-large max-lg-mb:bg-white">
      {btnLoading && (
        <Loader message="Adding video! This will take some time." />
      )}
      <Box
        className={`pt-0 pb-6 font-satoshi !flex relative max-lg-mb:w-full text-base font-medium leading-6 text-[#242424] text-opacity-90  gap-1.5 items-center max-lg-mb:text-[15px] max-lg-mb:leading-[22px] justify-between`}
      >
        Publish
        <div className="flex gap-2 max-md-tab:flex-wrap">
          <button
            onClick={() => submitForm("draft")}
            className="bg-black text-sm w-[100px] whitespace-nowrap items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white flex gap-2 max-md-tab:flex-wrap rounded-lg"
          >
            Save Draft
          </button>
          {formData.viewlink && (
            <Link
              href={`/videos/${formData.viewlink}`}
              className="text-sm items-center  justify-center text-black border border-black
             font-medium px-0 py-0 w-[39px] min-h-[39px]   transition-all duration-300  flex gap-2 max-md-tab:flex-wrap rounded-lg"
            >
              <IconView className="w-4 h-4" />
            </Link>
          )}
        </div>
      </Box>
      <ul>
        <li className=" text-[#232323] text-sm font-medium  font-satoshi leading-[19px] mb-3 flex items-center gap-1">
          <IconStatus /> Status: <strong>Draft</strong>
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
              id="post_status"
              defaultValue="pending"
              className="bg-white max-w-[180px] text-sm items-center justify-center text-black font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 w-full flex gap-2 max-md-tab:flex-wrap rounded-lg"
            >
              <option value="publish" className="hidden">
                Published
              </option>
              <option value="pending">Pending Review</option>
              <option value="draft">Draft</option>
            </select>
            <button className="bg-black text-sm max-w-[60px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg">
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
          <IconCalander /> Publish on: <strong>Immediately</strong>{" "}
          <button
            className="text-custom-red underline"
            onClick={() => setSchedule((prev) => !prev)}
          >
            Schedule
          </button>
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
                className="w-full h-[39px] max-w-[150px] placeholder-opacity-0 placeholder-transparent relative px-[15px] py-3 bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi"
              />
              <select
                name="hours"
                onChange={(e) => setSelectedHour(e.target.value)}
                id="hours"
                defaultValue={"01"}
                className=" placeholder-opacity-0 placeholder-transparent  w-[60px] h-[39px] px-[0px]  bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi "
              >
                {[...Array(24)].map((_, index) => (
                  <option
                    key={index}
                    value={String(index + 1).padStart(2, "0")}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </option>
                ))}
              </select>

              <select
                name="minutes"
                id="minutes"
                onChange={(e) => setSelectedMinute(e.target.value)}
                defaultValue={"00"}
                className=" placeholder-opacity-0 placeholder-transparent  w-[60px] h-[39px] px-[0px]  bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi"
              >
                {[...Array(60)].map((_, index) => (
                  <option key={index} value={String(index).padStart(2, "0")}>
                    {String(index).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setScheduleBtn(true)}
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
            onClick={() => (btnLoading ? "" : submitForm("published"))}
            className={`bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
             ${btnLoading ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            {btnLoading ? "Publishing" : "Publish"}
          </button>
        )}
        {scheduleBtn && (
          <button
            onClick={() => (btnLoading ? "" : submitForm("schedule"))}
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

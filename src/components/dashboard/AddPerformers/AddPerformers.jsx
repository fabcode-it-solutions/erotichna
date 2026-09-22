/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useRef, useState } from "react";
import InputDashboard from "../InputDashboard/InputDashboard";
import ToastError from "@/components/global/Toasts/ToastError";
import Image from "next/image";
import GetModelData from "../GetModelData/GetModelData";
import ImageUploader from "../ImageUploader/ImageUploader";
import IconDragDots from "@/assets/icons/IconDragDots";
import { createSwapy } from "swapy";
import IconDelete from "@/assets/icons/IconDelete";
import IconEdit from "@/assets/icons/IconEdit";
import Loader from "@/components/global/Loading/Loader";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import useAuth from "@/contexts/auth/AuthProvider";

const AddPerformers = ({ data, setFormData, field }) => {
  const { user } = useAuth();
  const swapy = useRef(null);
  const container = useRef(null);
  const [orderChanged, setOrderChanged] = useState(false);
  const [addVideo, setAddVideo] = useState(false);
  const [modelData, setModelData] = useState([]);
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [modelItemData, setModelItemData] = useState({
    heading: "",
    link: "",
    image: "",
  });

  useEffect(() => {
    if (data.length) {
      setModelData(data.sort((a, b) => a.order - b.order));
    }
  }, [data]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], itemsData: modelData },
    }));
  }, [modelData]);

  const addModelItem = async (e) => {
    e.preventDefault();
    const { heading, link, image } = modelItemData;

    if (!heading || !link || !image) {
      setError({ heading: !heading, link: !link, image: !image });
      return;
    }

    if (modelData.length >= 6) {
      setError({ modelLength: true });
      setTimeout(() => setError({ modelLength: false }), 5000);
      return;
    }
    setLoader(true);
    const re = await fetch("/api/admin/homepage/performers", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-token": user.userID,
      },
      body: JSON.stringify({ performer: { heading, link, image } }),
    });
    const s = await re.json();
    if (s.error) {
      setError(s.error);
      return null;
    }
    setSuccess({
      active: true,
      message: "Model added successfully. ",
    });
    setLoader(false);
    setError({ heading: false, link: false, image: false });
    setModelData([...modelData, modelItemData]);
    setModelItemData({ heading: "", link: "", image: "" });
    setTimeout(() => {
      if (container.current) {
        swapy.current.update();
      }
    }, 1500);
    setAddVideo(false);
  };

  const removeItem = async (index, id) => {
    if (confirm("Are you sure want to delete?")) {
      await fetch("/api/admin/homepage/performers?id=" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-token": user.userID,
        },
      });

      setModelData((prev) => prev.filter((_, i) => i !== index));
      setTimeout(() => {
        if (container.current) {
          swapy.current.update();
        }
      }, 1500);
    }
  };

  const getModelDetails = (e) => {
    setModelItemData({
      heading: e?.title,
      image: e?.profile_image,
      link: `/models/${e?.seo.permalink}`,
    });
  };
  useEffect(() => {
    if (modelData.length > 0) {
      swapy.current = createSwapy(container?.current, {
        swapMode: "hover",
      });
      swapy.current.onSwap((event) => {
        setOrderChanged(true);
      });
    }
  }, [modelData]);
  const updateOrder = async (e) => {
    e.preventDefault();
    const orders = swapy.current.slotItemMap().asArray;
    const filte = orders.map((item) => {
      const slot = item.slot.replace("slot-", "");
      const id = item.item.split("-");
      return {
        slot: Number(slot),
        item: id[1],
      };
    });
    try {
      setLoader(true);
      const response = await fetch("/api/admin/homepage/performers/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-token": user.userID },
        body: JSON.stringify({
          order: filte,
        }),
      });
      const data = await response.json();
      if (!data?.error) {
        setLoader(false);
        setSuccess({
          active: true,
          message: "Order updated successfully. ",
        });
        setOrderChanged(false);
      } else {
        setError({
          active: true,
          message: data.error,
        });
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };
  return (
    <div>
      {loader && <Loader message="Updating..." />}
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
      {error.modelLength && (
        <ToastError message="Only Six models allowed." active />
      )}
      <label className="text-sm font-medium my-3 block">Items</label>
      <button
        type="button"
        className="w-full text-center py-3 border-dashed mb-6 border border-black border-opacity-20  rounded-2xl mt-3 text-sm font-satoshi"
        onClick={() => setAddVideo((prev) => !prev)}
      >
        {!addVideo ? "+ Add Model" : "Cancel"}
      </button>
      {modelData.length === 0 && (
        <div className="text-center text-sm">No items found.</div>
      )}
      {addVideo && (
        <form onSubmit={addModelItem} className="bg-warm p-4 my-3 rounded-lg">
          <label className=" text-[#232323] text-sm font-medium font-satoshi leading-[19px] mb-3 block">
            Add from Models (automatic)
          </label>

          <GetModelData
            setVideoDetails={getModelDetails}
            placeholder="Select Model"
          />
          <div className="my-6 relative">
            <div className="bg-black bg-opacity-15 w-full h-[1px]"></div>
            <div className="bg-warm px-2 text-sm text-black absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 ">
              Or
            </div>
          </div>
          <label className=" text-[#232323] text-base font-medium font-satoshi leading-[19px] mb-3 block">
            Add manually
          </label>
          <InputDashboard
            name="modelHeading"
            placeholder="Add Heading"
            label="Add Heading *"
            value={modelItemData.heading}
            setInputData={(e) =>
              setModelItemData({ ...modelItemData, heading: e.target.value })
            }
          />
          {error.heading && (
            <div className="text-red-500 text-sm">This field is required.</div>
          )}

          <InputDashboard
            name="link"
            labelBgColor="!mt-3"
            placeholder="Add a Link"
            label="Add a Link *"
            value={modelItemData.link}
            setInputData={(e) =>
              setModelItemData({ ...modelItemData, link: e.target.value })
            }
          />
          {error.link && (
            <div className="text-red-500 text-sm">This field is required.</div>
          )}
          <div className="mt-3">
            <ImageUploader
              id="model-uploader"
              exportImage={(name, src) =>
                setModelItemData({ ...modelItemData, image: src })
              }
              prevImage={modelItemData.image?.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net"
              )}
            />
            {error.image && (
              <div className="text-red-500 text-sm">Image is required.</div>
            )}
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-black w-full text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>
          </div>
        </form>
      )}
      <label className="text-lg font-satoshi font-medium mt-3 mb-3 flex justify-between items-center">
        Performers
        <div className="flex gap-2">
          {orderChanged && (
            <button
              onClick={(e) => updateOrder(e)}
              type="button"
              className="text-center py-3 max-lg-mb:mt-2 bg-black  text-white px-5 rounded-lg text-sm font-satoshi"
            >
              Update Order
            </button>
          )}
          {orderChanged && (
            <button
              onClick={(e) => setOrderChanged(false)}
              type="button"
              className="text-center py-3  max-lg-mb:mt-2  max-lg-mb:ml-2 bg-red-500  text-white px-5 rounded-lg text-sm font-satoshi"
            >
              Cancel
            </button>
          )}
        </div>
      </label>
      <div
        className="grid grid-cols-6 max-xl-dx:grid-cols-5 max-lg-dx:grid-cols-4 max-lg-tab:grid-cols-3 max-md-tab:grid-cols-2 max-lg-mb:grid-cols-1 gap-2 mt-2 "
        ref={container}
      >
        {modelData.map((item, index) => (
          <div
            key={index}
            data-swapy-slot={`slot-${index}`}
            className="bg-warm rounded-lg relative flex-1 overflow-hidden"
          >
            <div
              data-swapy-item={`item-${item._id || "new"}-${index}`}
              className="bg-warm rounded-lg py-0 px-0 relative flex-1"
            >
              <button className="absolute top-4 left-4 z-[2]">
                <IconDragDots
                  className="fill-white"
                  opacity={1}
                  fillColor="#fff"
                />
              </button>
              <div className="">
                {item.image && (
                  <Image
                    src={item.image.replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    )}
                    width={300}
                    unoptimized={true}
                    height={535}
                    className="object-cover h-auto rounded-lg"
                    alt="Performer"
                  />
                )}
              </div>
              <div className="absolute bottom-0 w-full h-full from-[rgba(0,0,0,0)] to-[rgba(0,0,0,0.5)] bg-gradient-to-b left-0 p-2 flex items-end">
                <div className=" flex justify-between w-full items-center">
                  <span className="text-white text-base font-semibold ">
                    {" "}
                    {item.heading}
                  </span>
                  <div className=" flex gap-2">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-custom-red underline hidden text-sm bg-black w-7 h-7  justify-center items-center rounded-md"
                    >
                      <IconEdit className="w-5 h-5 fill-white" />
                    </button>
                    <button
                      onClick={() => removeItem(index, item._id)}
                      className="text-custom-red underline text-sm bg-custom-red w-7 h-7 flex justify-center items-center rounded-md"
                    >
                      <IconDelete className="w-5 h-5 fill-white" />
                    </button>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddPerformers;

"use client";
import IconCheck from "@/assets/icons/IconCheck";
import Loader from "@/components/global/Loading/Loader";
import VideoSkeleton from "@/components/global/Loading/VideoSkeleton/VideoSkeleton";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import VideoPlayer from "@/components/global/videoPlayer/VideoPlayer";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import useTheme from "@/contexts/theme/ThemeProvider";
import { Container } from "@radix-ui/themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const Index = () => {
  const { homeData, fonts } = useTheme();
  const { getBeOurModelDataAPI, beOurModelData } = useAdmin();
  const [success, setSuccess] = useState({});
  const [successForm, setSuccessForm] = useState(false);
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    modelName: "",
    brandsWorkedWith: "",
    instagram: "",
    twitter: "",
    location: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    modelName: "",
    brandsWorkedWith: "",
    instagram: "",
    twitter: "",
    location: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error message on user input
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base = reader.result.split("base64,");
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
          imageData: { name: file.name, src: base[1] },
        }));
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      image: "", // Clear error message on file change
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.modelName) newErrors.modelName = "Model Name is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (formData.instagram && !/^[@a-zA-Z0-9_]+$/.test(formData.instagram))
      newErrors.instagram = "Instagram username is invalid";
    if (formData.twitter && !/^[@a-zA-Z0-9_]+$/.test(formData.twitter))
      newErrors.twitter = "Twitter username is invalid";
    if (!formData.image) newErrors.image = "Please upload an image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if validation fails

    try {
      setLoader(true);
      const response = await fetch("/api/admin/be-our-model/mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
        }),
      });
      const data = await response.json();
      if (!data.error) {
        setSuccessForm(true);
        setSuccess({
          active: true,
          message: "Form Successfully Submitted.",
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          modelName: "",
          brandsWorkedWith: "",
          instagram: "",
          twitter: "",
          location: "",
          image: "",
        });
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!beOurModelData) {
      getBeOurModelDataAPI();
    }
  }, [beOurModelData]);

  return (
    <>
      <div className="bg-black pb-[100px]">
        {loader && <Loader message="Sending Email..." />}
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
        <section>
          <div className="w-full relative group/banner overflow-hidden pb-[400px] max-lg-mb:p-0 max-lg-mb:aspect-video">
            <div className="group/banner">
              <Image
                src={
                  beOurModelData?.desktopImage?.replace(
                    "https://storage.bunnycdn.com/assets-erotichna",
                    "https://files-erotichna.b-cdn.net"
                  ) || "/assets/images/Backrouns_image.jpg"
                }
                width={1920}
                unoptimized={true}
                height={1080}
                alt="banner"
                className="absolute top-0 left-0 w-full h-full object-cover max-lg-mb:hidden group-hover/banner:opacity-0"
              />
              <Image
                src={
                  beOurModelData?.mobileImage?.replace(
                    "https://storage.bunnycdn.com/assets-erotichna",
                    "https://files-erotichna.b-cdn.net"
                  ) || "/assets/images/Backrouns_image.jpg"
                }
                unoptimized={true}
                width={1920}
                height={1080}
                alt="banner"
                className="absolute top-0 left-0 w-full h-full object-cover max-lg-mb:block hidden group-hover/banner:opacity-0"
              />
              {beOurModelData?.video?.link ? (
                <VideoPlayer
                  videoId={beOurModelData?.video?.link}
                  autoplay={"true"}
                  className="absolute top-0 left-0 aspect-video"
                />
              ) : (
                <VideoSkeleton animation={false} />
              )}
            </div>

            <div className="w-full absolute bottom-4 z-[1] left-0">
              <Container className="dex-3xl:px-6 mb-2xl:px-4 px-4">
                <h1
                  className={`${fonts?.open_Sans} block text-white text-[36px] font-semibold`}
                >
                  {beOurModelData?.heading}
                </h1>
              </Container>
            </div>
          </div>
        </section>
        <div className="px-4">
          <section className="max-w-xl mx-auto p-6 max-lg-mb:px-4 bg-dark-150 rounded-lg shadow-lg mt-12 space-y-6 ">
            {successForm ? (
              <div>
                <div className="flex justify-center items-center">
                  <div className="w-12 h-12 border border-white rounded-full flex justify-center items-center">
                    <IconCheck className="stroke-white w-6 h-6 mt-[1px]" />
                  </div>
                </div>
                <h2 className="text-3xl font-semibold text-center text-white mt-4">
                  Your form is successfully submitted!
                </h2>
                <p className="text-md text-center text-white mt-6">
                  Our team will contact you asap.
                </p>
              </div>
            ) : (
              <div>
                {" "}
                <h2 className="text-3xl font-semibold text-center text-white mb-4">
                  Wanna be our Model?
                </h2>
                <p className="text-md text-center text-white mb-6">
                  Please fill out the form below, and we will get back to you
                  shortly.
                </p>
                <form
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                  className="space-y-6"
                >
                  {/* First and Last Name in the same line */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium block text-white mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium  block text-white mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium  text-white mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Model Name */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="modelName"
                      className="text-sm font-medium text-white mb-2"
                    >
                      Your Model Name
                    </label>
                    <input
                      type="text"
                      id="modelName"
                      name="modelName"
                      value={formData.modelName}
                      onChange={handleChange}
                      placeholder="Enter your model name"
                      className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                    />
                    {errors.modelName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.modelName}
                      </p>
                    )}
                  </div>

                  {/* Brands Worked With */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="brandsWorkedWith"
                      className="text-sm font-medium text-white mb-2"
                    >
                      Which brands have you worked with before?
                    </label>
                    <input
                      type="text"
                      id="brandsWorkedWith"
                      name="brandsWorkedWith"
                      value={formData.brandsWorkedWith}
                      onChange={handleChange}
                      placeholder="Enter brands you've worked with"
                      className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                    />
                    {errors.brandsWorkedWith && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.brandsWorkedWith}
                      </p>
                    )}
                  </div>

                  {/* Instagram */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="instagram"
                      className="text-sm font-medium text-white mb-2"
                    >
                      Instagram Account
                    </label>
                    <input
                      type="text"
                      id="instagram"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="Enter your Instagram username"
                      className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                    />
                    {errors.instagram && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.instagram}
                      </p>
                    )}
                  </div>

                  {/* Twitter */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="twitter"
                      className="text-sm font-medium text-white mb-2"
                    >
                      Twitter Account
                    </label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="Enter your Twitter username"
                      className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                    />
                    {errors.twitter && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.twitter}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="location"
                      className="text-sm font-medium text-white mb-2"
                    >
                      Where are you located now?
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter your city and country"
                      className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="image"
                      className="text-sm font-medium text-white mb-2"
                    >
                      Please upload a full view of yourself
                    </label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleFileChange}
                      className="p-3 text-white  focus:ring-2 focus:ring-blue-500 file:bg-blue-100 file:border-none file:text-blue-600 file:font-semibold file:rounded-md"
                    />
                    {formData?.image && (
                      <div className="w-full flex justify-center border border-dark-100 rounded-lg">
                        <Image
                          src={
                            formData?.image.replace(
                              "https://storage.bunnycdn.com/assets-erotichna",
                              "https://files-erotichna.b-cdn.net"
                            ) || "/assets/images/placeholder-light.png"
                          }
                          alt="Image"
                          width={200}
                          unoptimized={true}
                          height={200}
                          className="max-w-[150px] object-contain"
                        />
                      </div>
                    )}
                    {errors.image && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.image}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-[#ff4040] w-full uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black
  tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5"
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Index;

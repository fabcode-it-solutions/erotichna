/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Anchor from "@/components/global/Anchor/Anchor";
import React, { useState, useEffect } from "react";
import useAuth from "@/contexts/auth/AuthProvider";
import DummyImg from "../../../../../public/assets/images/dummy.png";
import Image from "next/image";
import Link from "next/link";
import { Box } from "@radix-ui/themes";
import LogoutButton from "@/components/ui/button/LogoutButton";
import { useRouter } from "next/navigation";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import ToastError from "@/components/global/Toasts/ToastError";

const Profile = () => {
  const { user, userloggedIn, userSession, setUser } = useAuth(); // Getting user data from Auth context
  const [isEditing, setIsEditing] = useState(false);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const [success, setSuccess] = useState({});

  console.log("user -->", user);
  console.log("userloggedIn -->", userloggedIn);
  console.log("userSession -->", userSession);
  console.log("setUser -->", setUser);

  const [error, setError] = useState({});
  useEffect(() => {
    if (userSession == "null" && !userloggedIn) {
      setTimeout(() => {
        router.push("/");
      }, 2000);
      return;
    }
    if (userSession != "null" && userSession != false) {
      setLoader(false);
    }
  }, [userSession]);
  const [profileData, setProfileData] = useState({
    firstName: "",
    username: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    gender: "",
    dob: "",
    photo: "",
    id: "",
    image: "",
  });

  const [errors, setErrors] = useState({}); // Track form validation errors

  useEffect(() => {
    setLoader(false);
    if (user) {
      setProfileData({
        username: user?.username || "",
        firstName: user?.firstName || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        phone_number: user?.phone_number || "",
        address: "",
        gender: "",
        dob: "",
        image: user?.image || "",
        id: user._id,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear errors when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file); // Convert file to Base64
      setProfileData((prevState) => ({
        ...prevState,
        photo: base64, // Store Base64 string
      }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read file as data URL
      reader.onload = () => resolve(reader.result); // Resolve Base64 string
      reader.onerror = (error) => reject(error);
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profileData.firstName) newErrors.firstName = "First Name is required.";
    if (!profileData.last_name) newErrors.last_name = "Last Name is required.";
    if (
      !profileData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)
    ) {
      newErrors.email = "Valid Email is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsEditing(false);

    const updateProfile = async () => {
      try {
        const response = await fetch(`/api/auth/users/${user._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });
        const updatedData = await response.json();
        if (response.ok) {
          setUser(updatedData.data);
          setSuccess({
            active: true,
            message: `Profile updated successfully`,
          });
        } else {
          setError({ active: true, message: updatedData.message });
        }
      } catch (error) {
        setError({ active: true, message: error.message });
      }
    };

    updateProfile();
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center items-start pt-[100px] pb-[100px]">
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
      {loader && (
        <div className="w-full h-full top-0 left-0 bg-black fixed z-[9999]"></div>
      )}
      {/* Background Image */}
      <Image
        src="/assets/images/Backrouns_image.jpg"
        width={1920}
        height={1080}
        unoptimized={true}
        className="w-full h-full object-cover absolute top-0 left-0 z-[1]"
        alt="Background Image"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90 z-[2]" />

      <Box className="relative z-10 min-h-[calc(100vh-252px)] w-full flex items-center justify-center px-6 max-lg-mb:px-4">
        <div className="container flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
          {/* Profile Section */}
          <div className="w-full lg:w-2/3 bg-black/60 backdrop-blur-sm p-8 rounded-lg shadow-2xl border border-white/20 max-lg-mb:p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold mb-6 text-white">
                Profile Information
              </h2>
              <LogoutButton />
            </div>
            <form className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-32 h-32 rounded-full max-lg-mb:w-20 max-lg-mb:h-20 overflow-hidden bg-gray-800 shadow-lg border-2 border-white/30">
                  <Image
                    src={
                      profileData.photo?.replace(
                        "https://storage.bunnycdn.com/assets-erotichna",
                        "https://files-erotichna.b-cdn.net"
                      ) ||
                      DummyImg.src ||
                      "/assets/images/placeholder-dark.png"
                    }
                    unoptimized={true}
                    alt="Profile picture"
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                  />
                </div>
                <label
                  htmlFor="image"
                  className="cursor-pointer text-sm text-white bg-red-500  hover:bg-red-600 font-semibold font-satoshi  px-4 py-2 rounded "
                >
                  Change Profile Image
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleFileChange}
                  name="image"
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-75"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-md focus:ring-2 bg-gray-800 text-white font-semibold 
                    ${
                      errors.firstName
                        ? "border-red-500 ring-red-500"
                        : "border-gray-700 focus:ring-red-500"
                    } disabled:bg-gray-800`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="last_name"
                    className="text-sm font-medium text-gray-75"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-md focus:ring-2 bg-gray-800 text-white font-semibold
                    ${
                      errors.last_name
                        ? "border-red-500 ring-red-500"
                        : "border-gray-700 focus:ring-red-500"
                    } disabled:bg-gray-800`}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-75"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-3 border rounded-md focus:ring-2 bg-gray-800 text-white font-semibold 
                    ${
                      errors.username
                        ? "border-red-500 ring-red-500"
                        : "border-gray-700 focus:ring-red-500"
                    } disabled:bg-gray-800`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-75"
                  >
                    Email
                  </label>
                  <div
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    className="w-full p-3 border rounded-md bg-gray-800 text-white cursor-not-allowed border-gray-700"
                  >
                    {profileData.email}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="phone_number"
                  className="text-sm font-medium text-gray-75"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-md focus:ring-2 border-gray-700 bg-gray-800 text-white font-semibold focus:ring-red-500 disabled:bg-gray-800"
                />
              </div>

              {isEditing ? (
                <div className="flex">
                  <button
                    type="button"
                    onClick={(e) => handleSave(e)}
                    className="px-6 py-3 text-white bg-red-500 rounded-md w-full hover:bg-red-600 font-bold transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 text-white bg-red-500 w-full rounded-md hover:bg-red-600 font-bold transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Subscription Management */}
          <div className="w-full lg:w-1/3">
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg shadow-2xl border border-white/20">
              <h2 className="text-xl font-semibold mb-4 text-white text-center">
                Subscription & Billing
              </h2>
              <p className="text-gray-400 text-sm mb-4 text-center">
                Manage your subscription and view payment history
              </p>
              <div className="text-center">
                <Link
                  href="/subscription-dashboard"
                  className="inline-flex items-center px-6 py-3 bg-[#ff4040] hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View Full Dashboard
                </Link>
              </div>

              {/* Quick subscription status */}
              {user?.subscription?.active &&
                user?.subscription?.status === "active" && (
                  <div className="mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                          <span className="text-green-400 font-semibold">
                            Active
                          </span>
                        </div>
                        <p className="text-white font-medium mt-1">
                          {user.subscription.type}
                        </p>
                      </div>
                      <svg
                        className="w-8 h-8 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                )}

              {(!user?.subscription?.active ||
                user?.subscription?.status !== "active") && (
                <div className="mt-6 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                        <span className="text-gray-400 font-semibold">
                          No Active Plan
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        Upgrade to access premium content
                      </p>
                    </div>
                    <Link
                      href="/get-access"
                      className="px-4 py-2 bg-[#ff4040] hover:bg-red-600 text-white text-sm font-semibold rounded transition-colors"
                    >
                      Get Access
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Profile;

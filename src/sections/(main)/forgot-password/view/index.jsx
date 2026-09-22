"use client";
import IconNotView from "@/assets/icons/IconNotView";
import IconView from "@/assets/icons/Iconview";
import ErrorNotification from "@/components/global/alerts/ErrorNotification";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const Index = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const pin = searchParams.get("pin");

  const [formData, setFormData] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    email: false,
    password: false,
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const forgetPassword = async (e) => {
    e.preventDefault();
    let errors = {
      email: !formData?.email,
    };

    const hasErrors = Object.values(errors).some((error) => error);
    setError(errors);
    if (hasErrors) return;
    try {
      setButtonLoading(true);
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data && data.isOtpSend) {
        localStorage.setItem("email", formData.email);
        localStorage.setItem("otpExpiry", data.otpExpiry);
        if (pin == "true") {
          setTimeout(() => route.push("/verify-otp?pin=true"), 1000);
        } else {
          setTimeout(() => route.push("/verify-otp"), 1000);
        }
      } else {
        throw new Error(data.message || "Email Not Match");
      }
    } catch (error) {
      console.log("error", error);
      console.error(error);
      setError({ error: error.message });
    } finally {
      setButtonLoading(false);
    }
  };

  console.log("error state", error);
  return (
    <Flex justify={"center"} align={"center"} className="relative">
      <Image
        src="/assets/images/Backrouns_image.jpg"
        width={1920}
        unoptimized={true}
        height={1080}
        className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100 group-hover/banner:opacity-0"
        alt="Image"
      />
      <Box className="relative z-10 max-lg-mb:px-4 min-h-[calc(100vh-252px)] pt-[100px] w-full !flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg">
        <Box className="max-w-[450px] w-full py-10">
          <h4 className="text-white text-2xl font-medium text-center">
            Forgot Password
          </h4>
          <form className="relative mt-6 " onSubmit={forgetPassword}>
            <input
              type="text"
              required
              autoComplete="email"
              value={formData?.email || ""}
              onChange={(e) => {
                setError("");
                setFormData((prev) => ({ ...prev, email: e.target.value }));
              }}
              placeholder="Email address / Username"
              className="text-white px-2 hi text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
            />
            {error?.email && (
              <ErrorNotification text="This field is required." />
            )}
            {error?.error && <ErrorNotification text="Email Not Match." />}

            <button
              type={buttonLoading ? "button" : "submit"}
              className={`bg-[#ff4040] mt-5 uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black w-full
              ${buttonLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              Request Otp
            </button>
            <p className="text-sm text-white text-center mt-3">
              Return to{" "}
              <Link
                href="/login"
                className="font-bold text-custom-red hover:underline"
              >
                {" "}
                Sign In
              </Link>
            </p>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default Index;

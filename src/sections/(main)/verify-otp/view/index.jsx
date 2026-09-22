"use client";

import ErrorNotification from "@/components/global/alerts/ErrorNotification";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const Index = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const pin = searchParams.get("pin");

  const [formData, setFormData] = useState({});
  const [error, setError] = useState({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }

    const storedOtpExpiry = localStorage.getItem("otpExpiry");
    if (storedOtpExpiry) {
      const expiryTime = parseInt(storedOtpExpiry, 10);
      const remainingTime = Math.max(
        0,
        Math.floor((expiryTime - Date.now()) / 1000)
      );
      setTimeLeft(remainingTime);
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    let errors = {
      otp: !formData?.otp,
    };
    const hasErrors = Object.values(errors).some((error) => error);
    setError(errors);
    if (hasErrors) return;
    try {
      setButtonLoading(true);
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data = await response.json();
      if (response.ok) {
        const otpExpiry = data.otpExpiry;
        setTimeLeft(Math.floor((otpExpiry - Date.now()) / 1000));
        localStorage.removeItem("otpExpiry");
        if (pin == "true") {
          setTimeout(
            () => route.push(`/new-password?token=${data.token}&pin=true`),
            1000
          );
        } else {
          setTimeout(
            () => route.push(`/new-password?token=${data.token}`),
            1000
          );
        }
      } else {
        throw new Error(data.error || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error(error);
      setError({ error: error.message });
    } finally {
      setButtonLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData?.email }),
      });
      const data = await response.json();
      if (response.ok) {
        const otpExpiry = data.otpExpiry;
        setTimeLeft(Math.floor((otpExpiry - Date.now()) / 1000));
        setError({});
      } else {
        throw new Error(data.error || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error(error);
      setError({ error: error.message });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Flex justify={"center"} align={"center"} className="relative">
      <Image
        src="/assets/images/Backrouns_image.jpg"
        width={1920}
        unoptimized={true}
        height={1080}
        className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100 group-hover/banner:opacity-0"
        alt="Background Image"
      />
      <Box className="relative z-10 min-h-[calc(100vh-252px)] pt-[100px] w-full !flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg">
        <Box className="max-w-[450px] w-full py-10">
          <h4 className="text-white text-2xl font-medium text-center">
            Enter OTP
          </h4>
          <form className="relative mt-6" onSubmit={verifyOtp}>
            <input
              type="text"
              required
              value={formData?.otp || ""}
              onChange={(e) => {
                setError({});
                setFormData((prev) => ({ ...prev, otp: e.target.value }));
              }}
              placeholder="Enter OTP"
              className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
            />
            {error?.error && <ErrorNotification text={error.error} />}

            <button
              type={buttonLoading ? "button" : "submit"}
              className={`bg-[#ff4040] mt-5 uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black w-full
              ${buttonLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              Verify OTP
            </button>

            <div className="text-sm text-white text-center mt-4">
              {timeLeft > 0 ? (
                <p>Resend OTP in {formatTime(timeLeft)}</p>
              ) : (
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={resendLoading}
                  className={`bg-transparent underline text-white transition-all ${
                    resendLoading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  Resend OTP
                </button>
              )}
            </div>

            <p className="text-sm text-white text-center mt-3">
              Return to{" "}
              <Link
                href="/login"
                className="font-bold text-custom-red hover:underline"
              >
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

"use client";
import IconNotView from "@/assets/icons/IconNotView";
import IconView from "@/assets/icons/Iconview";
import ErrorNotification from "@/components/global/alerts/ErrorNotification";
import ToastError from "@/components/global/Toasts/ToastError";
import useAuth from "@/contexts/auth/AuthProvider";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Index = () => {
  const route = useRouter();
    const { setUser, setUserloggedIn } = useAuth();
  const [formData, setFormData] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    email: false,
    password: false,
    role: "admin",
  });
  const [buttonLoading, setButtonLoading] = useState(false);
  const userLogin = async (e) => {
    e.preventDefault();
    let errors = {
      email: !formData?.email,
      password: !formData?.password,
    };

    const hasErrors = Object.values(errors).some((error) => error);
    setError(errors);
    if (hasErrors) return;
    try {
      setButtonLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data) {
      
      }
      if (data.data.status === 200) {        
        setUserloggedIn(true);
        setUser(data.data.userExist)
        route.push("/dashboard");
      }   
      else if (data.data.status === 404) {
        setError({ general: data.data.error, active:true });
      } 
      else if (data.data.status === 403) {
        setError({ general: data.data.error, active:true });
      } 
      else {
        setError({ general: 'Something went wrong! Try Again later.', active:true });
      } 
    } catch (error) {
      console.error(error);
      setError({ general: error.message });
    } finally {
      setButtonLoading(false);
    }
  };
  return (
    <Flex justify={"center"} align={"center"} className="relative">
     {error?.active && <ToastError message={error?.general} active={error?.active}  setError={setError} />}
      <Image
        src="/assets/images/Backrouns_image.jpg"
        width={1920}
        height={1080}
        unoptimized={true}
        className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100 group-hover/banner:opacity-0"
        alt="Image"
      />
      <Box className="relative px-4 z-10 min-h-[calc(100vh-252px)] pt-[100px] w-full !flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg">
        <Box className="max-w-[450px] w-full py-10">
          <h4 className="text-white text-2xl font-medium text-center">
            Admin Login
          </h4>
          <form className="relative mt-6" onSubmit={userLogin}>
            <input
              type="email"
              required
              autoComplete="email"
              value={formData?.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value, role:'admin' }))
              }
              placeholder="Email address / Username"
              className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
            />
            {error?.email && (
              <ErrorNotification text="This field is required." />
            )}
            <div className=" mt-3 ">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="password"
                  value={formData?.password || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                      role:'admin' 
                    }))
                  }
                  placeholder="Password"
                  className="text-white text-sm px-2 leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 -translate-y-1/2 right-0"
                >
                  {showPassword ? (
                    <IconView stroke="#fff" className="w-5 h-5" />
                  ) : (
                    <IconNotView stroke="#fff" className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link
                  href="/forgot-password"
                  className="font-semibold text-sm text-custom-red hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            {error?.password && (
              <ErrorNotification text="This field is required." />
            )}
            <button
              type={buttonLoading ? "button" : "submit"}
              className={`bg-[#ff4040] mt-5 uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black w-full
              ${buttonLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              Sign In
            </button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default Index;

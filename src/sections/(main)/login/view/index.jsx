"use client";
import IconNotView from "@/assets/icons/IconNotView";
import IconView from "@/assets/icons/Iconview";
import ErrorNotification from "@/components/global/alerts/ErrorNotification";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import useAuth from "@/contexts/auth/AuthProvider";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCSRF } from "@/hooks/useCSRF";
import OTPInput from "react-otp-input";
import { GoogleLogin } from "@react-oauth/google";
import { signIn } from "next-auth/react";
import IconTwitterX from "@/assets/icons/IconTwitterX";

const Index = () => {
  const route = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser, userloggedIn } = useAuth();
  const {
    csrfToken,
    loading: csrfLoading,
    error: csrfError,
    isReady,
    getHeaders,
  } = useCSRF();
  const [formData, setFormData] = useState("");
  const [success, setSuccess] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordPin, setShowPasswordPin] = useState(false);
  const [error, setError] = useState({
    email: false,
    password: false,
    passwordPin: false,
  });
  const [enablePasswordField, setEnablePasswordField] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const userLogin = async (e) => {
    e.preventDefault();
    let errors = {
      email: !formData?.email,
      ...(enablePasswordField ? { password: !formData?.password } : {}),
      ...(!enablePasswordField ? { passwordPin: !formData?.passwordPin } : {}),
    };

    const hasErrors = Object.values(errors).some((error) => error);
    setError(errors);
    if (hasErrors) return;

    // Check CSRF token availability
    if (!isReady) {
      setError({ general: "Security token not ready. Please try again." });
      return;
    }
    try {
      setButtonLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("user data while login with pin/password -->", data);
        setUser(data);
      }
      if (data.email) {
        setSuccess({
          active: true,
          message: "Login Successfully!",
        });
        setTimeout(() => route.push("/"), 500);
      } else {
        throw new Error(data.error || "");
      }
    } catch (error) {
      setError({ general: error.message });
    } finally {
      setButtonLoading(false);
    }
  };

  // const userLogin = async (e) => {
  //   e.preventDefault();
  //   console.log("[Login] submit", { enablePasswordField, formData });
  //   let errors = {
  //     email: !formData?.email,
  //     ...(enablePasswordField ? { password: !formData?.password } : {}),
  //     ...(!enablePasswordField ? { passwordPin: !formData?.passwordPin } : {}),
  //   };

  //   const hasErrors = Object.values(errors).some((error) => error);
  //   setError(errors);
  //   if (hasErrors) return;

  //   // Check CSRF token availability
  //   if (!isReady) {
  //     setError({ general: "Security token not ready. Please try again." });
  //     return;
  //   }
  //   try {
  //     setButtonLoading(true);
  //     const response = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: getHeaders(),
  //       body: JSON.stringify(formData),
  //     });
  //     const data = await response.json();
  //     const userData = data?.email
  //       ? data
  //       : data?.data?.userExist || data?.data || data;
  //     console.log("[Login] api response", { ok: response.ok, data, userData });
  //     if (response.ok) {
  //       console.log("user data while login with pin/password -->", userData);
  //       setUser(userData);
  //     }
  //     if (userData?.email) {
  //       const next = searchParams.get("redirect");
  //       const activeSub =
  //         userData?.subscription?.status === "active" &&
  //         userData?.subscription?.cancelDate == null;
  //       console.log("[Login] success", {
  //         next,
  //         activeSub,
  //         role: userData?.role,
  //       });
  //       setSuccess({
  //         active: true,
  //         message: "Login Successfully!",
  //       });
  //       let dest = "/";
  //       if (userData?.role === "admin") dest = "/dashboard";
  //       else if (next === "/get-access")
  //         dest = activeSub ? "/subscription-dashboard" : "/get-access";
  //       console.log("[Login] redirecting", dest);
  //       setTimeout(() => window.location.assign(dest), 300);
  //     } else {
  //       throw new Error(userData?.error || "");
  //     }
  //   } catch (error) {
  //     console.error("[Login] error", error);
  //     setError({ general: error.message });
  //   } finally {
  //     setButtonLoading(false);
  //   }
  // };

  useEffect(() => {
    if (userloggedIn) {
      if (user?.role === "customer") {
        route.push("/");
      }
      if (user?.role === "admin") {
        route.push("/dashboard");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // useEffect(() => {
  //   if (userloggedIn) {
  //     const next = searchParams.get("redirect");
  //     const activeSub =
  //       user?.subscription?.status === "active" &&
  //       user?.subscription?.cancelDate == null;
  //     console.log("[Login] userloggedIn effect", {
  //       next,
  //       activeSub,
  //       role: user?.role,
  //     });
  //     if (user?.role === "admin") route.push("/dashboard");
  //     else if (next === "/get-access")
  //       route.push(activeSub ? "/subscription-dashboard" : "/get-access");
  //     else route.push("/");
  //   }
  // }, [user]);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch("/api/auth/oauth/google/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      console.log("Google login response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Google login failed");
      }

      // Save the user data in your context
      setUser(data);

      // show toast or success message
      setSuccess({
        active: true,
        message: "Google login successful!",
      });

      // Redirect based on role
      if (data.role === "admin") {
        route.push("/dashboard");
      } else {
        route.push("/");
      }
      // const next = searchParams.get("redirect");
      // const activeSub =
      //   data?.subscription?.status === "active" &&
      //   data?.subscription?.cancelDate == null;
      // console.log("[Login] google success", {
      //   next,
      //   activeSub,
      //   role: data?.role,
      // });
      // if (data.role === "admin") window.location.assign("/dashboard");
      // else if (next === "/get-access")
      //   window.location.assign(
      //     activeSub ? "/subscription-dashboard" : "/get-access"
      //   );
      // else window.location.assign("/");
    } catch (err) {
      console.error(err);
      setError({ active: true, message: err.message || "Google login failed" });
    }
  };

  return (
    <Flex justify={"center"} align={"center"} className="relative">
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
      <Image
        src="/assets/images/Backrouns_image.jpg"
        width={1920}
        unoptimized={true}
        height={1080}
        className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100 group-hover/banner:opacity-0"
        alt="Image"
      />
      <Box className="relative z-10 px-4 min-h-[calc(100vh-252px)] pt-[100px] w-full !flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg">
        <Box className="max-w-[450px] w-full py-10">
          <h4 className="text-white text-2xl font-medium text-center">Login</h4>
          <form className="relative mt-6" onSubmit={userLogin}>
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
              className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
            />
            {error?.email && (
              <ErrorNotification text="This field is required." />
            )}
            {!enablePasswordField && (
              <div className="relative mt-5 otp-wrapper-container">
                <label
                  htmlFor=""
                  className="text-white text-sm leading-5 flex items-center justify-between"
                >
                  Enter Pin
                  <button
                    type="button"
                    onClick={() => setShowPasswordPin((prev) => !prev)}
                    className=""
                  >
                    {showPasswordPin ? (
                      <IconView stroke="#fff" className="w-5 h-5" />
                    ) : (
                      <IconNotView stroke="#fff" className="w-5 h-5" />
                    )}
                  </button>
                </label>
                <OTPInput
                  value={formData.passwordPin}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, passwordPin: e }))
                  }
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                  inputType={showPasswordPin ? "text" : "password"}
                  renderInput={(props) => (
                    <input
                      {...props}
                      inputMode="numeric"
                      autoComplete="off"
                      pattern="[0-9]*"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                    />
                  )}
                />
                <div className="flex justify-end mt-1">
                  <Link
                    href="/forgot-password?pin=true"
                    className="font-semibold text-sm text-custom-red hover:underline"
                  >
                    Forgot PIN?
                  </Link>
                </div>
                {error?.passwordPin && (
                  <ErrorNotification text="This field is required." />
                )}
              </div>
            )}
            {enablePasswordField && (
              <div className=" mt-3 ">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="password"
                    value={formData?.password || ""}
                    onChange={(e) => {
                      setError("");
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));
                    }}
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
            )}
            {error?.general && <ErrorNotification text={error.general} />}
            {error?.password && (
              <ErrorNotification text="This field is required." />
            )}
            <div className="text-white opacity-50 text-sm leading-5 text-center my-8 flex items-center gap-2">
              <span className="border-t border-white flex-1"></span> Or{" "}
              <span className="border-t border-white flex-1"></span>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setEnablePasswordField((prev) => !prev)}
                className="text-white px-2 text-sm leading-5"
              >
                {enablePasswordField
                  ? "Login using PIN"
                  : "Login using password"}
              </button>
            </div>
            <button
              type={buttonLoading || !isReady ? "button" : "submit"}
              disabled={!isReady}
              className={`bg-[#ff4040] mt-8 uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
  transition-all duration-300 hover:bg-white hover:text-black w-full
              ${
                buttonLoading || !isReady
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              {csrfLoading
                ? "Loading security..."
                : csrfError
                ? "Security error"
                : buttonLoading
                ? "Signing in..."
                : "Sign In"}
            </button>
            <div className="text-white opacity-50 text-sm leading-5 text-center my-8 flex items-center gap-2">
              <span className="border-t border-white flex-1"></span> Or{" "}
              <span className="border-t border-white flex-1"></span>
            </div>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log("Credential from Google:", credentialResponse);
                handleGoogleResponse(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              useOneTap={false}
              auto_select={false}
              prompt="select_account"
            />
            {/* <button
              type="button"
              onClick={() => {
                window.location.href = "/api/auth/twitter/start";
              }}
              className="bg-white text-black w-full mt-4 py-2 rounded font-medium"
            >
              Continue with X (Twitter)
            </button> */}

            <button
              type="button"
              onClick={() => signIn("twitter")}
              // className="bg-white text-black w-full mt-4 py-2 rounded font-medium"
              className="relative bg-white text-black w-full mt-4 h-10 rounded font-medium border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
            >
              {/* Continue with X (Twitter) */}
              <span className="absolute left-3 inline-flex items-center">
                <IconTwitterX className="w-5 h-5" />
              </span>
              <span>Continue with X</span>
            </button>

            <p className="text-sm text-white text-center mt-3">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-custom-red hover:underline"
              >
                {" "}
                Sign Up
              </Link>
            </p>
          </form>
        </Box>
      </Box>
    </Flex>
  );
};

export default Index;

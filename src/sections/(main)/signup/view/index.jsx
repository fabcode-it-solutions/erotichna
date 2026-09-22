"use client";
import IconNotView from "@/assets/icons/IconNotView";
import IconView from "@/assets/icons/Iconview";
import ErrorNotification from "@/components/global/alerts/ErrorNotification";
import useAuth from "@/contexts/auth/AuthProvider";
import { subscribeNewsLetter } from "@/utils/subscribe-newsletter";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCSRF } from "@/hooks/useCSRF";
import OTPInput from "react-otp-input";
import { GoogleLogin } from "@react-oauth/google";
import { signIn } from "next-auth/react";
import IconTwitterX from "@/assets/icons/IconTwitterX";

const Index = () => {
  const route = useRouter();
  const { setUser } = useAuth();
  const {
    csrfToken,
    loading: csrfLoading,
    error: csrfError,
    isReady,
    getHeaders,
  } = useCSRF();
  const [formData, setFormData] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [error, setError] = useState({
    email: false,
    password: false,
  });
  const [buttonLoading, setButtonLoading] = useState(false);

  // Google sign up handler
  const handleGoogleResponse = async (response) => {
    try {
      const res = await fetch("/api/auth/oauth/google/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Google login failed");
      }
      setUser(data);
      if (data.role === "admin") {
        route.push("/dashboard");
      } else {
        route.push("/");
      }
    } catch (err) {
      setError({ active: true, message: err.message || "Google login failed" });
    }
  };

  const userLogin = async (e) => {
    e.preventDefault();
    let errors = {
      email: !formData?.email,
      password: !formData?.password,
      confirmPassword: !formData?.confirmPassword,
      username: !formData?.username,
    };
    if (
      formData?.password &&
      formData?.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Pins do not match";
    }
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
      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          ...formData,
          password: "",
          passPin: formData.password,
        }),
      });
      const data = await response.json();
      if (!data?.error) {
        // Subscribe to newsletter if checkbox is checked
        if (subscribeNewsletter && formData?.email) {
          await subscribeNewsLetter(formData?.email);
        }

        route.push("/login");
      } else {
      }
      if (response.ok) {
      } else {
        setError({ general: data.error });
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
      <Image
        src="/assets/images/Backrouns_image.jpg"
        width={1920}
        unoptimized={true}
        height={1080}
        className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100 group-hover/banner:opacity-0"
        alt="Background Image"
      />
      <Box className="relative z-10 max-lg-mb:px-4 min-h-[calc(100vh-252px)] pt-[100px] w-full !flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-lg">
        <Box className="max-w-[450px] w-full py-10">
          <h4 className="text-white text-2xl font-medium text-center">
            Create a account
          </h4>

          <form className="relative mt-6" onSubmit={userLogin}>
            <input
              type="text"
              required
              autoComplete="username"
              value={formData?.username || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="Username"
              className="text-white text-sm leading-5 border-b border-white py-4 bg-transparent w-full pr-6 outline-0"
            />
            {error?.username && (
              <ErrorNotification text="This field is required." />
            )}
            <input
              type="email"
              required
              autoComplete="email"
              value={formData?.email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Email address"
              className="text-white text-sm leading-5 border-b border-white  mt-3 py-4 bg-transparent w-full pr-6 outline-0"
            />
            {error?.email && (
              <ErrorNotification text="This field is required." />
            )}
            <div className="relative mt-5 otp-wrapper-container">
              <label
                htmlFor=""
                className="text-white text-sm leading-5 flex items-center justify-between"
              >
                Set Pin
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className=""
                >
                  {showPassword ? (
                    <IconView stroke="#fff" className="w-5 h-5" />
                  ) : (
                    <IconNotView stroke="#fff" className="w-5 h-5" />
                  )}
                </button>
              </label>
              <OTPInput
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e }))
                }
                numInputs={6}
                renderSeparator={<span>-</span>}
                inputType={showPassword ? "text" : "password"}
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
            </div>
            {error?.password && (
              <ErrorNotification text="This field is required." />
            )}
            <div className="relative mt-5 otp-wrapper-container">
              <label
                htmlFor=""
                className="text-white text-sm leading-5 flex items-center justify-between "
              >
                Confirm Pin
                <button
                  type="button"
                  onClick={() => setConfirmPassword((prev) => !prev)}
                  className=""
                >
                  {confirmPassword ? (
                    <IconView stroke="#fff" className="w-5 h-5" />
                  ) : (
                    <IconNotView stroke="#fff" className="w-5 h-5" />
                  )}
                </button>
              </label>
              <OTPInput
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: e }))
                }
                numInputs={6}
                renderSeparator={<span>-</span>}
                inputType={confirmPassword ? "text" : "password"}
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
            </div>

            {error?.confirmPassword && (
              <ErrorNotification
                text={error?.confirmPassword || "This field is required."}
              />
            )}

            <div className="flex items-center gap-3 mt-5">
              <input
                type="checkbox"
                id="newsletter"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="w-4 h-4 text-[#ff4040] bg-transparent border-white rounded focus:ring-[#ff4040] focus:ring-2"
              />
              <label htmlFor="newsletter" className="text-white text-sm">
                Subscribe to our newsletter for updates and exclusive content
              </label>
            </div>

            {error?.general && <ErrorNotification text={error?.general} />}
            <button
              type={buttonLoading || !isReady ? "button" : "submit"}
              disabled={!isReady}
              className={`bg-[#ff4040] mt-5 uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
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
                ? "Creating account"
                : "Create a account"}
            </button>
            <div className="text-white opacity-50 text-sm leading-5 text-center my-8 flex items-center gap-2">
              <span className="border-t border-white flex-1"></span> Or{" "}
              <span className="border-t border-white flex-1"></span>
            </div>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleGoogleResponse(credentialResponse);
              }}
              onError={() => {
                setError({ active: true, message: "Google login failed" });
              }}
              useOneTap={false}
              auto_select={false}
            />
            <button
              type="button"
              onClick={() => signIn("twitter")}
              className="relative bg-white text-black w-full mt-4 h-10 rounded font-medium border border-gray-300 hover:bg-gray-50 flex items-center justify-center"
            >
              <span className="absolute left-3 inline-flex items-center">
                <IconTwitterX className="w-5 h-5" />
              </span>
              <span>Continue with X</span>
            </button>
            <p className="text-sm text-white text-center mt-3">
              Already have account?{" "}
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

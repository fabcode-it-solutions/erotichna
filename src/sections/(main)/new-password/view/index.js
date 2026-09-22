"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Flex } from "@radix-ui/themes";
import Image from "next/image";
import OTPInput from "react-otp-input";
import ErrorNotification from "@/components/global/alerts/ErrorNotification";
import IconView from "@/assets/icons/Iconview";
import IconNotView from "@/assets/icons/IconNotView";

const NewPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pin = searchParams.get("pin");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    newPin: "",
    confirmPin: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState({
    error: "",
    success: false,
    loading: false,
  });

  // Extract token on mount
  useEffect(() => {
    const resetToken = new URLSearchParams(window.location.search).get("token");
    if (resetToken) setToken(resetToken);
    else setStatus((prev) => ({ ...prev, error: "Invalid token." }));
  }, []);

  const updateField = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const isPinFlow = pin === "true";

      const { newPassword, confirmPassword, newPin, confirmPin } = formData;

      // Validation
      if (!isPinFlow && (!newPassword || !confirmPassword))
        return setStatus({
          error: "Both password fields are required.",
          success: false,
          loading: false,
        });

      if (!isPinFlow && newPassword !== confirmPassword)
        return setStatus({
          error: "Passwords do not match.",
          success: false,
          loading: false,
        });

      if (isPinFlow && (!newPin || !confirmPin))
        return setStatus({
          error: "Both fields are required.",
          success: false,
          loading: false,
        });

      if (isPinFlow && newPin !== confirmPin)
        return setStatus({
          error: "PINs do not match.",
          success: false,
          loading: false,
        });

      // Submit
      setStatus({ error: "", success: false, loading: true });

      try {
        const res = await fetch("/api/auth/new-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            newPassword: !isPinFlow ? newPassword : "",
            newPin: isPinFlow ? newPin : "",
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error updating password.");

        setStatus({ error: "", success: true, loading: false });
        localStorage.removeItem("email");
        setTimeout(() => router.push("/login"), 2000);
      } catch (err) {
        setStatus({
          error: err.message || "An error occurred.",
          success: false,
          loading: false,
        });
      }
    },
    [formData, pin, token, router]
  );

  const renderOTPInput = (label, value, field, visible, toggleVisible) => (
    <div className="relative mt-5 otp-wrapper-container">
      <label className="text-white text-sm leading-5 flex items-center justify-between">
        {label}
        <button type="button" onClick={toggleVisible}>
          {visible ? (
            <IconView stroke="#fff" className="w-5 h-5" />
          ) : (
            <IconNotView stroke="#fff" className="w-5 h-5" />
          )}
        </button>
      </label>
      <OTPInput
        value={value}
        onChange={(e) => updateField(field, e)}
        numInputs={6}
        renderSeparator={<span>-</span>}
        inputType={visible ? "text" : "password"}
        renderInput={(props) => (
          <input
            {...props}
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]*"
            onInput={(e) => {
              const input = e.target;
              input.value = input.value.replace(/\D/g, "");
            }}
          />
        )}
      />
    </div>
  );

  const { error, success, loading } = status;
  const isPinFlow = pin === "true";

  return (
    <Flex justify="center" align="center" className="relative">
      <Image
        src="/assets/images/Backrouns_image.jpg"
        width={1920}
        height={1080}
        unoptimized
        alt="Background Image"
        className="w-full h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100"
      />

      <Box className="relative z-10 min-h-[calc(100vh-252px)] pt-[100px] w-full flex items-center justify-center bg-black/70 backdrop-blur-lg">
        <Box className="max-w-[450px] w-full py-10">
          <h1 className="text-white text-2xl font-medium text-center">
            {isPinFlow ? "Create New Pin" : "Create New Password"}
          </h1>

          {isPinFlow ? (
            <>
              {renderOTPInput(
                "Set new Pin",
                formData.newPin,
                "newPin",
                showPassword,
                () => setShowPassword((v) => !v)
              )}
              {renderOTPInput(
                "Confirm Pin",
                formData.confirmPin,
                "confirmPin",
                showConfirmPassword,
                () => setShowConfirmPassword((v) => !v)
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="relative mt-6">
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => updateField("newPassword", e.target.value)}
                placeholder="Enter new password"
                className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full outline-0"
                required
              />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                placeholder="Confirm new password"
                className="text-white px-2 text-sm leading-5 border-b border-white py-4 bg-transparent w-full outline-0 mt-4"
                required
              />
            </form>
          )}

          {error && <ErrorNotification text={error} />}
          {success && (
            <div className="text-green-500 mt-4">
              {isPinFlow
                ? "PIN updated successfully!"
                : "Password updated successfully!"}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className={`bg-[#ff4040] mt-5 uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px] transition-all duration-300 hover:bg-white hover:text-black w-full ${
              loading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {loading
              ? "Updating..."
              : isPinFlow
              ? "Create New Pin"
              : "Create New Password"}
          </button>
        </Box>
      </Box>
    </Flex>
  );
};

export default NewPassword;

"use client";
import useAuth from "@/contexts/auth/AuthProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import OTPInput from "react-otp-input";
import ErrorNotification from "@/components/global/alerts/ErrorNotification";
import IconView from "@/assets/icons/Iconview";
import IconNotView from "@/assets/icons/IconNotView";
import { changePin } from "@/actions/changePin";

const SetPasswordPin = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [showPopup, setShowPopUp] = useState(false);

  const [formData, setFormData] = useState({
    newPin: "",
    confirmPin: "",
  });

  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [status, setStatus] = useState({
    error: "",
    success: false,
    loading: false,
  });
  const isPinModalExpired = () => {
    const stored = localStorage.getItem("pinmodalerotic");
    if (!stored) return true;
    return new Date(stored) < new Date();
  };

  // Show popup if user has no PIN yet
  useEffect(() => {
    const isPinModalExp = isPinModalExpired();
    if (
      user &&
      !user.error &&
      isPinModalExp &&
      (user.passwordPin === "false" || !user.passwordPin)
    ) {
      setShowPopUp(true);
    } else {
      setShowPopUp(false);
    }
  }, [user]);

  const updateField = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = useCallback(async () => {
    const { newPin, confirmPin } = formData;

    if (!newPin || !confirmPin)
      return setStatus({
        error: "Both fields are required.",
        success: false,
        loading: false,
      });

    if (newPin !== confirmPin)
      return setStatus({
        error: "PINs do not match.",
        success: false,
        loading: false,
      });

    setStatus({ error: "", success: false, loading: true });

    try {
      changePin(user.email, newPin);
      setStatus({ error: "", success: true, loading: false });

      // Optional: reload or redirect after success
      setTimeout(() => {
        setShowPopUp(false);
        router.refresh();
      }, 2000);
    } catch (err) {
      setStatus({
        error: err.message || "An error occurred while updating the PIN.",
        success: false,
        loading: false,
      });
    }
  }, [formData, user, router]);

  const { error, success, loading } = status;
  const setTimeInterval = useCallback(() => {
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7); // add 7 days
    localStorage.setItem("pinmodalerotic", expireAt.toISOString());
    setShowPopUp(false);
  }, [setShowPopUp]);
  if (!showPopup) return null;

  return (
    <div className="w-full h-full p-4 flex items-center justify-center fixed top-0 left-0 bg-black bg-opacity-50 backdrop-blur-lg z-[99999999999999999999]">
      <div className="max-w-[560px] w-full">
        {/* Header */}
        <div className="text-center rounded-t-lg overflow-hidden py-4 bg-[#f5cac8]">
          <Image
            src="/assets/images/erotichna-logo-bg.svg"
            alt="Logo"
            width={213}
            height={35}
            unoptimized
            className="w-full max-w-[300px] mx-auto"
          />
        </div>

        {/* Body */}
        <div className="bg-dark-150 p-5 rounded-b-lg border-black">
          <div className="text-white text-2xl text-center font-bodoni mb-4 max-lg-mb:text-lg">
            Login Just Got Easier!
          </div>

          <p className="text-white text-sm text-center font-satoshi max-lg-mb:text-xs">
            Say goodbye to typing long passwords — you can now log in using a
            PIN. It’s quick, simple, and secure.
          </p>

          <div className="text-white text-xl text-center font-bodoni my-4 max-lg-mb:text-lg">
            Set up your new PIN
          </div>

          {/* PIN Inputs */}
          <div className="relative mt-5 otp-wrapper-container">
            <label className="text-white text-sm leading-5 flex items-center justify-between">
              New PIN
              <button type="button" onClick={() => setShowPin((v) => !v)}>
                {showPin ? (
                  <IconView stroke="#fff" className="w-5 h-5" />
                ) : (
                  <IconNotView stroke="#fff" className="w-5 h-5" />
                )}
              </button>
            </label>
            <OTPInput
              value={formData.newPin}
              onChange={(e) => updateField("newPin", e)}
              numInputs={6}
              renderSeparator={<span>-</span>}
              inputType={showPin ? "text" : "password"}
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

          <div className="relative mt-5 otp-wrapper-container">
            <label className="text-white text-sm leading-5 flex items-center justify-between">
              Confirm PIN
              <button
                type="button"
                onClick={() => setShowConfirmPin((v) => !v)}
              >
                {showConfirmPin ? (
                  <IconView stroke="#fff" className="w-5 h-5" />
                ) : (
                  <IconNotView stroke="#fff" className="w-5 h-5" />
                )}
              </button>
            </label>
            <OTPInput
              value={formData.confirmPin}
              onChange={(e) => updateField("confirmPin", e)}
              numInputs={6}
              renderSeparator={<span>-</span>}
              inputType={showConfirmPin ? "text" : "password"}
              renderInput={(props) => (
                <input
                  {...props}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  onInput={(e) => {
                    const input = e.target;
                    input.value = input.value.replace(/\D/g, "");
                  }}
                />
              )}
            />
          </div>

          {/* Error & Success Messages */}
          {error && <ErrorNotification text={error} />}
          {success && (
            <div className="text-green-500 mt-4 text-center">
              PIN created successfully!
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 justify-center mt-6 max-w-[480px] mx-auto">
            <button
              onClick={setTimeInterval}
              type="button"
              className="flex-1 cursor-pointer uppercase border border-white flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
              transition-all duration-300 hover:bg-white hover:text-black tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5 max-sm-tab:px-4"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              type="button"
              className={`bg-[#ff4040] cursor-pointer flex-1 uppercase flex items-center justify-center text-white text-base font-medium px-10 py-1 min-h-[48px]
              transition-all duration-300 hover:bg-white hover:text-black tab-lg:px-5 tab-lg:text-sm tab-lg:py-1.5 max-sm-tab:px-4 ${
                loading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {loading ? "Saving..." : "Save PIN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordPin;

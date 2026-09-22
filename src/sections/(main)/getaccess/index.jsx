"use client";
import React, { useEffect, useState } from "react";
import model from "../../../../public/assets/images/model-get-access.jpg";
import Image from "next/image";
import onlyfans from "../../../../public/assets/images/onlyfans.webp";
import sheer from "../../../../public/assets/images/sheer.webp";
import IconRight from "@/assets/icons/IconRight";
import Link from "next/link";
import TopVideo from "@/sections/TopVideo";
import useTheme from "@/contexts/theme/ThemeProvider";
import useAuth from "@/contexts/auth/AuthProvider";
import { plans } from "@/assets/data/subscriptions";
import Modal from "@/components/ui/Modal";
import { useCSRF } from "@/hooks/useCSRF";

const Index = () => {
  const { user } = useAuth();
  const { isReady, getHeaders } = useCSRF();
  const [selectedPlatform, setSelectedPlatform] = useState(0);
  const [selectedPlan, selectPlan] = useState("monthly-recurring");
  // const [paymentModel, setPaymentModel] = useState(false); // No longer needed - using YourSafe
  const [paymentForm, setPaymentForm] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const { latestVideosData } = useTheme();
  const [allposts, setAllPosts] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  useEffect(() => {
    selectPlan(user?.subscription?.planId || "monthly-recurring");
    setPaymentForm((prev) => ({ ...prev, email: user?.email }));

    // Check for payment status in URL params
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paymentParam = params.get("payment");
      const planParam = params.get("plan");

      if (paymentParam === "success") {
        setPaymentStatus("success");
        setSuccess({
          message: `Your subscription for ${
            planParam || "the selected plan"
          } has been activated successfully!`,
          status: true,
        });
        // Clear the pending subscription from localStorage
        localStorage.removeItem("pendingSubscription");
        // Clean up URL
        window.history.replaceState({}, document.title, "/get-access");
        // Refresh videos
        getVideos();
      } else if (paymentParam === "declined") {
        setPaymentStatus("declined");
        setModalState({
          isOpen: true,
          type: "error",
          title: "Payment Declined",
          message: "Payment was declined or cancelled. Please try again.",
          showActions: false,
        });
        // Clean up URL
        window.history.replaceState({}, document.title, "/get-access");
      }
    }
  }, [user]);
  const getVideos = async () => {
    try {
      const response = await fetch(
        `/api/admin/post?limit=6&skip=0&status=published&card=customer&categories=00`
      );
      const data = await response.json();
      if (!data?.error) {
        setAllPosts(data.data);
      }
    } catch (error) {
      setAllPosts([]);
    }
  };
  // Payment modal no longer needed - using YourSafe hosted checkout
  // const openPaymentPopup = () => {
  //   setPaymentModel(true);
  //   document.body.style.overflow = "hidden";
  // };
  // const handleClosePopup = () => {
  //   setPaymentModel(false);
  //   document.body.style.overflow = "";
  // };
  const data = [
    {
      name: "OnlyFans",
      Price: "29.90",
      time: "Month",
      link: "https://onlyfans.com/erotichna",
      img: onlyfans,
    },
    {
      name: "Sheer",
      Price: 29.27,
      link: "https://www.sheer.com/erotichna",
      time: "Month",
      img: sheer,
    },
  ];
  // Prices are now handled in the YourSafe integration
  const totalPrice = {
    "2 Day Trial": "$1.00",
    "30 Day Full Access": "$29.95",
    "90 Day Full Access": "$59.95",
    "180 Day Full Access": "$99.95",
  };

  const renderPlatformDetails = () => {
    switch (selectedPlatform) {
      case 0:
        return (
          <Link
            target="_blank"
            href={data[0].link || "#"}
            className="text-white block bg-[#3f3f3f] pt-[20px]"
          >
            <div className="flex justify-center ">
              <Image
                width={700}
                height={900}
                unoptimized={true}
                src={data[0].img.src?.replace(
                  "https://storage.bunnycdn.com/assets-erotichna",
                  "https://files-erotichna.b-cdn.net"
                )}
                alt="banner"
                className="w-[30%] auto pb-[30px] "
              />
            </div>
            <div className="flex flex-col py-[20px] items-center justify-center bg-red-500 text-white">
              <p className="">
                ${data[0].Price} / {data[0].time} Membership
              </p>
              <p className="uppercase">all videos</p>
            </div>
          </Link>
        );
      case 1:
        return (
          <Link
            target="_blank"
            href={data[1].link || "#"}
            className="text-white block bg-[#3f3f3f] pt-[20px]"
          >
            <div className="flex justify-center">
              <Image
                width={700}
                height={900}
                unoptimized={true}
                src={data[1].img.src?.replace(
                  "https://storage.bunnycdn.com/assets-erotichna",
                  "https://files-erotichna.b-cdn.net"
                )}
                alt="banner"
                className="w-[30%] h-auto pb-[30px] "
              />
            </div>
            <div className="flex flex-col py-[20px] items-center justify-center bg-red-500 text-white">
              <p className="">
                ${data[1].Price} / {data[1].time} Membership
              </p>
              <p className="uppercase">all videos</p>
            </div>
          </Link>
        );
      default:
        return null;
    }
  };
  // Card validation functions no longer needed - handled by YourSafe
  // function formatDate(input) { ... }
  // function formatCardNumber(input) { ... }
  // const validateForm = () => { ... };

  const startCheckout = async () => {
    // Check if user is logged in
    if (!user || !user.userID) {
      setModalState({
        isOpen: true,
        type: "warning",
        title: "Account Required",
        message:
          "Please create or login to your account to continue with your subscription.",
        showActions: true,
      });
      return;
    }

    // Check if user already has the same plan
    if (
      user?.subscription?.planId === selectedPlan &&
      user?.subscription?.status === "active" &&
      user?.subscription?.cancelDate == null
    ) {
      setModalState({
        isOpen: true,
        type: "info",
        title: "Active Subscription",
        message: "You already have an active subscription for this plan.",
        showActions: false,
      });
      return;
    }

    // Check CSRF token availability
    if (!isReady) {
      setModalState({
        isOpen: true,
        type: "warning",
        title: "Security Check",
        message: "Security token not ready. Please try again in a moment.",
        showActions: false,
      });
      return;
    }

    setBtnLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/subscribe/startorder", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          planId: selectedPlan,
          userId: user.userID || user._id,
          email: user.email,
          userName: user.name || user.username,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Store the reference ID for tracking
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "pendingSubscription",
            JSON.stringify({
              referenceID: data.referenceID,
              planId: data.planId,
              planName: data.planName,
              timestamp: Date.now(),
            })
          );
        }

        // Redirect to YourSafe payment gateway
        window.location.assign(data.url);
      } else {
        setModalState({
          isOpen: true,
          type: "error",
          title: "Checkout Failed",
          message:
            data.error || "Failed to initiate checkout. Please try again.",
          showActions: false,
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setModalState({
        isOpen: true,
        type: "error",
        title: "Network Error",
        message: "Network error. Please check your connection and try again.",
        showActions: false,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: "info", title: "", message: "" });
  };

  const handleLoginRedirect = () => {
    closeModal();
    window.location.href = "/sign-up";
  };

  // Form submission handled by YourSafe checkout
  // const submitForm = async (e) => { ... };
  return success ? (
    <div className="pt-[100px] bg-black  max-lg-mb:px-4">
      <h1 className="text-white text-3xl text-center font-gambetta font-medium my-4">
        Your subscription is now active!
      </h1>
      <h2 className="text-white text-xl text-center font-gambetta font-medium my-4">
        Start Watching Now!
      </h2>
      <p className="text-white text-base leading-6 text-center ">
        You now have unlimited access to all our premium videos.
      </p>
      <div className="flex gap-2 max-w-[480px] px-2 justify-center mx-auto mb-5">
        <Link
          href="/"
          className="uppercase w-full py-4 mt-[40px] gap-1 text-white bg-red-500 hover:bg-white hover:text-black flex items-center justify-center group"
        >
          <div className="">Go to Homepage</div>
          <div>
            <IconRight className={"fill-white group-hover:fill-black"} />
          </div>
        </Link>
        <Link
          href="/videos"
          className="uppercase w-full py-4 mt-[40px] hover:border-white gap-1 text-white border-2 border-red-500 hover:bg-white hover:text-black flex items-center justify-center group"
        >
          <div className="">Watch All Videos</div>
          <div>
            <IconRight className={"fill-white group-hover:fill-black"} />
          </div>
        </Link>
      </div>
      {allposts.length > 0 && (
        <TopVideo
          showAllVideoButton={false}
          title={latestVideosData?.latestVideos?.title}
          videos={allposts}
          showAllVideo={latestVideosData?.latestVideos}
        />
      )}
    </div>
  ) : (
    <div className="pt-[100px] bg-black flex justify-center items-center  max-lg-mb:px-4">
      <h1 className="hidden">Get Access</h1>
      <div className="flex flex-col sm:flex-row border-2 border-white w-full max-w-7xl">
        {/* Image Section */}
        <div className="flex-1 relative  ">
          <Image
            src={model}
            unoptimized={true}
            alt="model"
            width={700}
            height={900}
            className="h-full w-full
                    max-lg-mb:h-[100vw] max-lg-mb:static
                    object-cover absolute top-0 left-0"
          />
        </div>
        {/* Platform Section */}
        <div className="flex-1 text-white py-6 sm:py-0">
          <div className="uppercase text-center text-4xl get-access-title py-[50px] max-lg-mb:py-2">
            <Image
              src={"/assets/images/erotichna-logo-bg.svg"}
              alt="model"
              width={250}
              unoptimized={true}
              height={39}
              className="block mx-auto"
            />
          </div>
          <div className="px-10 py-6">
            <div className="flex flex-col gap-4">
              {plans &&
                plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => selectPlan(plan.id)}
                    className={`relative p-6 border-2 cursor-pointer transition-all duration-300 rounded-lg ${
                      user?.subscription?.planId === plan.id
                        ? "border-green-500 bg-green-500/10"
                        : selectedPlan === plan.id
                        ? "border-red-500 bg-red-500/10"
                        : "border-gray-600 bg-gray-800/50 hover:border-red-400"
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.tag && (
                      <div className="absolute -top-3 left-4">
                        <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                          {plan.tag}
                        </span>
                      </div>
                    )}

                    {/* Current Plan Badge */}
                    {user?.subscription?.planId === plan.id && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-green-500 text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl mb-2">
                          {plan.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {plan.description}
                        </p>

                        {/* Features List */}
                        <ul className="text-gray-300 text-sm space-y-1">
                          {plan.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-green-400">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        {plan.savings && (
                          <div className="mt-3">
                            <span className="text-green-400 text-sm font-medium">
                              {plan.savings}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-6">
                        <div className="text-white font-bold text-2xl">
                          {plan.price}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {plan.billing}
                        </div>
                        {plan.type === "recurring" && (
                          <div className="text-green-400 text-xs mt-1">
                            Auto-renews
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className="absolute top-4 right-4 hidden">
                      <div
                        className={`w-5 h-5 rounded-full border-2 ${
                          selectedPlan === plan.id
                            ? "border-red-500 bg-red-500"
                            : "border-gray-500"
                        }`}
                      >
                        {selectedPlan === plan.id && (
                          <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <button
              onClick={() => startCheckout()}
              disabled={btnLoading || !isReady}
              className={`uppercase w-full py-4 mt-[40px] gap-1 text-white bg-red-500 hover:bg-white hover:text-black flex items-center justify-center group ${
                btnLoading || !isReady ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="">
                {!isReady
                  ? "Loading security..."
                  : btnLoading
                  ? "Processing..."
                  : "Continue to Payment"}
              </div>
              {!btnLoading && (
                <div>
                  <IconRight className={"fill-white group-hover:fill-black"} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        actions={
          modalState.showActions ? (
            <>
              <button
                onClick={closeModal}
                className="px-6 py-3 border border-gray-600 hover:border-gray-500 text-white font-semibold rounded-lg transition-colors font-satoshi"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginRedirect}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors font-satoshi"
              >
                Go to Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={closeModal}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors font-satoshi"
            >
              OK
            </button>
          )
        }
      />
    </div>
  );
};

export default Index;

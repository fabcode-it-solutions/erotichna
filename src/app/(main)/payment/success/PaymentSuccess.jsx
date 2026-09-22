"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import useAuth from "@/contexts/auth/AuthProvider";
import IconRight from "@/assets/icons/IconRight";

const PaymentSuccess = () => {
  const { user } = useAuth();
  console.log("user in payment success -->", user);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);

  // Get parameters from URL
  const saleID = searchParams.get("saleID");
  const referenceID = searchParams.get("referenceID");
  const planTitle = searchParams.get("plan");

  useEffect(() => {
    // Check subscription status to confirm activation
    const checkSubscriptionStatus = async () => {
      if (user?.userID || user?._id) {
        try {
          const userId = user?.userID || user?._id;
          const email = user?.email;
          const response = await fetch(
            `/api/subscribe/status?userId=${userId}`
          );
          const data = await response.json();

          if (response.ok && data.subscription) {
            setSubscriptionDetails(data.subscription);
          }

          // Clear checkout status first
          try {
            await fetch("/api/subscribe/clear-checkout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            });
          } catch (e) {
            console.error("Failed to clear checkout status:", e);
          }
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      }
      setLoading(false);
    };

    checkSubscriptionStatus();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="bg-black pt-20">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-[#ff4040] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Logo */}
            <Image
              src="/assets/images/erotichna-logo-bg.svg"
              alt="Erotichna Logo"
              width={250}
              height={39}
              unoptimized={true}
              className="block mx-auto mb-6"
            />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Payment Successful! 🎉
          </h1>

          <div className="bg-gray-900/50 p-8 rounded-lg border border-[#ff4040]/30 mb-8">
            <h2 className="text-2xl font-bold text-[#ff4040] mb-4">
              Welcome to Premium Access!
            </h2>

            <p className="text-lg text-gray-300 mb-6">
              Your subscription has been activated successfully. You now have
              unlimited access to all our premium content.
            </p>

            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-3 text-left max-w-md mx-auto">
                {planTitle && (
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Plan:</span>
                    <span className="text-white font-medium">{planTitle}</span>
                  </div>
                )}

                {saleID && (
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="text-white text-sm">{saleID}</span>
                  </div>
                )}

                {subscriptionDetails?.startDate && (
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Started:</span>
                    <span className="text-white">
                      {formatDate(subscriptionDetails.startDate)}
                    </span>
                  </div>
                )}

                {subscriptionDetails?.nextChargeDate && (
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Next Billing:</span>
                    <span className="text-white">
                      {formatDate(subscriptionDetails.nextChargeDate)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-[#ff4040] font-medium">Active</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/videos"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#ff4040] hover:bg-red-600 text-white font-semibold rounded-lg transition-colors group"
            >
              <span>Start Watching Now</span>
              <IconRight className="ml-2 fill-white group-hover:fill-white" />
            </Link>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-colors"
            >
              View Subscription Details
            </Link>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-white mb-3">
              Important Information:
            </h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>
                • Your subscription will automatically renew unless cancelled
              </li>
              <li>
                • You can manage your subscription anytime in your profile
              </li>
              <li>• All premium content is now unlocked for your account</li>
              <li>
                • You will receive email confirmations for all transactions
              </li>
            </ul>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <Link
                href="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="hover:text-white transition-colors"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/contact"
                className="hover:text-white transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;

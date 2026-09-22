"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import IconRight from "@/assets/icons/IconRight";

const PaymentDeclined = () => {
  const searchParams = useSearchParams();
  const [reason, setReason] = useState("");

  // Get parameters from URL
  const errorCode = searchParams.get("errorCode");
  const errorMessage = searchParams.get("errorMessage");
  const referenceID = searchParams.get("referenceID");

  useEffect(() => {
    const getDeclineReason = (code) => {
      const reasons = {
        "001": "Insufficient funds in your account",
        "002": "Card declined by issuing bank",
        "003": "Expired card",
        "004": "Invalid card number",
        "005": "Invalid security code (CVV)",
        "006": "Transaction limit exceeded",
        "007": "Suspected fraud - contact your bank",
        "008": "Card not authorized for online transactions",
      };
      return reasons[code] || "Transaction declined by your bank";
    };

    if (errorCode) {
      setReason(getDeclineReason(errorCode));
    } else if (errorMessage) {
      setReason(errorMessage);
    } else {
      setReason(
        "Your payment was declined. Please try again with a different payment method."
      );
    }
  }, [errorCode, errorMessage]);

  const commonReasons = [
    {
      title: "Insufficient Funds",
      description:
        "Your account doesn't have enough money for this transaction",
      solution: "Check your balance or use a different card",
    },
    {
      title: "Card Declined",
      description: "Your bank declined the transaction for security reasons",
      solution: "Contact your bank or try a different payment method",
    },
    {
      title: "Expired Card",
      description: "The card you're using has expired",
      solution: "Use a current, valid credit or debit card",
    },
    {
      title: "Incorrect Details",
      description: "The card information entered was incorrect",
      solution: "Double-check your card number, expiry date, and CVV",
    },
  ];

  return (
    <section className="bg-black pt-20">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
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
                  d="M6 18L18 6M6 6l12 12"
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

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Payment Declined
          </h1>

          <div className="bg-gray-900/50 p-8 rounded-lg border border-red-500/30 mb-8">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              Transaction Not Completed
            </h2>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-white">{reason}</p>
              {errorCode && (
                <p className="text-gray-400 text-sm mt-2">
                  Error Code: {errorCode}
                </p>
              )}
              {referenceID && (
                <p className="text-gray-400 text-sm mt-1">
                  Reference: {referenceID}
                </p>
              )}
            </div>

            <p className="text-gray-300 mb-6">
              Don&apos;t worry! This happens sometimes. Please try again with a
              different payment method or contact your bank if the problem
              persists.
            </p>
          </div>

          {/* Common Reasons */}
          <div className="bg-gray-900/30 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Common Reasons for Declined Payments
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {commonReasons.map((item, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold text-red-400 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-300 text-sm mb-2">
                    {item.description}
                  </p>
                  <p className="text-blue-400 text-sm font-medium">
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/get-access"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#ff4040] hover:bg-red-600 text-white font-semibold rounded-lg transition-colors group"
            >
              <span>Try Again</span>
              <IconRight className="ml-2 fill-white group-hover:fill-white" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Support
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-gray-900/30 border border-blue-500/30 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">
              Need Help?
            </h3>
            <div className="text-gray-300 space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>
                  Contact your bank to ensure your card allows online purchases
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>Try using a different credit or debit card</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>
                  Ensure your billing address matches your card details
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>Check that your card hasn&apos;t expired</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400">•</span>
                <span>
                  Contact our support team if you continue to experience issues
                </span>
              </div>
            </div>
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

export default PaymentDeclined;

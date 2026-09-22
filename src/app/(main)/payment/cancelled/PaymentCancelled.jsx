"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import IconRight from "@/assets/icons/IconRight";

const PaymentCancelled = () => {
  const searchParams = useSearchParams();

  // Get parameters from URL
  const referenceID = searchParams.get("referenceID");
  const planTitle = searchParams.get("plan");

  return (
    <section className="bg-black pt-20">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {/* Cancel Icon */}
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
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

          {/* Cancel Message */}
          <h1 className="text-4xl font-bold text-white mb-4">
            Payment Cancelled
          </h1>

          <div className="bg-gray-900/50 p-8 rounded-lg border border-yellow-500/30 mb-8">
            <h2 className="text-2xl font-bold text-[#ff4040] mb-4">
              Transaction Cancelled
            </h2>

            <p className="text-lg text-gray-300 mb-6">
              You have cancelled the payment process. No charges have been made
              to your account.
            </p>

            {planTitle && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-white">
                  <span className="text-gray-400">Cancelled Plan:</span>{" "}
                  <span className="font-medium">{planTitle}</span>
                </p>
                {referenceID && (
                  <p className="text-gray-400 text-sm mt-2">
                    Reference: {referenceID}
                  </p>
                )}
              </div>
            )}

            <p className="text-gray-300">
              If you changed your mind, you can always return to complete your
              subscription purchase.
            </p>
          </div>

          {/* Common Questions */}
          <div className="bg-gray-900/30 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Common Questions
            </h3>

            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">
                  Is my payment information secure?
                </h4>
                <p className="text-gray-300 text-sm">
                  Yes! We use industry-standard encryption and trusted payment
                  processors. Your card details are never stored on our servers.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">
                  Can I cancel my subscription anytime?
                </h4>
                <p className="text-gray-300 text-sm">
                  Absolutely! You can cancel your subscription at any time from
                  your profile page. You&apos;ll continue to have access until
                  the end of your billing period.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">
                  What payment methods do you accept?
                </h4>
                <p className="text-gray-300 text-sm">
                  We accept all major credit cards (Visa, Mastercard, American
                  Express) and many debit cards through our secure payment
                  gateway.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-400 mb-2">
                  Do you offer refunds?
                </h4>
                <p className="text-gray-300 text-sm">
                  We offer refunds within 7 days of purchase if you&apos;re not
                  satisfied. Contact our support team for assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/get-access"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#ff4040] hover:bg-red-600 text-white font-semibold rounded-lg transition-colors group"
            >
              <span>Complete Purchase</span>
              <IconRight className="ml-2 fill-white group-hover:fill-white" />
            </Link>

            <Link
              href="/videos"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 hover:border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Free Content
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/10 text-white font-semibold rounded-lg transition-colors"
            >
              Contact Support
            </Link>
          </div>

          {/* Benefits Reminder */}
          <div className="bg-gray-900/30 border border-[#ff4040]/30 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-[#ff4040] mb-3">
              What You&apos;re Missing:
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-gray-300 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-[#ff4040]">✓</span>
                <span>Unlimited access to all premium videos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#ff4040]">✓</span>
                <span>HD and 4K video quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#ff4040]">✓</span>
                <span>Exclusive model content</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#ff4040]">✓</span>
                <span>Ad-free experience</span>
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

export default PaymentCancelled;

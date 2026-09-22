import React from "react";

const CancelConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  subscription,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-400"
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
          <h3 className="text-xl font-bold text-white mb-4">
            Cancel Subscription?
          </h3>
          <p className="text-gray-300 mb-8">
            {subscription?.subscriptionType === "recurring"
              ? "Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period."
              : "This is a one-time payment plan and cannot be cancelled. Your access will expire on the scheduled date."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-600 hover:border-gray-500 text-white font-semibold rounded-lg transition-colors"
              disabled={isLoading}
            >
              Keep Subscription
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Yes, Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmationModal;

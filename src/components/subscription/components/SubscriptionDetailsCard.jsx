import React from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import DataRow from "./DataRow";

const SubscriptionDetailsCard = ({
  subscription,
  planDetails,
  isActive,
  formatDate,
  onCancelClick,
}) => {
  return (
    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white">Subscription Details</h2>
        <StatusBadge
          status={subscription.status}
          active={subscription.active}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-1">
          <DataRow
            label="Plan"
            value={subscription.type || subscription.planName}
          />
          <DataRow
            label="Started"
            value={formatDate(subscription.startDate || subscription.createdAt)}
          />
          {subscription.subscriptionType === "recurring" &&
            subscription.status === "active" &&
            subscription.cancelDate == null && (
              <DataRow
                label="Next Renewal"
                value={formatDate(
                  subscription.nextChargeDate || subscription.expiryDate
                )}
              />
            )}
          {subscription.subscriptionType === "onetime" && (
            <DataRow
              label="Expires On"
              value={formatDate(subscription.expiryDate)}
            />
          )}
          {subscription.status === "pending_cancellation" && (
            <DataRow
              label="Access Until"
              value={formatDate(subscription.expiryDate)}
              className="text-yellow-400"
            />
          )}
          {subscription.daysRemaining > 0 && (
            <DataRow
              label="Days Remaining"
              value={`${subscription.daysRemaining} days`}
              className={
                subscription.daysRemaining < 7 ? "text-yellow-400" : ""
              }
            />
          )}
          {subscription.cancelDate && (
            <DataRow
              label="Cancelled On"
              value={formatDate(subscription.cancelDate)}
            />
          )}
        </div>

        {/* Right Column - Plan Features */}
        {planDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Plan Features</h3>
            <div className="space-y-2">
              {planDetails.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-gray-300"
                >
                  <svg
                    className="w-4 h-4 text-green-400 mr-3 flex-shrink-0"
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
                  {feature}
                </div>
              ))}
            </div>
            {planDetails.savings && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-green-400 font-medium text-sm">
                  {planDetails.savings}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-700">
        {isActive &&
          subscription.subscriptionType === "recurring" &&
          subscription.cancelDate == null && (
            <button
              onClick={onCancelClick}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel Subscription
            </button>
          )}

        {(subscription.status === "cancelled" ||
          subscription.status === "expired") && (
          <Link
            href="/get-access"
            className="px-6 py-3 bg-[#ff4040] hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
          >
            Renew Subscription
          </Link>
        )}

        <Link
          href="/videos"
          className="px-6 py-3 border border-gray-600 hover:border-white hover:bg-white/5 text-white font-semibold rounded-lg transition-colors"
        >
          Browse Content
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionDetailsCard;

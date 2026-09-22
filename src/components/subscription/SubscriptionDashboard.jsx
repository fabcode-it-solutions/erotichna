"use client";
import React, { useState, useEffect } from "react";
import useAuth from "@/contexts/auth/AuthProvider";
import { plans } from "@/assets/data/subscriptions";
import {
  Notification,
  LoadingCard,
  ErrorCard,
  PaymentHistoryCard,
  CancelConfirmationModal,
  NoSubscriptionCard,
  SubscriptionDetailsCard,
} from "./components";

const SubscriptionDashboard = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [paymentHistoryData, setPaymentHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user?.userID || user?._id) {
      Promise.all([checkSubscriptionStatus(), fetchPaymentHistory()]);
    }
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = user?.userID || user?._id;
      const response = await fetch(`/api/subscribe/status?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setSubscription(data.subscription);
      } else {
        setError(data.error || "Failed to load subscription details");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async (page = 1) => {
    try {
      setHistoryLoading(true);
      const userId = user?.userID || user?._id;
      const response = await fetch(
        `/api/subscribe/history?userId=${userId}&page=${page}&limit=5`
      );
      const data = await response.json();

      if (response.ok) {
        setPaymentHistoryData(data);
      }
    } catch (err) {
      console.error("Error fetching payment history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleHistoryPageChange = (data) => {
    setPaymentHistoryData(data);
  };

  const handleCancelSubscription = async () => {
    if (subscription.subscriptionType !== "recurring") {
      setNotification({
        message: "One-time payment plans cannot be cancelled.",
        type: "error",
      });
      setShowCancelModal(false);
      return;
    }

    try {
      setCancelling(true);
      const userId = user?.userID || user?._id;

      const response = await fetch("/api/subscribe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          subscriptionType: subscription.subscriptionType,
          reason: "User requested cancellation",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.cancelUrl) {
          window.open(data.cancelUrl, "_blank");
        }
        setNotification({
          message:
            data.message ||
            "Subscription cancellation requested. You will continue to have access until the end of your billing period.",
          type: "success",
        });
        setShowCancelModal(false);
        await checkSubscriptionStatus();
      } else {
        setNotification({
          message: data.error || "Failed to cancel subscription",
          type: "error",
        });
      }
    } catch (err) {
      setNotification({
        message: "Network error. Please try again.",
        type: "error",
      });
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const findPlanDetails = (planId) => {
    return plans.find((plan) => plan.id === planId) || null;
  };

  const retryLoad = () => {
    setError(null);
    checkSubscriptionStatus();
    fetchPaymentHistory();
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  // Error state
  if (error && !subscription) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ErrorCard error={error} onRetry={retryLoad} />
      </div>
    );
  }

  // No subscription state
  if (!subscription || !subscription.type) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <NoSubscriptionCard />
      </div>
    );
  }

  const planDetails = findPlanDetails(subscription.planId);
  const isActive =
    subscription.status === "active" && subscription.active === true;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Subscription Details Card */}
      <SubscriptionDetailsCard
        subscription={subscription}
        planDetails={planDetails}
        isActive={isActive}
        formatDate={formatDate}
        onCancelClick={() => setShowCancelModal(true)}
      />

      {/* Payment History Card with Server-Side Pagination */}
      <PaymentHistoryCard
        userId={user?.userID || user?._id}
        loading={historyLoading}
        initialData={paymentHistoryData}
        onPageChange={handleHistoryPageChange}
      />

      {/* Cancel Confirmation Modal */}
      <CancelConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        isLoading={cancelling}
        subscription={subscription}
      />
    </div>
  );
};

export default SubscriptionDashboard;

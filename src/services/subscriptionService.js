import mongoose from "mongoose";
import dbConnect from "@/libs/mongo";
import Users from "@/model/auth/signup";
import PaymentHistory from "@/model/admin/paymentHistory";
import { mapPlanToYourSafe } from "@/libs/yoursafe/yoursafe";

export class SubscriptionService {
  /**
   * Find user by ID (handles both ObjectId and UUID string)
   * @param {string} userId - User ID (can be ObjectId or UUID)
   * @returns {Object} User document
   */
  static async findUser(userId) {
    try {
      // Try ObjectId first
      let user = await Users.findById(userId);
      if (user) return user;
    } catch (error) {
      // ObjectId failed, try UUID
    }

    // Try finding by userID field (UUID)
    let user = await Users.findOne({ userID: userId });
    if (user) return user;

    // Try finding by _id as string
    user = await Users.findOne({ _id: userId });
    if (user) return user;

    return null;
  }

  /**
   * Update user subscription data
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user
   */
  static async updateUser(userId, updateData) {
    const user = await this.findUser(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Use $set operator to ensure proper update of nested objects
    const updateQuery = updateData.$set ? updateData : { $set: updateData };

    const updatedUser = await Users.findOneAndUpdate(
      { _id: user._id },
      updateQuery,
      {
        new: true,
        runValidators: false, // Disable validators for flexibility
        strict: false, // Allow updates to fields not in schema
      }
    );

    if (!updatedUser) {
      throw new Error(`Failed to update user: ${userId}`);
    }

    return updatedUser;
  }

  /**
   * Calculate subscription expiry date based on plan type and start date
   * @param {string} planId - Plan identifier
   * @param {Date} startDate - Subscription start date
   * @returns {Date} Expiry date
   */
  static calculateExpiryDate(planId, startDate = new Date()) {
    const expiry = new Date(startDate);

    switch (planId) {
      case "monthly-recurring":
        // Recurring monthly - next charge in 30 days
        expiry.setMonth(expiry.getMonth() + 1);
        break;
      case "30-day-onetime":
        // One-time 30 days
        expiry.setDate(expiry.getDate() + 30);
        break;
      case "90-day-onetime":
        // One-time 90 days
        expiry.setDate(expiry.getDate() + 90);
        break;
      default:
        // Default to 30 days
        expiry.setDate(expiry.getDate() + 30);
    }

    return expiry;
  }

  /**
   * Create or update user subscription
   * @param {string} userId - User ID
   * @param {string} planId - Plan identifier
   * @param {Object} paymentData - Payment information from YourSafe
   */
  static async activateSubscription(userId, planId, paymentData) {
    if (!userId || !planId) {
      throw new Error("User ID and plan ID are required");
    }
    console.log("=========In activate subcription==========");

    await dbConnect();

    const startDate = new Date();
    const expiryDate = this.calculateExpiryDate(planId, startDate);
    const plan = mapPlanToYourSafe(planId);

    const subscriptionData = {
      planId,
      planName: plan.name,
      type: plan.name, // Plan name for backward compatibility
      status: "active", // Set status field
      active: true, // Quick boolean check
      subscriptionType: plan.subscriptionType || "onetime", // recurring or onetime
      startDate,
      expiryDate,
      lastPaymentDate: startDate,
      amount: parseFloat(plan.priceAmount),
      currency: plan.priceCurrency,
      saleID: paymentData.saleID,
      referenceID: paymentData.referenceID,
      nextChargeDate: plan.subscriptionType === "recurring" ? expiryDate : null,
      autoRenew: plan.subscriptionType === "recurring",
      cancelDate: null, // Reset cancel date
      cancelReason: null, // Reset cancel reason
      createdAt: startDate,
      updatedAt: startDate,
    };

    // Update user subscription - use dot notation for nested fields
    const updateFields = {};
    Object.keys(subscriptionData).forEach((key) => {
      updateFields[`subscription.${key}`] = subscriptionData[key];
    });
    updateFields.updatedAt = startDate;
    updateFields.role = "subscriber";
    updateFields.checkedout = false; /* Reset Abandoned checkout */

    // Direct update using dot notation
    const user = await this.findUser(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Method 1: Try with findByIdAndUpdate
    let updatedUser = await Users.findByIdAndUpdate(
      user._id,
      { $set: updateFields },
      { new: true, runValidators: false, strict: false } // Disable validators and strict mode
    );
    console.log("update user in method 1 -->", updatedUser);
    // Method 2: If still not working, use direct MongoDB update
    if (!updatedUser?.subscription?.planId) {
      const db = mongoose.connection.db;
      const customersCollection = db.collection("customers");

      // Convert subscription data for direct MongoDB update
      const directUpdate = {
        subscription: subscriptionData,
        updatedAt: startDate,
        checkedout: false,
      };

      const updateResult = await customersCollection.updateOne(
        { _id: user._id },
        { $set: directUpdate }
      );

      // Fetch the updated user
      updatedUser = await Users.findById(user._id);
    }
    console.log("updated user fetch--->", updatedUser);
    // return subscriptionData;
    return {
      user: updatedUser,
      subscription: subscriptionData,
    };
  }

  /**
   * Process recurring payment (rebill)
   * @param {string} userId - User ID
   * @param {Object} paymentData - Payment information from YourSafe
   */
  static async processRebill(userId, paymentData) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await dbConnect();

    const user = await this.findUser(userId);
    if (!user || !user.subscription) {
      throw new Error("User or subscription not found");
    }

    const currentExpiry = new Date(user.subscription.expiryDate);
    const newExpiry = this.calculateExpiryDate(
      user.subscription.planId,
      currentExpiry
    );

    const updateData = {
      "subscription.status": "active",
      "subscription.lastPaymentDate": new Date(),
      "subscription.expiryDate": newExpiry,
      "subscription.nextChargeDate": newExpiry,
      "subscription.updatedAt": new Date(),
    };

    await this.updateUser(userId, updateData);

    const updatedUser = await this.findUser(userId);

    return {
      expiryDate: newExpiry,
      nextChargeDate: newExpiry,
      user: updatedUser,
    };
  }

  /**
   * Cancel user subscription
   * @param {string} userId - User ID
   * @param {string} reason - Cancellation reason
   * @param {Date} cancelDate - Cancellation date
   */
  static async cancelSubscription(
    userId,
    reason = "User requested",
    cancelDate = new Date()
  ) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await dbConnect();

    const user = await this.findUser(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Initialize subscription object if it doesn't exist
    if (!user.subscription) {
      console.warn(`User ${userId} has no subscription to cancel`);
      return { status: "no_subscription", accessUntil: null };
    }

    // Check subscription type - use subscriptionType field or fallback to planId
    const isRecurring =
      user.subscription.subscriptionType === "recurring" ||
      (user.subscription.planId &&
        user.subscription.planId.includes("recurring"));

    // Don't immediately revoke access for recurring subscriptions
    const newStatus = isRecurring ? "pending_cancellation" : "cancelled";
    const keepActive =
      isRecurring &&
      user.subscription.expiryDate &&
      new Date(user.subscription.expiryDate) > new Date();

    const updateData = {
      "subscription.active": keepActive,
      "subscription.cancelDate": cancelDate,
      "subscription.cancelReason": reason,
      "subscription.autoRenew": false,
      "subscription.nextChargeDate": null,
      "subscription.updatedAt": new Date(),
    };

    try {
      await this.updateUser(userId, updateData);

      return {
        status: newStatus,
        accessUntil: user.subscription.expiryDate,
        updated: true,
      };
    } catch (error) {
      console.error("Failed to cancel subscription for user:", {
        userId: encodeURIComponent(userId),
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Expire user subscription
   * @param {string} userId - User ID
   */
  static async expireSubscription(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await dbConnect();

    const user = await this.findUser(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Initialize subscription object if it doesn't exist
    if (!user.subscription) {
      console.warn(`User ${userId} has no subscription to expire`);
      return { status: "no_subscription" };
    }

    const updateData = {
      "subscription.status": "expired",
      "subscription.active": false,
      "subscription.expiryDate": new Date(),
      "subscription.autoRenew": false,
      "subscription.nextChargeDate": null,
      "subscription.updatedAt": new Date(),
      role: "customer",
    };

    try {
      await this.updateUser(userId, updateData);

      return { status: "expired", updated: true };
    } catch (error) {
      console.error("Failed to expire subscription for user:", {
        userId: encodeURIComponent(userId),
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Process refund or chargeback
   * @param {string} userId - User ID
   * @param {string} eventType - 'refund' or 'chargeback'
   * @param {Object} paymentData - Payment information
   */
  static async processRefund(userId, eventType, paymentData) {
    if (!userId || !eventType) {
      throw new Error("User ID and event type are required");
    }

    await dbConnect();

    const user = await this.findUser(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // Initialize subscription object if it doesn't exist
    if (!user.subscription) {
      console.warn(`User ${userId} has no subscription for refund processing`);
      return { status: "no_subscription" };
    }

    const status = eventType === "chargeback" ? "chargeback" : "refunded";

    const updateData = {
      "subscription.status": status,
      "subscription.active": false,
      "subscription.refundDate": new Date(),
      "subscription.refundReason": eventType,
      "subscription.autoRenew": false,
      "subscription.nextChargeDate": null,
      "subscription.updatedAt": new Date(),
      role: "customer",
    };

    try {
      await this.updateUser(userId, updateData);

      return { status, updated: true };
    } catch (error) {
      console.error("Failed to process refund for user:", {
        userId: encodeURIComponent(userId),
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get user subscription status
   * @param {string} userId - User ID
   * @returns {Object} Subscription status and details
   */
  static async getSubscriptionStatus(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await dbConnect();

    const user = await this.findUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Convert Mongoose document to plain object to access properties correctly
    const userObj = user.toObject ? user.toObject() : user;
    const subscription = userObj.subscription || {};
    const now = new Date();

    // Apply minimal fallback logic only if truly needed
    if (!subscription.startDate && subscription.createdAt) {
      subscription.startDate = subscription.createdAt;
    }

    if (
      !subscription.expiryDate &&
      subscription.startDate &&
      subscription.planId
    ) {
      const daysToAdd = subscription.planId?.includes("90") ? 90 : 30;
      const startDate = new Date(subscription.startDate);
      subscription.expiryDate = new Date(startDate);
      subscription.expiryDate.setDate(startDate.getDate() + daysToAdd);
    }

    const expiryDate = subscription.expiryDate
      ? new Date(subscription.expiryDate)
      : null;

    // Calculate if subscription is still valid
    // For backward compatibility: handle missing status field
    const status =
      subscription.status || (subscription.active ? "active" : "inactive");

    const isActive =
      status === "active" &&
      subscription.active === true &&
      (expiryDate ? expiryDate > now : true); // If no expiry date, consider it active if marked as active

    const canAccessContent =
      isActive || subscription.status === "pending_cancellation";

    const daysRemaining = expiryDate
      ? Math.max(0, Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24)))
      : 0;

    const result = {
      ...subscription,
      status, // Use calculated status for backward compatibility
      subscriptionType:
        subscription.subscriptionType ||
        (subscription.planId?.includes("recurring") ? "recurring" : "onetime"),
      isActive,
      canAccessContent,
      daysRemaining,
      isExpired: expiryDate && expiryDate <= now,
      user: {
        email: user.email,
      },
    };

    return result;
  }

  /**
   * Save payment history record
   * @param {Object} eventData - Event data from postback
   * @param {Object} rawPayload - Raw postback payload
   */
  static async savePaymentHistory(eventData, rawPayload) {
    try {
      await dbConnect();

      const paymentRecord = new PaymentHistory({
        userId: eventData.userId,
        saleID: eventData.saleID,
        referenceID: eventData.referenceID,
        event: eventData.event,
        amount: eventData.amount || 0,
        currency: eventData.currency,
        planId: eventData.planId,
        planTitle: eventData.planTitle,
        subscriptionPhase: eventData.subscriptionPhase,
        rawData: rawPayload,
        processedAt: new Date(),
        status: "processed",
        ipAddress: eventData.clientIP,
        userAgent: eventData.userAgent,
      });

      await paymentRecord.save();

      return paymentRecord;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment history for user with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Number of records per page
   * @returns {Object} Payment history with pagination info
   */
  static async getPaymentHistory(userId, page = 1, limit = 10) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    await dbConnect();

    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await PaymentHistory.countDocuments({ userId });

    // Get paginated history
    const history = await PaymentHistory.find({ userId })
      .sort({ processedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-rawData"); // Exclude raw data for security

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      history,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage,
        nextPage: hasNextPage ? page + 1 : null,
        previousPage: hasPreviousPage ? page - 1 : null,
      },
    };
  }

  /**
   * Validate subscription access for content
   * @param {string} userId - User ID
   * @returns {boolean} Whether user has valid access
   */
  static async validateAccess(userId) {
    try {
      const status = await this.getSubscriptionStatus(userId);
      return status.canAccessContent;
    } catch (error) {
      return false;
    }
  }
}

export default SubscriptionService;

import React, { useState, useEffect } from "react";

const PaymentHistoryCard = ({
  userId,
  loading,
  onPageChange,
  initialData = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [historyData, setHistoryData] = useState(initialData);
  const [pageLoading, setPageLoading] = useState(false);

  const handlePageChange = async (page) => {
    if (page === currentPage || pageLoading) return;

    setPageLoading(true);
    setCurrentPage(page);

    try {
      const response = await fetch(
        `/api/subscribe/history?userId=${userId}&page=${page}&limit=5`
      );
      const data = await response.json();

      if (response.ok) {
        setHistoryData(data);
        onPageChange?.(data);
      }
    } catch (error) {
      console.error("Error loading page:", error);
    } finally {
      setPageLoading(false);
    }
  };

  // Update local data when initialData changes
  useEffect(() => {
    if (initialData) {
      setHistoryData(initialData);
      setCurrentPage(initialData.pagination?.currentPage || 1);
    }
  }, [initialData]);

  const getEventIcon = (event) => {
    switch (event) {
      case "payment":
        return (
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "rebill":
        return (
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        );
      case "refund":
        return (
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventLabel = (event) => {
    switch (event) {
      case "payment":
        return "Payment";
      case "rebill":
        return "Rebill";
      case "refund":
        return "Refund";
      case "chargeback":
        return "Chargeback";
      default:
        return event;
    }
  };

  if (loading && !historyData) {
    return (
      <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6">Payment History</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex items-center justify-between py-3"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                  <div className="h-3 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const history = historyData?.history || [];
  const pagination = historyData?.pagination;
  const isLoading = loading || pageLoading;

  return (
    <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6">Payment History</h3>
      {!history || history.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-gray-400">No payment history available</p>
        </div>
      ) : (
        <>
          <div
            className={`space-y-4 ${
              isLoading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {history.map((item, index) => (
              <div
                key={item._id || index}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getEventIcon(item.event)}
                  <div>
                    <div className="font-semibold text-white">
                      {getEventLabel(item.event)} - {item.planTitle}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(item.processedAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      item.event === "refund"
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.event === "refund" ? "-" : ""}
                    {item.currency}
                    {item.amount}
                  </div>
                  <div className="text-xs text-gray-400">ID: {item.saleID}</div>
                </div>
              </div>
            ))}
          </div>

          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff4040]"></div>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1}-
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalCount
                )}{" "}
                of {pagination.totalCount} transactions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.previousPage)}
                  disabled={!pagination.hasPreviousPage || isLoading}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {[...Array(Math.min(5, pagination.totalPages))].map(
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={isLoading}
                          className={`px-3 py-1 rounded transition-colors ${
                            pagination.currentPage === pageNum
                              ? "bg-[#ff4040] text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.nextPage)}
                  disabled={!pagination.hasNextPage || isLoading}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentHistoryCard;

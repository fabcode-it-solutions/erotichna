import React from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info", // 'success', 'error', 'warning', 'info'
  showCloseButton = true,
  actions = null,
  children,
}) => {
  if (!isOpen) return null;

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: (
            <svg
              className="w-8 h-8 text-green-400"
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
          ),
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
        };
      case "error":
        return {
          icon: (
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
        };
      case "warning":
        return {
          icon: (
            <svg
              className="w-8 h-8 text-yellow"
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
          ),
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
        };
      default:
        return {
          icon: (
            <svg
              className="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500/30",
        };
    }
  };

  const { icon, bgColor, borderColor } = getIconAndColors();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative p-6 pb-4">
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          )}

          <div className="text-center">
            <div
              className={`w-16 h-16 ${bgColor} ${borderColor} border rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              {icon}
            </div>
            {title && (
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto">
          {message && (
            <p className="text-gray-300 text-center mb-6 leading-relaxed">
              {message}
            </p>
          )}
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="px-6 pb-6">
            <div className="flex gap-3 justify-center">{actions}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

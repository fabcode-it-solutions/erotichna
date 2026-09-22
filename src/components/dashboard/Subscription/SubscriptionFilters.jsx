// components/subscription/SubscriptionFilters.jsx
import React, { useState, useEffect } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";

export default function SubscriptionFilters({
  initial = {},
  onFilter,
  onReset,
  loading,
}) {
  const [email, setEmail] = useState(initial.email || "");
  const [status, setStatus] = useState(initial.status || "");
  const [plan, setPlan] = useState(initial.plan || "");
  const [type, setType] = useState(initial.type || "");

  // Debounced email auto-update
  const debouncedEmail = useDebouncedValue(email, 500);

  // Auto-apply email filter on debounce
  useEffect(() => {
    onFilter({
      email: debouncedEmail,
      status,
      plan,
      type,
    });
  }, [debouncedEmail]);

  const apply = () => {
    onFilter({ email, status, plan, type });
  };

  const reset = () => {
    setEmail("");
    setStatus("");
    setPlan("");
    setType("");
    onReset();
  };

  const activeFilters = [
    email && { label: `Email: ${email}`, key: "email" },
    status && { label: `Status: ${status}`, key: "status" },
    plan && { label: `Plan: ${plan}`, key: "plan" },
    type && { label: `Type: ${type}`, key: "type" },
  ].filter(Boolean);

  return (
    <div className="w-full mb-4">
      <div className="flex gap-3 items-end flex-wrap">
        {/* Email */}
        <div className="flex-1 min-w-[220px]">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Search by email"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Status */}
        <div className="w-[180px]">
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Plan */}
        <div className="w-[220px]">
          <label className="block text-sm font-medium mb-1">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">All plans</option>
            <option value="monthly-recurring">Monthly Recurring</option>
            <option value="30-day-onetime">30-day One-time</option>
            <option value="90-day-onetime">90-day One-time</option>
          </select>
        </div>

        {/* Type */}
        <div className="w-[160px]">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">All types</option>
            <option value="one-time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={loading}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={apply}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm flex items-center gap-2"
          >
            {loading && (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            Apply
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="bg-gray-200 text-sm px-3 py-1 rounded-full"
            >
              {f.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

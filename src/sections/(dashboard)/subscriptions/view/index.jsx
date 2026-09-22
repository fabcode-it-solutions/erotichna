"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/global/pagination/Pagination";
import DataRow from "@/components/subscription/components/DataRow";
import React, { useEffect, useState, useCallback } from "react";

// helper for debounce
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Index = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [type, setType] = useState("");

  const debouncedEmail = useDebounce(search, 500);

  // modal
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // pagination
  const [index, setIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 50;

  // FETCH CUSTOMERS WITH FILTERS
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (index + 1).toString(),
        limit: limit.toString(),
      });

      if (debouncedEmail) params.append("search", debouncedEmail);
      if (status) params.append("status", status);
      if (plan) params.append("plan", plan);
      if (type) params.append("type", type);

      const res = await fetch(
        `/api/admin/subscription/subscriptions?${params}`
      );
      const data = await res.json();

      setCustomers(data?.data || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [index, debouncedEmail, status, plan, type]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // RESET FILTERS
  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setPlan("");
    setType("");
    setIndex(0);
  };

  // Helper date format
  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const openDetails = (c) => {
    setSelected(c);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setSelected(null);
    setIsModalOpen(false);
  };

  return (
    <div className="font-satoshi">
      <HeaderHeading
        description="View and inspect customer subscriptions."
        title="Subscriptions"
        notification={false}
        home={true}
        search={true}
      />

      <MobileHeader heading="Subscriptions" />

      {/* ===================== FILTER BAR ===================== */}
      <div className="border p-4 rounded-xl bg-white flex flex-wrap gap-4 mt-6 items-end">
        {/* Email Search */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Email</label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIndex(0);
            }}
            placeholder="Search email"
            className="border rounded-lg px-3 py-2 w-[200px]"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setIndex(0);
            }}
            className="border rounded-lg px-3 py-2 w-[200px]"
          >
            <option value="">All</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>

        {/* Plan */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Plan</label>
          <select
            value={plan}
            onChange={(e) => {
              setPlan(e.target.value);
              setIndex(0);
            }}
            className="border rounded-lg px-3 py-2 w-[200px]"
          >
            <option value="">All</option>
            <option value="monthly-recurring">monthly-recurring</option>
            <option value="30-day-onetime">30-day-onetime</option>
            <option value="90-day-onetime">90-day-onetime</option>
          </select>
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Type</label>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setIndex(0);
            }}
            className="border rounded-lg px-3 py-2 w-[200px]"
          >
            <option value="">All</option>
            <option value="one-time">one-time</option>
            <option value="recurring">recurring</option>
          </select>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => fetchCustomers()}
          disabled={loading}
          className="px-5 py-2 bg-black text-white rounded-lg flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Apply
        </button>

        {/* Reset */}
        <button onClick={resetFilters} className="px-5 py-2 border rounded-lg">
          Reset
        </button>
      </div>

      {/* ===================== ACTIVE FILTER CHIPS ===================== */}
      {(search || status || plan || type) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {search && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Email: {search}
            </span>
          )}
          {status && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Status: {status}
            </span>
          )}
          {plan && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Plan: {plan}
            </span>
          )}
          {type && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Type: {type}
            </span>
          )}
        </div>
      )}

      {/* ===================== LOADING ===================== */}
      {loading && (
        <div className="text-center mt-4 font-medium">Loading...</div>
      )}

      {/* ===================== TABLE ===================== */}
      {!loading && customers.length > 0 && (
        <div className="mt-8 max-md-tab:hidden">
          {/* Table Header */}
          <ul className="flex bg-warm p-2 gap-2 border-b border-warm">
            <li className="w-[60px] text-sm font-medium text-[#151516]">
              S.no
            </li>
            <li className="w-[260px] text-sm font-medium text-[#151516]">
              Email
            </li>
            <li className="w-[150px] text-sm font-medium text-[#151516]">
              Plan
            </li>
            <li className="w-[130px] text-sm font-medium text-[#151516]">
              Type
            </li>
            <li className="w-[130px] text-sm font-medium text-[#151516]">
              Status
            </li>
            <li className="w-[150px] text-sm font-medium text-[#151516]">
              Start
            </li>
            <li className="w-[150px] text-sm font-medium text-[#151516]">
              Expiry
            </li>
          </ul>

          {/* Table Rows */}
          <div className="max-h-[330px] overflow-y-auto">
            <ul className="border-x border-warm">
              {customers.map((c, i) => {
                const s = c?.subscription || {};

                const plan = s.planId || s.planName || "-";
                const type = s.subscriptionType || s.type || "-";
                const status = s.status || (s.active ? "active" : "inactive");

                return (
                  <li
                    key={i}
                    className={`flex items-center p-2 gap-2 cursor-pointer ${
                      i % 2 === 1 ? "bg-warm" : ""
                    }`}
                    onClick={() => openDetails(c)}
                  >
                    <div className="w-[60px] text-sm font-medium">{i + 1}</div>
                    <div className="w-[260px] text-sm font-bold truncate">
                      {c.email}
                    </div>
                    <div className="w-[150px] text-sm truncate">{plan}</div>
                    <div className="w-[130px] text-sm truncate">{type}</div>
                    <div className="w-[130px] text-sm truncate">{status}</div>
                    <div className="w-[150px] text-sm">
                      {formatDate(s.startDate)}
                    </div>
                    <div className="w-[150px] text-sm">
                      {formatDate(s.expiryDate)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ===================== PAGINATION ===================== */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            count={totalPages}
            index={index}
            getIndex={setIndex}
            visiblePages={5}
            dark={true}
          />
        </div>
      )}

      {/* ===================== MODAL ===================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeDetails}
        title="Subscription Details"
        type="info"
      >
        {selected && (
          <div className="space-y-2">
            <DataRow label="Email" value={selected?.email || "-"} />

            <DataRow
              label="Plan"
              value={
                selected?.subscription?.planId ||
                selected?.subscription?.planName ||
                "-"
              }
            />

            <DataRow
              label="Type"
              value={
                selected?.subscription?.subscriptionType ||
                selected?.subscription?.type ||
                "-"
              }
            />

            <DataRow
              label="Status"
              value={
                selected?.subscription?.status ||
                (selected?.subscription?.active ? "active" : "inactive")
              }
            />

            <DataRow
              label="Start Date"
              value={formatDate(selected?.subscription?.startDate)}
            />

            <DataRow
              label="Expiry Date"
              value={formatDate(selected?.subscription?.expiryDate)}
            />

            <DataRow
              label="Last Payment"
              value={formatDate(selected?.subscription?.lastPaymentDate)}
            />

            <DataRow
              label="Next Billing"
              value={formatDate(selected?.subscription?.nextChargeDate)}
            />

            <DataRow
              label="Auto Renew"
              value={selected?.subscription?.autoRenew ? "Yes" : "No"}
            />

            <DataRow
              label="Amount"
              value={
                selected?.subscription?.amount
                  ? `${selected?.subscription?.amount} ${
                      selected?.subscription?.currency || "USD"
                    }`
                  : "N/A"
              }
            />

            <DataRow
              label="Sale ID"
              value={selected?.subscription?.saleID || "N/A"}
            />

            <DataRow
              label="Reference ID"
              value={selected?.subscription?.referenceID || "N/A"}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Index;

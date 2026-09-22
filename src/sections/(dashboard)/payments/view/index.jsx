"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/global/pagination/Pagination";
import DataRow from "@/components/subscription/components/DataRow";
import React, { useEffect, useState, useCallback } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Index = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [event, setEvent] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [index, setIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (index + 1).toString(),
        limit: limit.toString(),
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (event) params.append("event", event);
      if (status) params.append("status", status);
      if (plan) params.append("plan", plan);

      const res = await fetch(`/api/admin/payments?${params}`);
      const data = await res.json();

      setPayments(data?.data || []);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [index, debouncedSearch, event, status, plan]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const resetFilters = () => {
    setSearch("");
    setEvent("");
    setStatus("");
    setPlan("");
    setIndex(0);
  };

  const formatDate = (d) => {
    if (!d) return "N/A";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const openDetails = (p) => {
    setSelected(p);
    setIsModalOpen(true);
  };
  const closeDetails = () => {
    setSelected(null);
    setIsModalOpen(false);
  };

  return (
    <div className="font-satoshi">
      <HeaderHeading
        description="View and inspect all payment events."
        title="Payments"
        notification={false}
        home={true}
        search={true}
      />

      <MobileHeader heading="Payments" />

      <div className="border p-4 rounded-xl bg-white flex flex-wrap gap-4 mt-6 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Search</label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIndex(0);
            }}
            placeholder="Email, saleID, referenceID, plan"
            className="border rounded-lg px-3 py-2 w-[240px]"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">Event</label>
          <select
            value={event}
            onChange={(e) => {
              setEvent(e.target.value);
              setIndex(0);
            }}
            className="border rounded-lg px-3 py-2 w-[200px]"
          >
            <option value="">All</option>
            <option value="initial">initial</option>
            <option value="rebill">rebill</option>
            <option value="cancel">cancel</option>
            <option value="expiry">expiry</option>
            <option value="credit">credit</option>
            <option value="chargeback">chargeback</option>
            <option value="extend">extend</option>
            <option value="upgrade">upgrade</option>
            <option value="downgrade">downgrade</option>
          </select>
        </div>

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
            <option value="processed">processed</option>
            <option value="failed">failed</option>
            <option value="pending">pending</option>
          </select>
        </div>

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

        <button
          onClick={() => fetchPayments()}
          disabled={loading}
          className="px-5 py-2 bg-black text-white rounded-lg flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Apply
        </button>

        <button onClick={resetFilters} className="px-5 py-2 border rounded-lg">
          Reset
        </button>
      </div>

      {(search || event || status || plan) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {search && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Search: {search}
            </span>
          )}
          {event && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Event: {event}
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
        </div>
      )}

      {loading && (
        <div className="text-center mt-4 font-medium">Loading...</div>
      )}

      {!loading && payments.length > 0 && (
        <div className="mt-8 max-md-tab:hidden">
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
            <li className="w-[120px] text-sm font-medium text-[#151516]">
              Event
            </li>
            <li className="w-[120px] text-sm font-medium text-[#151516]">
              Amount
            </li>
            <li className="w-[120px] text-sm font-medium text-[#151516]">
              Status
            </li>
            <li className="w-[200px] text-sm font-medium text-[#151516]">
              Processed
            </li>
          </ul>
          <div className="max-h-[330px] overflow-y-auto">
            <ul className="border-x border-warm">
              {payments.map((p, i) => (
                <li
                  key={i}
                  className={`flex items-center p-2 gap-2 cursor-pointer ${
                    i % 2 === 1 ? "bg-warm" : ""
                  }`}
                  onClick={() => openDetails(p)}
                >
                  <div className="w-[60px] text-sm font-medium">{i + 1}</div>
                  <div className="w-[260px] text-sm font-bold truncate">
                    {p.email || "-"}
                  </div>
                  <div className="w-[150px] text-sm truncate">
                    {p.planId || p.planTitle || "-"}
                  </div>
                  <div className="w-[120px] text-sm truncate">{p.event}</div>
                  <div className="w-[120px] text-sm truncate">
                    {p.amount ? `${p.amount} ${p.currency || "USD"}` : "N/A"}
                  </div>
                  <div className="w-[120px] text-sm truncate">{p.status}</div>
                  <div className="w-[200px] text-sm">
                    {formatDate(p.processedAt)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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

      <Modal
        isOpen={isModalOpen}
        onClose={closeDetails}
        title="Payment Details"
        type="info"
      >
        {selected && (
          <div className="space-y-2">
            <DataRow label="Email" value={selected?.email || "-"} />
            <DataRow
              label="Plan"
              value={selected?.planId || selected?.planTitle || "-"}
            />
            <DataRow label="Event" value={selected?.event || "-"} />
            <DataRow label="Status" value={selected?.status || "-"} />
            <DataRow
              label="Amount"
              value={
                selected?.amount
                  ? `${selected?.amount} ${selected?.currency || "USD"}`
                  : "N/A"
              }
            />
            <DataRow
              label="Payment Method"
              value={selected?.paymentMethod || "N/A"}
            />
            <DataRow
              label="Processed At"
              value={formatDate(selected?.processedAt)}
            />
            <DataRow label="Sale ID" value={selected?.saleID || "N/A"} />
            <DataRow
              label="Reference ID"
              value={selected?.referenceID || "N/A"}
            />
            <DataRow
              label="Description"
              value={selected?.description || "N/A"}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Index;

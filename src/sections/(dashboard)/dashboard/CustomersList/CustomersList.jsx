"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/global/pagination/Pagination";
import DataRow from "@/components/subscription/components/DataRow";
import React, { useEffect, useState, useCallback } from "react";

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  const [index, setIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        skip: String(index * limit),
      });
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (role) params.append("role", role);

      const res = await fetch(`/api/admin/customers/list?${params.toString()}`);
      const json = await res.json();
      if (res.ok && json?.data) {
        setCustomers(json.data);
        const total = json?.total || 0;
        setTotalPages(Math.max(1, Math.ceil(total / limit)));
      } else {
        setCustomers([]);
        setError(json.error || "Failed to load customers");
      }
    } catch (e) {
      setCustomers([]);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [index, search, status, role]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setRole("");
    setIndex(0);
  };

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

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        description="View and inspect customers."
        title="Customers"
        notification={false}
        home={true}
        search={false}
      />

      <MobileHeader heading="Customers" />

      <div className="border p-4 rounded-xl bg-white flex flex-wrap gap-4 mt-6 items-end">
        <div className="flex flex-col">
          <label className="text-sm font-semibold">Search</label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIndex(0);
            }}
            placeholder="Search name or email"
            className="border rounded-lg px-3 py-2 w-[220px]"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setIndex(0);
            }}
            className="border rounded-lg px-3 py-2 w-[180px]"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold">Role</label>
          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setIndex(0);
            }}
            className="border rounded-lg px-3 py-2 w-[180px]"
          >
            <option value="">All</option>
            <option value="subscriber">Subscriber</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Reset
        </button>
      </div>

      {(search || status || role) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {search && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Search: {search}
            </span>
          )}
          {status && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Status: {status}
            </span>
          )}
          {role && (
            <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
              Role: {role}
            </span>
          )}
        </div>
      )}

      {loading && (
        <div className="mt-8">
          <ul className="flex bg-warm p-2 gap-2 border-b border-warm">
            <li className="w-[240px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[260px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[130px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[150px] h-5 bg-gray-75 rounded animate-pulse" />
            {/* <li className="w-[130px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[150px] h-5 bg-gray-75 rounded animate-pulse" /> */}
          </ul>

          <ul className="border-x border-warm">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i} className="flex items-center p-2 gap-2">
                <div className="w-[240px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[260px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[130px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[150px] h-4 bg-gray-75 rounded animate-pulse" />
                {/* <div className="w-[130px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[150px] h-4 bg-gray-75 rounded animate-pulse" /> */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="mt-8 max-md-tab:hidden">
          <ul className="flex bg-warm p-2 gap-2 border-b border-warm">
            <li className="w-[240px] text-sm font-medium text-[#151516]">
              Name
            </li>
            <li className="w-[300px] text-sm font-medium text-[#151516]">
              Email
            </li>
            <li className="w-[130px] text-sm font-medium text-[#151516]">
              Role
            </li>
            <li className="w-[150px] text-sm font-medium text-[#151516]">
              Joined at
            </li>
            {/* <li className="w-[130px] text-sm font-medium text-[#151516]">
              Status
            </li>
            <li className="w-[150px] text-sm font-medium text-[#151516]">
              Plan
            </li> */}
          </ul>
          <div className="max-h-[330px] overflow-y-auto">
            <ul className="border-x border-warm">
              {customers.map((c) => {
                const s = c?.subscription || {};
                const plan = s.planId || s.planName || "-";
                const statusV = c.status || (s.active ? "active" : "inactive");
                return (
                  <li
                    key={c._id}
                    className={`flex items-center p-2 gap-2 cursor-pointer`}
                    onClick={() => openDetails(c)}
                  >
                    <div className="w-[240px] text-sm font-bold truncate">
                      {c.name}
                    </div>
                    <div className="w-[300px] text-sm font-bold truncate">
                      {c.email}
                    </div>
                    <div className="w-[130px] text-sm truncate">
                      {c.role || "-"}
                    </div>
                    <div className="w-[150px] text-sm">
                      {formatDate(c.createdAt)}
                    </div>
                    {/* <div className="w-[130px] text-sm truncate">{statusV}</div> */}
                    {/* <div className="w-[150px] text-sm truncate">{plan}</div> */}
                  </li>
                );
              })}
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
        title="Customer Details"
        type="info"
      >
        {selected && (
          <div className="space-y-2">
            <DataRow label="Name" value={selected?.name || "-"} />
            <DataRow label="Email" value={selected?.email || "-"} />
            <DataRow label="Role" value={selected?.role || "-"} />
            <DataRow label="Status" value={selected?.status || "-"} />
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

export default CustomersList;

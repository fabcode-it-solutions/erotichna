"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import Modal from "@/components/ui/Modal";
import Pagination from "@/components/global/pagination/Pagination";
import DataRow from "@/components/subscription/components/DataRow";
import Image from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Index = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [index, setIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (index + 1).toString(),
        limit: limit.toString(),
        status: "processed",
      });
      if (debouncedSearch) params.append("search", debouncedSearch);

      const res = await fetch(`/api/admin/payments?${params}`);
      const data = await res.json();
      const all = data?.data || [];
      const filtered = all.filter(
        (p) => p.event === "initial" || p.event === "rebill"
      );
      setInvoices(filtered);
      setTotalPages(data?.pagination?.totalPages || 1);
    } catch {
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [index, debouncedSearch]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const resetFilters = () => {
    setSearch("");
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

  const openInvoice = (p) => {
    setSelected(p);
    setIsModalOpen(true);
  };
  const closeInvoice = () => {
    setSelected(null);
    setIsModalOpen(false);
  };

  const printableHtml = useMemo(() => {
    if (!selected) return "";
    const amountStr = selected?.amount
      ? `${selected.amount} ${selected.currency || "USD"}`
      : "N/A";
    return `
      <html>
        <head>
          <title>Invoice ${
            selected.referenceID || selected.saleID || ""
          }</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111; }
            .container { max-width: 760px; margin: 0 auto; padding: 24px; }
            .header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 24px; }
            .title { font-size: 20px; font-weight: 700; }
            .row { display:flex; gap:16px; }
            .col { flex:1; }
            .muted { color:#555; font-size: 12px; }
            table { width:100%; border-collapse: collapse; margin-top: 16px; }
            th, td { text-align:left; border-bottom: 1px solid #eee; padding: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="title">Invoice</div>
              <img src="/assets/images/erotichna-logo-bg.svg" alt="Logo" height="32" />
            </div>
            <div class="row">
              <div class="col">
                <div class="muted">Invoice ID</div>
                <div>INV-${selected.saleID || selected.referenceID || "-"}</div>
              </div>
              <div class="col">
                <div class="muted">Date</div>
                <div>${formatDate(selected.processedAt)}</div>
              </div>
              <div class="col">
                <div class="muted">Status</div>
                <div>${selected.status || "processed"}</div>
              </div>
            </div>

            <div class="row" style="margin-top:16px;">
              <div class="col">
                <div class="muted">Bill To</div>
                <div>${selected.email || "-"}</div>
              </div>
              <div class="col">
                <div class="muted">Payment Method</div>
                <div>${selected.paymentMethod || "Credit Card"}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Plan</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${
                    selected.description || selected.event || "Subscription"
                  }</td>
                  <td>${selected.planId || selected.planTitle || "-"}</td>
                  <td>${amountStr}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <script>window.onload = () => window.print()</script>
        </body>
      </html>
    `;
  }, [selected]);

  const handlePrint = () => {
    if (!printableHtml) return;
    const w = window.open("", "invoice-print");
    if (w) {
      w.document.open();
      w.document.write(printableHtml);
      w.document.close();
    }
  };

  return (
    <div className="font-satoshi">
      <HeaderHeading
        description="View invoices generated from payment history."
        title="Invoices"
        notification={false}
        home={true}
        search={true}
      />

      <MobileHeader heading="Invoices" />

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

        <button
          onClick={() => fetchInvoices()}
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

      {search && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            Search: {search}
          </span>
        </div>
      )}

      {loading && (
        <div className="mt-8 max-md-tab:hidden">
          <ul className="flex bg-warm p-2 gap-2 border-b border-warm">
            <li className="w-[60px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[260px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[150px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[120px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[200px] h-5 bg-gray-75 rounded animate-pulse" />
            <li className="w-[200px] h-5 bg-gray-75 rounded animate-pulse" />
          </ul>

          <ul className="border-x border-warm">
            {Array.from({ length: 10 }).map((_, i) => (
              <li
                key={i}
                className={`flex items-center p-2 gap-2 ${
                  i % 2 === 1 ? "bg-warm" : ""
                }`}
              >
                <div className="w-[60px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[260px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[150px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[120px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[200px] h-4 bg-gray-75 rounded animate-pulse" />
                <div className="w-[200px] h-4 bg-gray-75 rounded animate-pulse" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && invoices.length > 0 && (
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
              Amount
            </li>
            <li className="w-[200px] text-sm font-medium text-[#151516]">
              Processed
            </li>
            <li className="w-[200px] text-sm font-medium text-[#151516]">
              Reference
            </li>
          </ul>

          <ul className="border-x border-warm">
            {invoices.map((p, i) => (
              <li
                key={i}
                className={`flex items-center p-2 gap-2 cursor-pointer ${
                  i % 2 === 1 ? "bg-warm" : ""
                }`}
                onClick={() => openInvoice(p)}
              >
                <div className="w-[60px] text-sm font-medium">{i + 1}</div>
                <div className="w-[260px] text-sm font-bold truncate">
                  {p.email || "-"}
                </div>
                <div className="w-[150px] text-sm truncate">
                  {p.planId || p.planTitle || "-"}
                </div>
                <div className="w-[120px] text-sm truncate">
                  {p.amount ? `${p.amount} ${p.currency || "USD"}` : "N/A"}
                </div>
                <div className="w-[200px] text-sm">
                  {formatDate(p.processedAt)}
                </div>
                <div className="w-[200px] text-sm truncate">
                  {p.referenceID || p.saleID || "-"}
                </div>
              </li>
            ))}
          </ul>
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
        onClose={closeInvoice}
        title="Invoice"
        type="info"
      >
        {selected && (
          <div className="space-y-2">
            <div className="flex items-center justify-end">
              <Image
                src="/assets/images/erotichna-logo-bg.svg"
                alt="Logo"
                width={160}
                height={26}
                unoptimized={true}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-white">
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">Invoice ID</div>
                <div className="text-sm font-semibold break-all">
                  INV-{selected?.saleID || selected?.referenceID || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">Date</div>
                <div className="text-sm font-semibold">
                  {formatDate(selected?.processedAt)}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">Status</div>
                <div className="text-sm font-semibold">
                  {selected?.status || "processed"}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-white mt-2">
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">Bill To</div>
                <div className="text-sm font-semibold break-all">
                  {selected?.email || "-"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-gray-400 text-xs">Payment Method</div>
                <div className="text-sm font-semibold">
                  {selected?.paymentMethod || "Credit Card"}
                </div>
              </div>
            </div>
            <div className="border rounded-lg">
              <ul className="flex bg-black/40 p-2 gap-2 border-b border-white/20">
                <li className="w-[50%] text-sm font-medium text-white">
                  Description
                </li>
                <li className="w-[25%] text-sm font-medium text-white">Plan</li>
                <li className="w-[25%] text-sm font-medium text-white">
                  Amount
                </li>
              </ul>
              <ul className="border-x border-white/10">
                <li className="flex items-center p-2 gap-2">
                  <div className="w-[50%] text-sm truncate text-white">
                    {selected?.description || selected?.event || "Subscription"}
                  </div>
                  <div className="w-[25%] text-sm truncate text-white">
                    {selected?.planId || selected?.planTitle || "-"}
                  </div>
                  <div className="w-[25%] text-sm truncate text-white">
                    {selected?.amount
                      ? `${selected?.amount} ${selected?.currency || "USD"}`
                      : "N/A"}
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Print
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Index;

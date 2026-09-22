"use client";
import IconArrowForward from "@/assets/icons/IconArrowForward";
import IconDots from "@/assets/icons/IconDots";
import Anchor from "@/components/ui/anchor/Anchor";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NewCustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState({});

  const getInitials = (name, email) => {
    const source = name || email || "";
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    const local = (email || "").split("@")[0];
    return local.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/dashboard/newcustomers?limit=5");
        const json = await res.json();
        if (res.ok && json?.data) {
          setCustomers(json.data);
        } else {
          setError(json.error || "Failed to load customers");
        }
      } catch (e) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const SkeletonItem = () => (
    <li className="flex items-center justify-between gap-4 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-[42px] h-[42px] rounded-full bg-gray-200" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded-full" />
    </li>
  );

  return (
    <Wrapper className="p-5 pb-3.5 rounded-lg border border-stroke max-w-[382px] w-full">
      <Wrapper className="flex items-center justify-between mb-5">
        <Wrapper className="text-heading text-xl font-medium">
          New Customers List
        </Wrapper>
        <button>
          <IconDots />
        </button>
      </Wrapper>

      <hr className="border-stroke -mx-5 mb-4" />

      <ul className="mb-6 flex flex-col gap-6">
        {/* Skeleton Loader */}
        {loading && [0, 1, 2, 3, 4].map((i) => <SkeletonItem key={i} />)}

        {/* Actual Data */}
        {!loading &&
          customers.map((item, i) => (
            <li key={item._id || i}>
              <Link
                href={"/dashboard/subscriptions"}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[42px] h-[42px] flex items-center justify-center">
                    {item?.image && !imgError[i] ? (
                      <Image
                        src={item.image.replace(
                          "https://storage.bunnycdn.com/assets-erotichna",
                          "https://files-erotichna.b-cdn.net"
                        )}
                        width={42}
                        height={42}
                        unoptimized
                        alt="Customer"
                        className="rounded-full"
                        onError={() =>
                          setImgError((prev) => ({ ...prev, [i]: true }))
                        }
                      />
                    ) : (
                      <div className="w-[42px] h-[42px] rounded-full bg-[#f5f4f2] flex items-center justify-center">
                        <span className="text-[#151516] text-sm font-bold">
                          {getInitials(item?.name, item?.email)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-[#151516] text-sm font-bold">
                      {item?.name}
                    </div>
                  </div>
                </div>

                <button>
                  <IconDots />
                </button>
              </Link>
            </li>
          ))}

        {!loading && customers.length === 0 && (
          <li className="text-center text-sm text-[#151516]">
            No new customers
          </li>
        )}
      </ul>

      <Wrapper className="pt-4 border-t border-stroke border-opacity-50 mx-[-20px]">
        <Anchor
          to="/dashboard/customers"
          buttonStyle="link"
          className="!min-h-[26px]"
        >
          View all <IconArrowForward />
        </Anchor>
      </Wrapper>
    </Wrapper>
  );
};

export default NewCustomersList;

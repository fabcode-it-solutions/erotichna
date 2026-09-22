"use client";
import SeoFields from "@/app/(dashboard)/editor/SeoFields";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Index = ({ slug }) => {
    const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [formData, setFormData] = useState({});
  const { getAllSeo } = useAdmin();
  const [btnLoading, setBtnLoading] = useState(false);
  const updateSeo = async (e) => {
    e.preventDefault();
    const text = "Are you sure?\n You want to change the data.";
    if (confirm(text) == true) {
      try {
        setBtnLoading(true);
        const response = await fetch("/api/admin/seo", {
          method: "PUT",
          body: JSON.stringify({ ...formData, type: type }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data) {
          setBtnLoading(false);
           getAllSeo(10, 0, type);
          router.push("/dashboard/seo");
        }
      } catch (error) {
        setBtnLoading(false);
      } finally {
      }
    }
  };
  const getseodata = async (slug) => {
    try {
      const response = await fetch(`/api/admin/seo?&status=${type}&id=${slug}`);
      const data = await response.json();
      if (data) {
       
        setFormData(data.data);
      }
    } catch (error) {
      console.log("getAllPosts:", error);
      setFormData([]);
    }
  };
  useEffect(() => {
    getseodata(slug);
  }, []);
  return (
    <div>
      <HeaderHeading
        title="Edit SEO fields"
        home={true}
        notification={false}
        search={true}
        description="Edit SEO fields about your data ."
      />
      <MobileHeader heading='SEO' />
      <Wrapper className="relative pt-8 pb-16">
        <SeoFields
          btnStyle="top-auto bottom-0"
          updateSection={updateSeo}
          setFormData={setFormData}
          btnLoading={btnLoading}
          formData={formData}
        />
      </Wrapper>
    </div>
  );
};

export default Index;

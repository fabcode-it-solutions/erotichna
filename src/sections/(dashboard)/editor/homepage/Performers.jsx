"use client";
import AddPerformers from "@/components/dashboard/AddPerformers/AddPerformers";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import Loader from "@/components/global/Loading/Loader";
import ToastError from "@/components/global/Toasts/ToastError";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import useTheme from "@/contexts/theme/ThemeProvider";
import { Box } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";

const Performers = () => {
  const [formData, setFormData] = useState({});
  const { performersData, fetchData, setPerformersData } = useTheme();
  const [success, setSuccess] = useState({});
  const [error, setError] = useState({});
  const [loader, setLoader] = useState(false);

  const updateSection = async () => {
    try {
      setLoader(true);
      const response = await fetch("/api/admin/homepage/performers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heading: formData?.performers?.title,
          homepageId:performersData._id
        }),
      });
      const data = await response.json();
      if (!data.error) {
        setSuccess({
          active: true,
          message: "Performers are Successfully updated.",
        });
        fetchData("performers", setPerformersData);
      } else {
        setError({
          active: true,
          message: data.error,
        });
      }
    } catch (error) {
      setError({
        active: true,
        message: error.error,
      });
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (performersData?.performers) {
      setFormData({ performers: performersData?.performers });
    }
  
  }, [performersData]);
  return (
    <div>
      {loader && <Loader message="Updating section..." />}
      {success?.active && (
        <ToastSuccess
          active={success?.active}
          message={success?.message}
          setSuccess={setSuccess}
        />
      )}
      {error?.active && (
        <ToastError
          active={error?.active}
          message={error?.message}
          setError={setError}
        />
      )}
      <Box className=" max-lg-mb:max-w-full w-full mb-4">
        <button
          onClick={() => updateSection()}
          type="button"
          className="text-center py-3 bg-black absolute top-0 right-4 text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
        >
          Save Changes
        </button>
        <InputDashboard
          name="heading"
          placeholder="Add heading"
          label="Add Heading"
          value={formData?.performers?.title || ""}
          setInputData={(e) =>
            setFormData((prev) => ({
              ...prev,
              performers: {
                ...prev.performers,
                title: e.target.value,
              },
            }))
          }
        />
        <AddPerformers
          setFormData={setFormData}
          data={formData?.performers?.items || []}
          field="performers"
        />
      </Box>
    </div>
  );
};

export default Performers;

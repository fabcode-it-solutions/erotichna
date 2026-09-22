"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import React, { useEffect, useState } from "react";
import CreateModelForm from "../create/CreateModelForm";
import useAuth from "@/contexts/auth/AuthProvider";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";

function Index({ slug }) {
  const { user } = useAuth();
  const [modelData, setModelData] = useState(null); // Store the model data
  const [error, setError] = useState(null); // Store any error message

  useEffect(() => {
    if (!slug) return;

    const fetchModelData = async () => {
      try {
        const response = await fetch(`/api/admin/models/edit/${slug}`, {
          method: "GET",
          headers: {
            "X-TOKEN": user.userID || null,
          },
        });
        console.log(response);

        if (!response.ok) {
          throw new Error("Model not found");
        }
        const data = await response.json();

        setModelData(data.data);
      } catch (error) {
        setError(error.message);
      }
    };
    if (user) {
      fetchModelData();
    }
  }, [slug, user]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <HeaderHeading
        title="Models"
        home={true}
        notification={false}
        search={true}
        description="Edit a model."
      />
      <MobileHeader heading='Models' />
      {!modelData && !error ? (
        <div className="text-center mt-4 font-medium font-satoshi">
          Loading Data...
        </div>
      ) : (
        <CreateModelForm modelData={modelData} />
      )}
    </div>
  );
}

export default Index;

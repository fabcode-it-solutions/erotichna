"use client";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import RichTextEditor from "@/components/dashboard/RichTextEditor/RichTextEditor";
import ToastSuccess from "@/components/global/Toasts/ToastSuccess";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { Box } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";

const Index = () => {
    const { createTermsAndConditionsDataAPI, getTermsAndConditionsDataAPI, termsAndConditionsData } = useAdmin();
    const [formData, setFormData] = useState({});
    const [success, setSuccess] = useState({});

    useEffect(() => {
        if (!termsAndConditionsData) {
            getTermsAndConditionsDataAPI();
        } else {
            setFormData({
                title: termsAndConditionsData?.title || "",
                description: termsAndConditionsData?.description || ""
            })
        }
    }, [termsAndConditionsData, getTermsAndConditionsDataAPI])

    function updateHeader() {
        if (formData.title && formData.description) {
            createTermsAndConditionsDataAPI(formData);
            setSuccess({
                active: true,
                message: "Terms and Conditions updated successfully!",
            });
        } else {
            setSuccess({
                active: true,
                message: "Please fill out all fields.",
            });
        }
    }


    return (
        <div className="">
            {success?.active && (
                <ToastSuccess
                    active={success?.active}
                    message={success?.message}
                    setSuccess={setSuccess}
                />
            )}
            <div className="justify-between flex items-start">
                <HeaderHeading
                    title="Terms and Conditions"
                    description="Edit site terms and Conditions"
                />
                <MobileHeader heading='Terms and Conditions' />
                <button
                    onClick={updateHeader}
                    type="button"
                    className="text-center max-md-tab:hidden py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
                >
                    Save Changes
                </button>
            </div>
            <form className="pt-8">
                <InputDashboard
                    required={true}
                    name="title"
                    placeholder="Add Title Here"
                    label="Add Title*"
                    className=""
                    value={formData?.title || ""}
                    setInputData={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            title: e.target.value
                        }))
                    }
                />

                <Box className=" max-lg-mb:max-w-full w-full pt-[10px]">
                    <label className=" text-[#232323] text-sm font-medium block font-satoshi leading-[19px] mb-3">
                        Add Description
                    </label>
                    <RichTextEditor
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: e,
                            }))
                        }
                        value={formData?.description || ""}
                    />
                </Box>
            </form>
            <button
                    onClick={updateHeader}
                    type="button"
                    className="text-center max-md-tab:block hidden w-full py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi"
                >
                    Save Changes
                </button>
        </div>
    );
};

export default Index;

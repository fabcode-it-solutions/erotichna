"use client";

import React, { useContext, useEffect, useState } from "react";
const AdminDataContext = React.createContext();

export default function useAdmin() {
  return useContext(AdminDataContext);
}

export function AdminDataProvider({ children }) {
  const [sideMenu, setSideMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allposts, setAllPosts] = useState([]);
  const [allmodels, setAllModels] = useState(false);
  const [footerData, setFooterdata] = useState(null);
  const [termsAndConditionsData, setTermsAndConditionsData] = useState(null);
  const [privacyPolicyData, setPrivacyPolicyData] = useState(null);
  const [editorModelsData, setEditorModelsData] = useState(null);
  const [beOurModelData, setBeOurModelData] = useState(null);
  const [comments, setComments] = useState([]);
  const [allSEO, setAllSEO] = useState([]);

  const getComments = async () => {
    try {
      const response = await fetch(`/api/admin/comments?all=true`);
      const data = await response.json();
      if (data) {
        setComments(data.data);
      }
    } catch (error) {
      setBtnLoading(false);
    } finally {
    }
  };
  const getAllCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      if (data) {
        setCategories(data?.data);
      }
    } catch (error) {
      setCategories([]);
    }
  };

  const getAllPosts = async (limit, skip, status, card, categories) => {
    try {
      const response = await fetch(
        `/api/admin/post?limit=${limit || 24}&skip=${skip || 0}&status=${
          status || "all"
        }&card=${card || "false"}&categories=${categories || "00"}`
      );
      const data = await response.json();
      if (data) {
        setAllPosts(data);
      }
    } catch (error) {
      setAllPosts([]);
    }
  };
  const getAllSeo = async (limit, skip, status) => {
    try {
      const response = await fetch(
        `/api/admin/seo?limit=${limit || 24}&skip=${skip || 0}&status=${
          status || "videos"
        }`
      );
      const data = await response.json();
      if (data) {
        setAllSEO(data);
      }
    } catch (error) {
      setAllSEO([]);
    }
  };
  const CreateModel = async ({ data }) => {
    try {
      const response = await fetch("/api/admin/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const data = await response.json();
      if (data) {
        setAllModels(data?.data); // Make sure the response has the correct structure
      }
    } catch (error) {
      setAllModels([]);
    }
  };

  const getAllModels = async (status, limit, skip, sort) => {
    try {
      const response = await fetch(
        `/api/admin/models?limit=${limit}&skip=${skip}&status=${status}&sort=${sort || ''}`
      );
      const data = await response.json();
      if (!data?.error) {
        
        setAllModels(data?.data); // Make sure the response has the correct structure
        return data?.data;
      }
    } catch (error) {
      setAllModels([]);
    }
  };

  const getFooterDataAPI = async () => {
    try {
      const response = await fetch("/api/admin/footer");
      const data = await response.json();
      if (data) {
        setFooterdata(data?.data); // Make sure the response has the correct structure
      }
    } catch (error) {}
  };

  const getTermsAndConditionsDataAPI = async () => {
    try {
      const response = await fetch("/api/admin/terms-and-conditions");
      const data = await response.json();
      if (data) {
        setTermsAndConditionsData(data?.data[0]); // Make sure the response has the correct structure
      }
    } catch (error) {}
  };

  const createTermsAndConditionsDataAPI = async (formData) => {
    try {
      const response = await fetch("/api/admin/terms-and-conditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data) {
        setTermsAndConditionsData(data?.data); // Make sure the response has the correct structure
      }
    } catch (error) {}
  };

  const getPrivacyPolicyDataAPI = async () => {
    try {
      const response = await fetch("/api/admin/privacy-policy");
      const data = await response.json();
      if (data) {
        setPrivacyPolicyData(data?.data[0]); // Make sure the response has the correct structure
      }
    } catch (error) {}
  };

  const createPrivacyPolicyDataAPI = async (formData) => {
    try {
      const response = await fetch("/api/admin/privacy-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data) {
        setTermsAndConditionsData(data?.data[0]);
      }
    } catch (error) {}
  };

  const getEditorModelsDataAPI = async () => {
    try {
      const response = await fetch("/api/admin/editor-models");
      const data = await response.json();
      if (data) {
        setEditorModelsData(data?.data[0]);
      }
    } catch (error) {}
  };

  const getBeOurModelDataAPI = async () => {
    try {
      const response = await fetch("/api/admin/be-our-model");
      const data = await response.json();
      if (data) {
        setBeOurModelData(data?.data[0]);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const value = {
    categories,
    getAllCategories,
    getAllPosts,
    allposts,
    allmodels,
    getAllModels,
    CreateModel,
    getFooterDataAPI,
    footerData,
    termsAndConditionsData,
    setTermsAndConditionsData,
    privacyPolicyData,
    setPrivacyPolicyData,
    getTermsAndConditionsDataAPI,
    getPrivacyPolicyDataAPI,
    createTermsAndConditionsDataAPI,
    createPrivacyPolicyDataAPI,
    getEditorModelsDataAPI,
    editorModelsData,
    setEditorModelsData,
    getBeOurModelDataAPI,
    beOurModelData,
    setBeOurModelData,
    comments,
    getComments,
    getAllSeo,
    allSEO,
    sideMenu,
    setSideMenu,
  };
  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

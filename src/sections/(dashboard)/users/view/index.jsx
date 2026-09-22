"use client";
import GetCategoryVideos from "@/components/dashboard/GetCategoryVideosCount/GetCategoryVideos";
import HeaderHeading from "@/components/dashboard/HeaderHeading/HeaderHeading";
import InputDashboard from "@/components/dashboard/InputDashboard/InputDashboard";
import MobileHeader from "@/components/dashboard/MobileHeader/MobileHeader";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import { CreateSlug } from "@/utils/createSlug";
import { Box } from "@radix-ui/themes";
import Link from "next/link";
import { useEffect, useState } from "react";

const Index = () => {
  const [users, setUsers] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
  });
  const addCategoryDB = async () => {
    setBtnLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData?.name,
          email: formData?.email,
          role: formData?.role,
        }),
      });
      const data = await response.json();
      if (data) {
        setBtnLoading(false);
        setFormData({
          title: "",
          slug: "",
          description: "",
        });
        getUsers();
      }
    } catch (error) {
      setBtnLoading(false);
    } finally {
    }
  };
  const trashCategory = async (email) => {
    const text = "Are you sure?\n You want to delete the user.";
    if (confirm(text) == true) {
      try {
        const response = await fetch("/api/admin/users", {
          method: "DELETE",
          body: JSON.stringify({ email }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data) {
          getUsers();
        }
      } catch (error) {
      } finally {
      }
    }
  };
  useEffect(() => {
    getUsers();
  }, []);
  const getUsers = async () => {
    try {
      const response = await fetch(`/api/admin/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      setUsers(data?.data);
    } catch (error) {
      console.error("Error fetching category videos:", error);
      return 0;
    }
  };
  return (
    <div className="">
      <HeaderHeading
        description="Add user and update user roles."
        title="Users & Roles"
        notification={false}
        home={true}
        search={true}
      />
      <MobileHeader heading="Users & Roles" />
      <div className="flex gap-8 mt-8 max-md-tab:flex-wrap">
        <div className="flex-1 max-md-tab:flex-none max-md-tab:w-full">
          <div>
            <InputDashboard
              required={true}
              name="name"
              placeholder="Enter name"
              label="Enter name*"
              value={formData?.name || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="mt-4">
            <InputDashboard
              type={"email"}
              required={true}
              name="email"
              placeholder="Enter user email"
              label="Enter user email*"
              value={formData?.email || ""}
              setInputData={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div className="mt-4">
            <label className=" text-[#232323] text-sm font-medium font-satoshi mb-2 block leading-[19px]">
              Select Role
            </label>
            <select
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
              className=" placeholder-opacity-0 placeholder-transparent h-[43px] px-[15px] py-3 bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex w-full text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi
          "
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => (btnLoading ? "" : addCategoryDB())}
              className={`bg-black text-sm max-w-[130px] items-center justify-center text-white font-medium px-4 py-1 min-w-[39px] min-h-[39px]   transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg
             ${btnLoading ? "opacity-50 pointer-events-none" : ""}
            `}
            >
              {btnLoading ? "Sending Invite" : "Add User"}
            </button>
          </div>
        </div>

        {users?.length > 0 && (
          <ul className="border-x border-warm w-full hidden max-md-tab:block">
            <li className=" text-lg font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Users
            </li>
            {users.map((item, i) => (
              <div
                key={i}
                className={`bg-white p-3 border-stroke rounded-lg w-full mt-3`}
              >
                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
                  Role: {item?.role}
                </div>
                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
                  Name: {item?.name}
                </div>
                <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
                  Email: {item?.email}
                </div>
                <div className="mt-2">
                    <button
                      onClick={() => trashCategory(item?.email)}
                      className="text-sm font-medium font-satoshi px-4 py-2 rounded-lg leading-6 relative text-white  bg-red-500"
                    >
                      Delete User
                    </button>
                  </div>
              </div>
            ))}
          </ul>
        )}
        <div className="flex-1 max-md-tab:flex-none max-md-tab:w-full max-md-tab:hidden">
          <ul className="flex bg-warm p-2 gap-2">
            <li className="w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              S.no
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Name
            </li>
            <li className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Role
            </li>
            <li className="flex-1 text-left text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Email
            </li>
            <li className="flex-1 text-center text-sm font-medium font-satoshi leading-6 relative   text-[#151516] ">
              Action
            </li>
          </ul>
          {users?.length === 0 && (
            <div className="text-center py-4 text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
              No Record Found.
            </div>
          )}
          {users?.length > 0 && (
            <ul className="border-x border-warm ">
              {users.map((item, i) => (
                <li
                  className={`flex items-center p-2 gap-2 ${
                    i % 2 == 1 ? "bg-warm" : ""
                  }`}
                  key={i}
                >
                  <div className="capitalize w-[40px] text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="capitalize text-sm font-bold font-satoshi leading-6 relative   text-[#151516]">
                      {item?.name}
                    </div>
                    <div className="flex gap-2 max-md-tab:flex-wrap items-center">
                      <div className="w-[1px] h-3 bg-text-secondary hidden"></div>
                      <button className="text-sm hidden font-medium font-satoshi leading-6 relative   text-[#151516]">
                        View
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 text-sm font-medium font-satoshi leading-6 relative   text-[#151516]">
                    {item?.role}
                  </div>
                  <div className="flex-1 text-left text-sm font-medium font-satoshi leading-6 relative text-ellipsis overflow-hidden   text-[#151516]">
                    {item?.email}
                  </div>
                  <div className="flex-1 text-center">
                    <button
                      onClick={() => trashCategory(item?.email)}
                      className="text-sm font-medium font-satoshi px-4 py-2 rounded-lg leading-6 relative text-white  bg-red-500"
                    >
                      Delete User
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

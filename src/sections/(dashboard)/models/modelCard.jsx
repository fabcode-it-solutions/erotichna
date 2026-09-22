"use client"
import IconDelete from "@/assets/icons/IconDelete";
import IconEdit from "@/assets/icons/IconEdit";
import useAdmin from "@/contexts/admin/AdminDataProvider";
import useAuth from "@/contexts/auth/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ModelCard = ({ model, status }) => {
      const { user } = useAuth();
      const {getAllModels} = useAdmin();
      const fetchModelData = async (slug) => {
        const text = "Are you sure?\n You want to delete the Model?";
        if (confirm(text) == true) {
        try {
            const response = await fetch(
              `/api/admin/models/edit/${slug}`,
              {
                method: "put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status:'trash'
                }),
              }
            );
            const data = await response.json();
         
            if (!data.error) {
                getAllModels(status, 24, 0);
            } 
          } catch (error) {
    
          } finally {
         
          }
        }
      };
    return (
        <div className="w-full relative group/banner   border rounded overflow-hidden ">
            <Link href={`/models/${model.seo.permalink}?status=${model.status}`}>
            <div className="pb-[170.97%] relative w-full">
                <Image
                    src={model?.profile_image?.replace(
                      "https://storage.bunnycdn.com/assets-erotichna",
                      "https://files-erotichna.b-cdn.net"
                    )  || '/assets/images/placeholder-dark.png'}
                    width={1080}
                    unoptimized={true}
                    height={1920}
                    className="w-full  h-full object-cover absolute top-0 left-0 z-[1] transition-all duration-500 opacity-100 "
                    alt="Image"
                />
               
            </div> </Link>
            <div className="flex justify-between px-2 items-center">
                <h3 className="text-xl font-satoshi  py-4 leading-none text-black mb-2xl:text-base font-normal">
                    {model?.title}
                </h3>
                <div className="flex gap-2 max-md-tab:flex-wrap items-center">
                <Link href={`/dashboard/models/edit/${model.seo.permalink}`} className="bg-red-400 px-2 text-white rounded font-satoshi
                w-8 h-8 rounded-md flex justify-center items-center
                ">
                   <IconEdit className='fill-white' />
                </Link>
                <button onClick={()=>fetchModelData(model.seo.permalink)} className="w-8 h-8 bg-red-500 rounded-md flex justify-center items-center">
                    <IconDelete className='fill-white'  />
                </button>
                </div>
            </div>
        </div>

    );
};

export default ModelCard;

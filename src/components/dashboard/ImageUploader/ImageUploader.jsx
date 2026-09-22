import IconImageOutlined from "@/assets/icons/IconImageOutlined";
import { Flex } from "@radix-ui/themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageUploader = ({ id, exportImage, prevImage, label }) => {
  const [image, setImages] = useState("");
  const getImages = (e, field) => {
    const file = e.target.files[0];
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = () => {
        const base = reader.result.split("base64,");
        exportImage(file.name, base[1], reader.result);
        setImages(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (prevImage) {
      prevImage.includes("bunnycdn") || prevImage.includes("files-erotichna")
        ? setImages(prevImage)
        : "";
    }
  }, [prevImage]);

  return (
    <div>
      <label
        htmlFor={id}
        className="min-h-[238px] relative max-lg-mb:min-h-[159px] max-lg-mb:border-0 cursor-pointer bg-[#F7F8F9] max-md-tab:bg-white rounded-xl flex items-center justify-center border border-dashed border-black border-opacity-20"
      >
        <Flex direction={"column"} justify={"center"} align={"center"}>
          <IconImageOutlined className="fill-heading w-5 h-5" />
          <p className="text-[#92929D] max-lg-mb:hidden text-center mt-1 mb-[5px] font-satoshi text-sm leading-6 font-normal">
            <u className="font-medium text-[#1B2432]">Click to upload</u> or
            drag and drop
          </p>
          <u className="font-medium text-[#1B2432] text-xsm leading-6 font-satoshi hidden max-lg-mb:block">
            Upload images
          </u>
          <span className="text-center font-satoshi block text-[10px] font-normal leading-[18.1px] text-[#92929D]">
            PNG, JPG, JPEG {label || ''}
          </span>
        </Flex>
        {image && (
          <button
          type="button"
            className="absolute right-2 bottom-2 z-[2] pointer-events-none
            text-center py-3 bg-black text-white px-5 rounded-lg mt-3 text-sm font-satoshi
            "
          >
            Change Image
          </button>
        )}
        {image && (
          <div
            className="rounded-xl overflow-hidden pointer-events-none  absolute max-md-tab:bg-white top-0 left-0 
             w-full h-full
              mb-3 flex justify-center items-center bg-[#F7F8F9]"
          >
            <Image
              src={image.replace(
                "https://storage.bunnycdn.com/assets-erotichna",
                "https://files-erotichna.b-cdn.net"
              ) || "/assets/images/placeholder-light.png"}
              width={1920}
              unoptimized={true}
              className="h-full w-auto object-contain"
              height={39}
              alt="Site Logo"
            />
          </div>
        )}
      </label>

      <input
        onChange={(e) => getImages(e)}
        type="file"
        id={id}
        accept="image/png, image/jpeg"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;

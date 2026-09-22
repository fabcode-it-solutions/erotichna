// components/MultiSelect.js
import IconCheck from "@/assets/icons/IconCheck";
import IconCloseDrawer from "@/assets/icons/IconCloseDrawer";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Select from "react-select";

const MultiSelect = ({ options, onSelectionChange, selectedOption }) => {
  const formattedOptions = options?.map((option) => ({
    value: option._id,
    label: option.title,
  }));
  const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };
  const [modelSearch, setModelSearch] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [filterdModels, setFilterdmodels] = useState([]);
  const handleChange = (selected) => {
    setSelectedOptions((prev) => {
      const isOptionAlreadySelected = prev[selected.value];
      if (isOptionAlreadySelected) {
        const { [selected.value]: _, ...remainingOptions } = prev;
        return remainingOptions;
      } else {
        return {
          ...prev,
          [selected.value]: {
            _id: selected._id,
            id: selected.value,
            label: selected.label,
            link: selected.link,
          },
        };
      }
    });
  };
  useEffect(() => {
    onSelectionChange(selectedOptions);
  }, [selectedOptions]);
  useEffect(() => {
    if (selectedOption) {
      setSelectedOptions(selectedOption);
    }
  }, [selectedOption]);
  const filterModels = (e) => {
    setModelSearch(e);
    if (e != "") {
      setFilterdmodels(
        options.filter((item) =>
          item.title.toLowerCase().includes(e.toLowerCase())
        )
      );
    } else {
      setFilterdmodels([]);
    }
  };
  const removeSelectedOption = (value, options) => {
    const { [value]: _, ...remainingOptions } = options;

    setSelectedOptions(remainingOptions);
  };
  return (
    <div className="w-full">
      <h2 className="text-[#232323] text-sm font-medium font-satoshi leading-[19px] pb-2">
        Select Video Models*
      </h2>

      {!isEmptyObject(selectedOptions) && (
        <div className="my-3 flex flex-wrap gap-2">
          {Object.keys(selectedOptions).map((item, i) => (
            <div
              key={i}
              className="cursor-pointer bg-gray-75 rounded px-2 py-1 gap-2 font-satoshi text-xs flex items-center whitespace-nowrap"
            >
              {selectedOptions[item].label}{" "}
              <button
                onClick={() => removeSelectedOption(item, selectedOptions)}
              >
                <IconCloseDrawer className="w-2 h-2" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div>
        <div className="relative">
          <input
            value={modelSearch || ""}
            placeholder="Search Model by name"
            onChange={(e) => filterModels(e.target.value)}
            className="placeholder-opacity-0 placeholder-transparent      
          h-[43px] px-[15px] py-3 bg-white rounded-lg border border-[#eaeaea] justify-start items-center gap-2.5 flex w-full text-main-black placeholder:text-[#aaaaaa] text-sm font-normal font-satoshi          
          "
            name="model"
          />
          {filterdModels.length > 0 && (
            <div className="bg-white rounded-lg shadow-2xl grid grid-cols-6 max-xsm-tab:grid-cols-5 max-lg-mb:grid-cols-3 gap-2 p-4 max-h-[380px] overflow-auto">
              {filterdModels.map((item, i) => (
                <div
                  onClick={() =>
                    handleChange({
                      value: item.id,
                      label: item.title,
                      link: "/models/" + item?.seo?.permalink,
                      _id: item._id,
                    })
                  }
                  key={i}
                  className="cursor-pointer relative "
                >
                  <Image
                    src={
                      item.profile_image.replace(
                        "https://storage.bunnycdn.com/assets-erotichna",
                        "https://files-erotichna.b-cdn.net"
                      ) ||
                      "/assets/images/placeholder-light.png"
                    }
                     placeholder="blur"
                     blurDataURL="/assets/images/placeholder-light.png"
                    loading="lazy"
                    width={300}
                    height={300}
                    unoptimized={true}
                    alt={item.title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                  <Wrapper
                    className={`border border-warm rounded w-4 flex items-center justify-center h-4 absolute top-3 left-3
                        ${
                          selectedOptions[item.id]?.id == item.id
                            ? "bg-positive"
                            : ""
                        }
                        `}
                  >
                    {selectedOptions[item.id]?.id == item.id && <IconCheck />}
                  </Wrapper>
                  <IconCheck />
                  <div className="">
                    <div className=" text-[#232323] block text-sm font-medium font-satoshi leading-[19px] mb-3">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;

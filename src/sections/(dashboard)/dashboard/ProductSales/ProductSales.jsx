import IconArrowForward from "@/assets/icons/IconArrowForward";
import Anchor from "@/components/global/anchor/Anchor";
import Wrapper from "@/components/global/wrapper/Wrapper";
import Link from "next/link";
import React from "react";

const ProductSales = () => {
  return (
    <Wrapper className="p-5 rounded-lg border border-stroke max-w-[748px]  w-full max-lg-mb:p-3 max-md-tab:max-w-full max-lg-mb:border-0 max-lg-mb:shadow-10xl-large max-lg-mb:bg-white">
      <Wrapper className="flex items-center justify-between py-[1px] mb-[25px] max-xsm-tab:mb-4 max-xsm-tab:p-0">
        <Wrapper className="text-heading text-xl font-medium font-satoshi leading-[27px] max-xsm-tab:leading-[22px] max-xsm-tab:text-base">
          Product Sales
        </Wrapper>
        <Anchor
          to="/"
          buttonStyle="link"
          className="!min-h-[26px] !min-w-[auto] !w-auto max-xsm-tab:hidden"
        >
          View all <IconArrowForward />
        </Anchor>
      </Wrapper>

      <Wrapper className="flex flex-col gap-3 ">
        <Wrapper className="bg-gray-75 py-[13px] px-4 flex items-center gap-2 rounded max-xsm-tab:hidden">
          <Wrapper className="text-[#7f7f7f] text-xs font-medium font-satoshi leading-normal w-[26.5536723%] xxl-dx:w-full">
            Name
          </Wrapper>
          <Wrapper className="text-[#7f7f7f] text-xs font-medium font-satoshi leading-normal w-[20.6214689%] xxl-dx:w-full ">
            Reference number
          </Wrapper>
          <Wrapper className="text-[#7f7f7f] text-xs font-medium font-satoshi leading-normal w-[18.5028249%] xxl-dx:w-full">
            Units sold
          </Wrapper>
          <Wrapper className="text-[#7f7f7f] text-xs font-medium font-satoshi leading-normal w-[20.3389831%] xxl-dx:w-full">
            Amount
          </Wrapper>
          <Wrapper className="text-[#7f7f7f] text-xs font-medium font-satoshi leading-normal flex-1 whitespace-nowrap text-right xxl-dx:w-full">
            % from total
          </Wrapper>
        </Wrapper>
        {[0, 1, 2, 3, 4].map((i) => (
          <Link
            href="/"
            className="py-3 px-4 flex items-center gap-2 max-xsm-tab:grid max-xsm-tab:grid-cols-2 max-xsm-tab:gap-4 max-xsm-tab:p-3 max-xsm-tab:border max-xsm-tab:border-[#EBEBEB] max-xsm-tab:rounded-lg"
            key={i}
          >
            <Wrapper className="text-[#151516] text-sm font-medium leading-snug font-satoshi w-[26.5536723%] max-xsm-tab:w-full xxl-dx:w-full ">
              <div className="text-[#7f7f7f] text-xs font-medium font-['Satoshi'] leading-4 hidden max-xsm-tab:block mb-1">
                Name
              </div>
              Omega Speedmaster
            </Wrapper>
            <Wrapper className="text-[#242424] text-sm font-normal font-satoshi leading-snug w-[20.6214689%] max-xsm-tab:w-full xxl-dx:w-full">
              <div className="text-[#7f7f7f] text-xs font-medium font-['Satoshi'] leading-4 hidden max-xsm-tab:block mb-1">
                Reference number
              </div>
              123412345
            </Wrapper>
            <Wrapper className="text-[#242424] text-sm font-normal font-satoshi leading-snug w-[18.5028249%] max-xsm-tab:w-full xxl-dx:w-full">
              <div className="text-[#7f7f7f] text-xs font-medium font-['Satoshi'] leading-4 hidden max-xsm-tab:block mb-1">
                Units sold
              </div>
              56
            </Wrapper>
            <Wrapper className="text-[#242424] text-sm font-normal font-satoshi leading-snug w-[20.3389831%] max-xsm-tab:w-full xxl-dx:w-full">
              <div className="text-[#7f7f7f] text-xs font-medium font-['Satoshi'] leading-4 hidden max-xsm-tab:block mb-1">
                Amount
              </div>
              $470,00
            </Wrapper>
            <Wrapper className="text-[#242424] text-sm font-normal font-satoshi leading-snug flex-1 whitespace-nowrap text-right max-xsm-tab:hidden xxl-dx:w-full">
              34%
            </Wrapper>
          </Link>
        ))}
      </Wrapper>
      <Wrapper className='max-xsm-tab:flex justify-center hidden mt-4 mb-1'>
      <Anchor
          to="/"
          buttonStyle="link"
          className="!min-h-[26px] !min-w-[auto] !w-auto "
        >
          View all <IconArrowForward />
        </Anchor>
        </Wrapper>
    </Wrapper>
  );
};

export default ProductSales;

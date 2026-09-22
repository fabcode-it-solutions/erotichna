import IconHome from "@/assets/icons/IconHome";
import Wrapper from "@/components/ui/wrapper/Wrapper";
import Link from "next/link";
import NotificationButton from "../NotificationButton/NotificationButton";
import Search from "../Search/Search";

const HeaderHeading = ({
  title,
  description,
  descriptionStyle,
  titleStyle,
  wrapperClass,
  search,
  notification,
  home,
}) => {
  return (
    <Wrapper className="flex items-start justify-between">
      <div className={`relative max-lg-mb:hidden ${wrapperClass || ""}`}>
        <div
          className={` text-heading text-2xl font-medium max-lg-mb:text-lg font-satoshi leading-7 ${
            titleStyle || ""
          }`}
        >
          {title || "Home"}
        </div>
        {description && (
          <div
            className={`text-text-secondary text-base font-normal font-satoshi leading-6 mt-3 max-w-[896px] ${
              descriptionStyle || ""
            }`}
          >
            {description}
          </div>
        )}
      </div>
      <Wrapper className="flex gap-3 max-md-tab:flex-wrap max-lg-mb:hidden">
        {search && <Search />}
        {notification && <NotificationButton />}
        {home && (
          <Link
            href="/"
            className="bg-black items-center justify-center text-white text-base font-medium px-1 py-1 min-w-[39px] min-h-[39px]
  transition-all duration-300 hover:bg-[#ff4040] hover:text-white w-full flex gap-2 max-md-tab:flex-wrap rounded-lg"
          >
            <IconHome stroke="#fff" className="w-4 h-4 block" />
          </Link>
        )}
      </Wrapper>
    </Wrapper>
  );
};

export default HeaderHeading;

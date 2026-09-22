import Link from "next/link";

const Anchor = ({ to, children, className, buttonStyle }) => {
  buttonStyle = buttonStyle || "solid";
  let globalCSS =
    "font-satoshi font-medium text-15px flex justify-center items-center gap-2 rounded-md min-w-[113px] w-full min-h-[50px]";
  return (
    <>
      {buttonStyle === "solid" && (
        <Link
          href={to}
          className={`${globalCSS} px-4.5 bg-heading  text-white ${
            className || ""
          }`}
        >
          {children}
        </Link>
      )}
      {buttonStyle === "outlined" && (
        <Link
          href={to}
          className={`${globalCSS} px-4.5 bg-white  text-heading border border-heading  ${
            className || ""
          }`}
        >
          {children}
        </Link>
      )}
      {buttonStyle === "link" && (
        <Link
          href={to}
          className={`${globalCSS} text-heading  ${className || ""}`}
        >
          {children}
        </Link>
      )}
    </>
  );
};

export default Anchor;

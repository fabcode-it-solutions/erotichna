const IconPasswordVisibility = ({ className, onClick }) => {
  return (
    <svg
      onClick={onClick ? onClick : ""}
      className={className || ""}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12.3279" cy="11.4997" r="2.79662" stroke="#ABABAB" />
      <path
        d="M21.6128 11.5002C21.6128 11.5002 17.2746 16.9575 12.3279 16.9575C7.38114 16.9575 3.04297 11.5002 3.04297 11.5002C3.04297 11.5002 7.38114 6.04297 12.3279 6.04297C17.2746 6.04297 21.6128 11.5002 21.6128 11.5002Z"
        stroke="#ABABAB"
      />
    </svg>
  );
};

export default IconPasswordVisibility;

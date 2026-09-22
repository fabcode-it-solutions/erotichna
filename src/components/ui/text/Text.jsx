const Text = ({children, className}) => {
    return (
      <p className={" leading-[132.2%] antialiased text-base font-satoshi tracking-[-0.16px] font-normal " + (className || "" ) }>
          {children}
      </p>
    );
  }
  
  export default Text;
  
  
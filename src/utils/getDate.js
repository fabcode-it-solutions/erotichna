export const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  
  export const getFormattedPublishDate = (customDate) => {    
    const date = new Date(customDate);
    var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = String(date.getDate()).padStart(2, '0');
    return `${mS[month]} ${day}, ${year}`;
  };
  
  
  export const formatDate = (isoString) => {
    const date = new Date(isoString);
  
    // Get day with ordinal suffix (1st, 2nd, 3rd, etc.)
    const day = date.getDate();
    const ordinalSuffix = (n) => {
      if (n > 3 && n < 21) return "th"; // 4-20th
      switch (n % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };
  
    // Get month abbreviation
    const monthAbbreviations = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthAbbreviations[date.getMonth()];
  
    // Get full year
    const year = date.getFullYear();
  
    // Format hours and minutes
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
  
    return `${day}${ordinalSuffix(day)} ${month}. ${year} ${hours}:${minutes}${period}`;
  };
  

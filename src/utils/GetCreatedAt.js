export const GetCreatedAt = (customDate, hideCreated) => {
  const todayDate = new Date();
  const date = new Date(customDate);

  const diffYears = todayDate.getFullYear() - date.getFullYear();
  if (diffYears > 0)
    return `${hideCreated ? '' : 'Created'} ${diffYears} year${diffYears === 1 ? "" : "s"} ago`;

  const diffMonths = todayDate.getMonth() - date.getMonth() + diffYears * 12;
  if (diffMonths > 0)
    return `${hideCreated ? '' : 'Created'} ${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor((todayDate - date) / (1000 * 60 * 60 * 24));
  if (diffDays > 0)
    return `${hideCreated ? '' : 'Created'} ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor((todayDate - date) / (1000 * 60 * 60));
  if (diffHours > 0)
    return `${hideCreated ? '' : 'Created'} ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffMinutes = Math.floor((todayDate - date) / (1000 * 60));
  return `${hideCreated ? '' : 'Created'} ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
};

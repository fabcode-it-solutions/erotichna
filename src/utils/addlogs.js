export const addLogs = async (section) => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/admin/logs`,
      {
        method: "POST",
        body: JSON.stringify(section),
      }
    );
    const data = await response.json();
    if (!data.error) {
    }
  } catch (error) {
    console.error(`Error fetching ${section} data:`, error);
  }
};

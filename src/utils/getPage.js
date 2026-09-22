export const getPageContent = async (handle) => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/admin/pages?handle=${handle}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const result = await response.json();
    if (!result.error) {
      return result.result;
    }
  } catch (error) {
  } finally {
  }
};

export const getPages = async (url, limit, skip, sort, order) => {
  try {
    const response = await fetch(
      `${url}/api/admin/pages/all?limit=${limit || 10}&skip=${skip || 0}&sort=${
        sort || "createdAt"
      }&order=${order || "desc"}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    const result = await response.json();
    if (!result.error) {
      return result.result;
    }
  } catch (error) {
  } finally {
  }
};

export const getHomeSEO = async (section) => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/admin/homepage?section=${section}`
    );
    const data = await response.json();
    if (!data.error) {
      return data.data.seo;
    }
  } catch (error) {
    console.error(`Error fetching ${section} data:`, error);
  }
};

export const getModelSEO = async (id) => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/admin/models/seo?id=${id}`
    );
    const data = await response.json();
    if (!data.error) {
      return data;
    }
  } catch (error) {
    console.error(`Error fetching ${id} data:`, error);
  }
};

export const getVideoSEO = async (id) => {
  try {
    const response = await fetch(
      `${
        process.env.NODE_ENV != "production"
          ? process.env.SITE_URL
          : "https://erotichna.com"
      }/api/admin/post/seo?id=${id}`
    );
    const data = await response.json();
    if (!data.error) {
      return data;
    }
  } catch (error) {
    console.error(`Error fetching ${id} data:`, error);
  }
};

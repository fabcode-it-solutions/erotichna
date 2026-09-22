import { v4 as uuidv4 } from "uuid";
export const uploadImage = async (name, file, path) => {
  const uniqueId = uuidv4();
  const response = await fetch(
    `${
      process.env.NODE_ENV != "production"
        ? process.env.SITE_URL
        : "https://erotichna.com"
    }/api/admin/upload`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: uniqueId + "_" + name,
        fileContent: file,
        path: path,
      }),
    }
  );

  const result = await response.json();
  return result;
};

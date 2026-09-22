import crypto from "crypto";
export function generateBunnyToken(filePath, expirySeconds = 3600) {
  const secretKey = process.env.BUNNY_AUTH_TOKEN;
  console.log(secretKey);

  const expires = Math.floor(Date.now() / 1000) + expirySeconds;
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(filePath + expires)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return { token: hash, expires };
}

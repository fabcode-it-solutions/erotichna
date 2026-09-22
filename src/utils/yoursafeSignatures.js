import crypto from "crypto";

const BRAND_BASE =
  process.env.FLEXPAY_BRAND_BASE || "https://secure.verotel.com";
const WEBSITE_ID = process.env.YF_SHOP_ID; // your website/shop ID
const SIGNATURE_KEY = process.env.YF_SIGNATURE_KEY; // from FlexPay dashboard

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}
function sha1Hex(s) {
  return crypto.createHash("sha1").update(s, "utf8").digest("hex");
}

function joinForSig(sigKey, params) {
  const keys = Object.keys(params).sort();
  return [sigKey, ...keys.map((k) => `${k}=${String(params[k]).trim()}`)].join(
    ":"
  );
}

/**
 * LEGACY cancel (email-style link)
 * Example URL: https://secure.verotel.com/cancel?sale_id=59817854&website=134686&signature=<sha256>
 */
export function buildCancelUrlClassic(saleId) {
  const params = { sale_id: String(saleId), website: String(WEBSITE_ID) };
  const base = joinForSig(SIGNATURE_KEY, params);
  const signature = sha256Hex(base);
  return `${BRAND_BASE}/cancel?${new URLSearchParams({
    ...params,
    signature,
  }).toString()}`;
}

/**
 * Modern v3.4 cancel-subscription
 * Example URL: https://secure.verotel.com/cancel-subscription?saleID=59817854&shopID=134686&version=3.4&signature=<sha1>
 */
export function buildCancelUrlV34(saleId, version = "3.4") {
  const params = {
    saleID: String(saleId),
    shopID: String(WEBSITE_ID),
    version,
  };
  const base = joinForSig(SIGNATURE_KEY, params);
  const signature = sha1Hex(base);
  return `${BRAND_BASE}/cancel-subscription?${new URLSearchParams({
    ...params,
    signature,
  }).toString()}`;
}

/** Debug helpers (print the base + signature) */
export function debugClassicBase(saleId) {
  const base = `${SIGNATURE_KEY}:sale_id=${String(
    saleId
  ).trim()}:website=${String(WEBSITE_ID).trim()}`;
  return { base, sha256: sha256Hex(base) };
}
export function debugV34Base(saleId, version = "3.4") {
  const base = `${SIGNATURE_KEY}:saleID=${String(
    saleId
  ).trim()}:shopID=${String(WEBSITE_ID).trim()}:version=${version}`;
  return { base, sha1: sha1Hex(base) };
}

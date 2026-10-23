import { timingSafeEqual } from "node:crypto";

// HTTP Basic Auth; any username is accepted, only KITCHEN_PASSWORD matters
export const isKitchenAuthorized = (authorization: string | null) => {
  const password = process.env.KITCHEN_PASSWORD;
  if (!password || !authorization?.startsWith("Basic ")) {
    return false;
  }
  const decoded = Buffer.from(authorization.slice(6), "base64").toString();
  const separator = decoded.indexOf(":");
  if (separator === -1) {
    return false;
  }
  const given = Buffer.from(decoded.slice(separator + 1));
  const expected = Buffer.from(password);
  return given.length === expected.length && timingSafeEqual(given, expected);
};

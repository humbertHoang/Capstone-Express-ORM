export const cookieParser = (cookieHeader) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [key, value] = cookie.trim().split("=");
    cookies[key] = decodeURIComponent(value);
    return cookies;
  }, {});
};

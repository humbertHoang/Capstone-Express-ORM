import validator from "validator";

export function normalizeEmail(email) {
  return validator.normalizeEmail(email);
}

export function isValidEmail(email) {
  return validator.isEmail(email);
}

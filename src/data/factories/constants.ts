export const ITEMS = {
  BACKPACK: "Sauce Labs Backpack",
  BIKE_LIGHT: "Sauce Labs Bike Light",
} as const;

export const URLS = {
  INVENTORY: /inventory\.html/,
  CART: /cart\.html/,
} as const;

export const ERRORS = {
  USERNAME_REQUIRED: "Username is required",
  PASSWORD_REQUIRED: "Password is required",
  USERNAME_PASSWORD_MISMATCH: "Username and password do not match",
  LOCKED_OUT: "locked out",
} as const;

export const INVALID_CREDS = {
  USERNAME: "not_a_user",
  PASSWORD: "bad_pass",
} as const;

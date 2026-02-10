export const SORT_VALUES = {
  NAME_Z_TO_A: "za",
  PRICE_LOW_TO_HIGH: "lohi",
} as const;

export type SortValue = (typeof SORT_VALUES)[keyof typeof SORT_VALUES];

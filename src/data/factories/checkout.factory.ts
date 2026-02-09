import { uniqueId } from "./ids";

export function checkoutUserData(runId: string) {
  return {
    firstName: uniqueId(`fn-${runId}`),
    lastName: uniqueId(`ln-${runId}`),
    postalCode: String(Math.floor(10000 + Math.random() * 89999)),
  };
}

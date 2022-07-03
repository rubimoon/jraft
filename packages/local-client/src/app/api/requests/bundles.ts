import { requests } from "./base";

export const Bundles = {
  fetchPkg: (path: any) => requests.get<any>(path),
};

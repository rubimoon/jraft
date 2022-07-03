import * as esbuild from "esbuild-wasm";
import { UNPKG_URL } from "../constants";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^(index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, UNPKG_URL + args.resolveDir + "/").href,
        };
      });
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `${UNPKG_URL}/${args.path}`,
        };
      });
    },
  };
};

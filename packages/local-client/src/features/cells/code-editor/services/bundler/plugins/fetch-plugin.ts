import * as esbuild from "esbuild-wasm";
import localforage from "localforage";
import { agent } from "../../../../../../app/api/agent";
import { generateCssContents } from "../utils/templates";

export const fetchPlugin = (inputCode: string) => {
  // use localforage to manipulate IndexedDB inside the browser
  const fileCache = localforage.createInstance({
    name: "filecache",
  });

  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^(index\.js)$/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const { data, request } = await agent.Bundles.fetchPkg(args.path);
        // const escaped = data
        //   .replace(/\n/g, "")
        //   .replace(/"/g, '\\"')
        //   .replace(/'/g, "\\'");

        // const contents = `
        // const style = document.createElement('style');
        // style.innerText = '${escaped}';
        // document.head.appendChild(style);
        // `;
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: generateCssContents(data),
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await agent.Bundles.fetchPkg(args.path);
        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};

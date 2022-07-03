import * as esbuild from "esbuild-wasm";
import { BundleResult } from "../../models/bundle";
import { WASM_URL } from "./constants";
import { fetchPlugin } from "./plugins/fetch-plugin";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";

let service: esbuild.Service;
const bundle = async (rawCode: string): Promise<BundleResult> => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: WASM_URL,
    });
  }

  try {
    //index.js here is what user types into the text area.
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
      jsxFactory: "_React.createElement",
      jsxFragment: "_React.Fragment",
    });
    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (error: any) {
    return {
      code: "",
      err: error.message,
    };
  }
};

export default bundle;

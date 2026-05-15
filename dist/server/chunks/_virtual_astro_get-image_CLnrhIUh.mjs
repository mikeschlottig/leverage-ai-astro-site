globalThis.process ??= {};
globalThis.process.env ??= {};
import { g as getImage$1 } from "./deterministic-string_BW34V1Mg.mjs";
const imageConfig = { "endpoint": { "route": "/_image", "entrypoint": "@astrojs/cloudflare/image-passthrough-endpoint" }, "service": { "entrypoint": "@astrojs/cloudflare/image-service-workerd", "config": {} }, "domains": [], "remotePatterns": [], "responsiveStyles": false };
Object.defineProperty(imageConfig, "assetQueryParams", {
  value: void 0,
  enumerable: false,
  configurable: true
});
const getImage = async (options) => await getImage$1(options, imageConfig);
export {
  getImage,
  imageConfig
};

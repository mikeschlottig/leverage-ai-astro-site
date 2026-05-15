globalThis.process ??= {};
globalThis.process.env ??= {};
import { e as renderElement, g as generateCspDigest, s as spreadAttributes, u as unescapeHTML, r as renderTemplate, f as removeBase, i as isRemotePath, h as unflatten, o as object, j as date, k as array, A as AstroError, R as RenderUndefinedEntryError, U as UnknownContentCollectionError, l as escape, n as string, p as prependForwardSlash, q as createHeadAndContent, c as renderComponent } from "./worker-entry_D9jsJv2k.mjs";
import { c as createComponent } from "./astro-component_P2T-B9sK.mjs";
import { V as VALID_INPUT_FORMATS } from "./consts_DCUS4NoK.mjs";
function renderScriptElement({ props, children }) {
  return renderElement("script", {
    props,
    children
  });
}
function renderUniqueStylesheet(result, sheet) {
  if (sheet.type === "external") {
    if (Array.from(result.styles).some((s2) => s2.props.href === sheet.src)) return "";
    return renderElement("link", { props: { rel: "stylesheet", href: sheet.src }, children: "" });
  }
  if (sheet.type === "inline") {
    if (Array.from(result.styles).some((s2) => s2.children.includes(sheet.content))) return "";
    return renderElement("style", { props: {}, children: sheet.content });
  }
}
var e = (e2) => Object.prototype.toString.call(e2), t = (e2) => ArrayBuffer.isView(e2) && !(e2 instanceof DataView), o = (t2) => "[object Date]" === e(t2), n = (t2) => "[object RegExp]" === e(t2), r = (t2) => "[object Error]" === e(t2), s = (t2) => "[object Boolean]" === e(t2), l = (t2) => "[object Number]" === e(t2), i = (t2) => "[object String]" === e(t2), c = Array.isArray, u = Object.getOwnPropertyDescriptor, a = Object.prototype.propertyIsEnumerable, f = Object.getOwnPropertySymbols, p = Object.prototype.hasOwnProperty, h = Object.keys;
function d(e2) {
  const t2 = h(e2), o2 = f(e2);
  for (let n2 = 0; n2 < o2.length; n2++) a.call(e2, o2[n2]) && t2.push(o2[n2]);
  return t2;
}
function b(e2, t2) {
  return !u(e2, t2)?.writable;
}
function y(e2, u2) {
  if ("object" == typeof e2 && null !== e2) {
    let a2;
    if (c(e2)) a2 = [];
    else if (o(e2)) a2 = new Date(e2.getTime ? e2.getTime() : e2);
    else if (n(e2)) a2 = new RegExp(e2);
    else if (r(e2)) a2 = { message: e2.message };
    else if (s(e2) || l(e2) || i(e2)) a2 = Object(e2);
    else {
      if (t(e2)) return e2.slice();
      a2 = Object.create(Object.getPrototypeOf(e2));
    }
    const f2 = u2.includeSymbols ? d : h;
    for (const t2 of f2(e2)) a2[t2] = e2[t2];
    return a2;
  }
  return e2;
}
var g = { includeSymbols: false, immutable: false };
function m(e2, t2, o2 = g) {
  const n2 = [], r2 = [];
  let s2 = true;
  const l2 = o2.includeSymbols ? d : h, i2 = !!o2.immutable;
  return (function e3(u2) {
    const a2 = i2 ? y(u2, o2) : u2, f2 = {};
    let h2 = true;
    const d2 = { node: a2, node_: u2, path: [].concat(n2), parent: r2[r2.length - 1], parents: r2, key: n2[n2.length - 1], isRoot: 0 === n2.length, level: n2.length, circular: void 0, isLeaf: false, notLeaf: true, notRoot: true, isFirst: false, isLast: false, update: function(e4, t3 = false) {
      d2.isRoot || (d2.parent.node[d2.key] = e4), d2.node = e4, t3 && (h2 = false);
    }, delete: function(e4) {
      delete d2.parent.node[d2.key], e4 && (h2 = false);
    }, remove: function(e4) {
      c(d2.parent.node) ? d2.parent.node.splice(d2.key, 1) : delete d2.parent.node[d2.key], e4 && (h2 = false);
    }, keys: null, before: function(e4) {
      f2.before = e4;
    }, after: function(e4) {
      f2.after = e4;
    }, pre: function(e4) {
      f2.pre = e4;
    }, post: function(e4) {
      f2.post = e4;
    }, stop: function() {
      s2 = false;
    }, block: function() {
      h2 = false;
    } };
    if (!s2) return d2;
    function g2() {
      if ("object" == typeof d2.node && null !== d2.node) {
        d2.keys && d2.node_ === d2.node || (d2.keys = l2(d2.node)), d2.isLeaf = 0 === d2.keys.length;
        for (let e4 = 0; e4 < r2.length; e4++) if (r2[e4].node_ === u2) {
          d2.circular = r2[e4];
          break;
        }
      } else d2.isLeaf = true, d2.keys = null;
      d2.notLeaf = !d2.isLeaf, d2.notRoot = !d2.isRoot;
    }
    g2();
    const m2 = t2(d2, d2.node);
    if (void 0 !== m2 && d2.update && d2.update(m2), f2.before && f2.before(d2, d2.node), !h2) return d2;
    if ("object" == typeof d2.node && null !== d2.node && !d2.circular) {
      r2.push(d2), g2();
      for (const [t3, o3] of Object.entries(d2.keys ?? [])) {
        n2.push(o3), f2.pre && f2.pre(d2, d2.node[o3], o3);
        const r3 = e3(d2.node[o3]);
        i2 && p.call(d2.node, o3) && !b(d2.node, o3) && (d2.node[o3] = r3.node), r3.isLast = !!d2.keys?.length && +t3 == d2.keys.length - 1, r3.isFirst = 0 == +t3, f2.post && f2.post(d2, r3), n2.pop();
      }
      r2.pop();
    }
    return f2.after && f2.after(d2, d2.node), d2;
  })(e2).node;
}
var j = class {
  #e;
  #t;
  constructor(e2, t2 = g) {
    this.#e = e2, this.#t = t2;
  }
  get(e2) {
    let t2 = this.#e;
    for (let o2 = 0; t2 && o2 < e2.length; o2++) {
      const n2 = e2[o2];
      if (!p.call(t2, n2) || !this.#t.includeSymbols && "symbol" == typeof n2) return;
      t2 = t2[n2];
    }
    return t2;
  }
  has(e2) {
    let t2 = this.#e;
    for (let o2 = 0; t2 && o2 < e2.length; o2++) {
      const n2 = e2[o2];
      if (!p.call(t2, n2) || !this.#t.includeSymbols && "symbol" == typeof n2) return false;
      t2 = t2[n2];
    }
    return true;
  }
  set(e2, t2) {
    let o2 = this.#e, n2 = 0;
    for (n2 = 0; n2 < e2.length - 1; n2++) {
      const t3 = e2[n2];
      p.call(o2, t3) || (o2[t3] = {}), o2 = o2[t3];
    }
    return o2[e2[n2]] = t2, t2;
  }
  map(e2) {
    return m(this.#e, e2, { immutable: true, includeSymbols: !!this.#t.includeSymbols });
  }
  forEach(e2) {
    return this.#e = m(this.#e, e2, this.#t), this.#e;
  }
  reduce(e2, t2) {
    const o2 = 1 === arguments.length;
    let n2 = o2 ? this.#e : t2;
    return this.forEach(((t3, r2) => {
      t3.isRoot && o2 || (n2 = e2(t3, n2, r2));
    })), n2;
  }
  paths() {
    const e2 = [];
    return this.forEach(((t2) => {
      e2.push(t2.path);
    })), e2;
  }
  nodes() {
    const e2 = [];
    return this.forEach(((t2) => {
      e2.push(t2.node);
    })), e2;
  }
  clone() {
    const e2 = [], o2 = [], n2 = this.#t;
    return t(this.#e) ? this.#e.slice() : (function t2(r2) {
      for (let t3 = 0; t3 < e2.length; t3++) if (e2[t3] === r2) return o2[t3];
      if ("object" == typeof r2 && null !== r2) {
        const s2 = y(r2, n2);
        e2.push(r2), o2.push(s2);
        const l2 = n2.includeSymbols ? d : h;
        for (const e3 of l2(r2)) s2[e3] = t2(r2[e3]);
        return e2.pop(), o2.pop(), s2;
      }
      return r2;
    })(this.#e);
  }
};
function createSvgComponent({ meta, attributes, children, styles }) {
  const hasStyles = styles.length > 0;
  const Component = createComponent({
    async factory(result, props) {
      const normalizedProps = normalizeProps(attributes, props);
      if (hasStyles && result.cspDestination) {
        for (const style of styles) {
          const hash = await generateCspDigest(style, result.cspAlgorithm);
          result._metadata.extraStyleHashes.push(hash);
        }
      }
      return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
    },
    propagation: hasStyles ? "self" : "none"
  });
  Object.defineProperty(Component, "toJSON", {
    value: () => meta,
    enumerable: false
  });
  return Object.assign(Component, meta);
}
const ATTRS_TO_DROP = ["xmlns", "xmlns:xlink", "version"];
const DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
  for (const attr of ATTRS_TO_DROP) {
    delete attributes[attr];
  }
  return attributes;
}
function normalizeProps(attributes, props) {
  return dropAttributes({ ...DEFAULT_ATTRS, ...attributes, ...props });
}
const CONTENT_IMAGE_FLAG = "astroContentImageFlag";
const IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}
class ImmutableDataStore {
  _collections = /* @__PURE__ */ new Map();
  constructor() {
    this._collections = /* @__PURE__ */ new Map();
  }
  get(collectionName, key) {
    return this._collections.get(collectionName)?.get(String(key));
  }
  entries(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.entries()];
  }
  values(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.values()];
  }
  keys(collectionName) {
    const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
    return [...collection.keys()];
  }
  has(collectionName, key) {
    const collection = this._collections.get(collectionName);
    if (collection) {
      return collection.has(String(key));
    }
    return false;
  }
  hasCollection(collectionName) {
    return this._collections.has(collectionName);
  }
  collections() {
    return this._collections;
  }
  /**
   * Attempts to load a DataStore from the virtual module.
   * This only works in Vite.
   */
  static async fromModule() {
    try {
      const data = await import("./_astro_data-layer-content_CONh6wd3.mjs");
      if (data.default instanceof Map) {
        return ImmutableDataStore.fromMap(data.default);
      }
      const map = unflatten(data.default);
      return ImmutableDataStore.fromMap(map);
    } catch {
    }
    return new ImmutableDataStore();
  }
  static async fromMap(data) {
    const store = new ImmutableDataStore();
    store._collections = data;
    return store;
  }
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    },
    set: (store) => {
      instance = store;
    }
  };
}
const globalDataStore = dataStoreSingleton();
object({
  tags: array(string()).optional(),
  lastModified: date().optional()
});
function createGetCollection({
  liveCollections: liveCollections2
}) {
  return async function getCollection2(collection, filter) {
    if (collection in liveCollections2) {
      throw new AstroError({
        ...UnknownContentCollectionError,
        message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
      });
    }
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await import("./content-assets_CL5hQMHo.mjs");
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
  };
}
const CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
  const { default: imageAssetMap } = await import("./content-assets_CL5hQMHo.mjs");
  const imageObjects = /* @__PURE__ */ new Map();
  const { getImage } = await import("./_virtual_astro_get-image_CLnrhIUh.mjs");
  for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) {
    try {
      const decodedImagePath = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      let image;
      if (URL.canParse(decodedImagePath.src)) {
        image = await getImage(decodedImagePath);
      } else {
        const id = imageSrcToImportId(decodedImagePath.src, fileName);
        const imported = imageAssetMap.get(id);
        if (!id || imageObjects.has(id) || !imported) {
          continue;
        }
        image = await getImage({ ...decodedImagePath, src: imported });
      }
      imageObjects.set(imagePath, image);
    } catch {
      throw new Error(`Failed to parse image reference: ${imagePath}`);
    }
  }
  return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
    const image = imageObjects.get(imagePath);
    if (!image) {
      return full;
    }
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute,
      // This attribute is used by the toolbar audit
      ...{}
    }).map(([key, value]) => value ? `${key}="${escape(value)}"` : "").join(" ");
  });
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new j(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        if (imported.__svgData) {
          const { __svgData: svgData, ...meta } = imported;
          ctx.update(createSvgComponent({ meta, ...svgData }));
        } else {
          ctx.update(imported);
        }
      } else {
        ctx.update(src);
      }
    }
  });
}
async function renderEntry(entry) {
  if (!entry) {
    throw new AstroError(RenderUndefinedEntryError);
  }
  if (entry.deferredRender) {
    try {
      const { default: contentModules } = await import("./content-modules_Uxt4s84c.mjs");
      const renderEntryImport = contentModules.get(entry.filePath);
      return render({
        collection: "",
        id: entry.id,
        renderEntryImport
      });
    } catch (e2) {
      console.error(e2);
    }
  }
  const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
  const Content = createComponent(() => renderTemplate`${unescapeHTML(html)}`);
  return {
    Content,
    headings: entry?.rendered?.metadata?.headings ?? [],
    remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: isRemotePath(link) ? link : prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}
const liveCollections = {};
const getCollection = createGetCollection({
  liveCollections
});
export {
  getCollection as g,
  renderEntry as r
};

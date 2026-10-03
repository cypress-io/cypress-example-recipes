var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// dist/clipboard.js
function createNode(text) {
  const node = document.createElement("pre");
  node.style.width = "1px";
  node.style.height = "1px";
  node.style.position = "fixed";
  node.style.top = "5px";
  node.textContent = text;
  return node;
}
__name(createNode, "createNode");
function normalizeText(text) {
  return text.replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ").replace(/[\u200B-\u200D\u2060\uFEFF\u180E]/g, "");
}
__name(normalizeText, "normalizeText");
function copySelection(node) {
  const selection = getSelection();
  if (selection == null) {
    return Promise.reject(new Error());
  }
  selection.removeAllRanges();
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.addRange(range);
  document.execCommand("copy");
  selection.removeAllRanges();
  return Promise.resolve();
}
__name(copySelection, "copySelection");
function copyNode(node) {
  return copyText(node.textContent || "");
}
__name(copyNode, "copyNode");
function copyText(text) {
  const normalized = normalizeText(text);
  if ("clipboard" in navigator) {
    return navigator.clipboard.writeText(normalized);
  }
  const body = document.body;
  if (!body) {
    return Promise.reject(new Error());
  }
  const node = createNode(normalized);
  body.appendChild(node);
  copySelection(node);
  body.removeChild(node);
  return Promise.resolve();
}
__name(copyText, "copyText");

// dist/clipboard-copy-element.js
async function copy(button) {
  const id = button.getAttribute("for");
  const text = button.getAttribute("value");
  function trigger() {
    button.dispatchEvent(new CustomEvent("clipboard-copy", { bubbles: true }));
  }
  __name(trigger, "trigger");
  if (button.getAttribute("aria-disabled") === "true") {
    return;
  }
  if (text) {
    await copyText(text);
    trigger();
  } else if (id) {
    const root2 = "getRootNode" in Element.prototype ? button.getRootNode() : button.ownerDocument;
    if (!(root2 instanceof Document || "ShadowRoot" in window && root2 instanceof ShadowRoot))
      return;
    const node = root2.getElementById(id);
    if (node) {
      await copyTarget(node);
      trigger();
    }
  }
}
__name(copy, "copy");
function copyTarget(content) {
  if (content instanceof HTMLInputElement || content instanceof HTMLTextAreaElement) {
    return copyText(content.value);
  } else if (content instanceof HTMLAnchorElement && content.hasAttribute("href")) {
    return copyText(content.href);
  } else {
    return copyNode(content);
  }
}
__name(copyTarget, "copyTarget");
function clicked(event) {
  const button = event.currentTarget;
  if (button instanceof HTMLElement) {
    copy(button);
  }
}
__name(clicked, "clicked");
function keydown(event) {
  if (event.key === " " || event.key === "Enter") {
    const button = event.currentTarget;
    if (button instanceof HTMLElement) {
      event.preventDefault();
      copy(button);
    }
  }
}
__name(keydown, "keydown");
function focused(event) {
  ;
  event.currentTarget.addEventListener("keydown", keydown);
}
__name(focused, "focused");
function blurred(event) {
  ;
  event.currentTarget.removeEventListener("keydown", keydown);
}
__name(blurred, "blurred");
var ClipboardCopyElement = class extends HTMLElement {
  static {
    __name(this, "ClipboardCopyElement");
  }
  static define(tag = "clipboard-copy", registry = customElements) {
    registry.define(tag, this);
    return this;
  }
  constructor() {
    super();
    this.addEventListener("click", clicked);
    this.addEventListener("focus", focused);
    this.addEventListener("blur", blurred);
  }
  connectedCallback() {
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "button");
    }
  }
  get value() {
    return this.getAttribute("value") || "";
  }
  set value(text) {
    this.setAttribute("value", text);
  }
};

// dist/clipboard-copy-element-define.js
var root = typeof globalThis !== "undefined" ? globalThis : window;
try {
  root.ClipboardCopyElement = ClipboardCopyElement.define();
} catch (e) {
  if (!(root.DOMException && e instanceof DOMException && e.name === "NotSupportedError") && !(e instanceof ReferenceError)) {
    throw e;
  }
}

// dist/index.js
var index_default = ClipboardCopyElement;
export {
  ClipboardCopyElement,
  index_default as default
};

// src/lib/ericchase/Platform/Web/DOM/MutationObserver/ElementAdded.ts
class ElementAddedObserver {
  constructor({
    source = document.documentElement,
    options = { subtree: true },
    selector,
    includeExistingElements = true
  }) {
    this.mutationObserver = new MutationObserver((mutationRecords) => {
      for (const record of mutationRecords) {
        if (record.target instanceof Element && record.target.matches(selector)) {
          this.send(record.target);
        }
        const treeWalker = document.createTreeWalker(record.target, NodeFilter.SHOW_ELEMENT);
        while (treeWalker.nextNode()) {
          if (treeWalker.currentNode.matches(selector)) {
            this.send(treeWalker.currentNode);
          }
        }
      }
    });
    this.mutationObserver.observe(source, {
      childList: true,
      subtree: options.subtree ?? true
    });
    if (includeExistingElements === true) {
      const treeWalker = document.createTreeWalker(document, NodeFilter.SHOW_ELEMENT);
      while (treeWalker.nextNode()) {
        if (treeWalker.currentNode.matches(selector)) {
          this.send(treeWalker.currentNode);
        }
      }
    }
  }
  disconnect() {
    this.mutationObserver.disconnect();
    for (const callback of this.subscriptionSet) {
      this.subscriptionSet.delete(callback);
    }
  }
  subscribe(callback) {
    this.subscriptionSet.add(callback);
    let abort = false;
    for (const element of this.matchSet) {
      callback(element, () => {
        this.subscriptionSet.delete(callback);
        abort = true;
      });
      if (abort)
        return () => {};
    }
    return () => {
      this.subscriptionSet.delete(callback);
    };
  }
  mutationObserver;
  matchSet = new Set;
  subscriptionSet = new Set;
  send(element) {
    if (!this.matchSet.has(element)) {
      this.matchSet.add(element);
      for (const callback of this.subscriptionSet) {
        callback(element, () => {
          this.subscriptionSet.delete(callback);
        });
      }
    }
  }
}

// src/styles.compiled.css
var styles_compiled_default = `div:not(#_)[class*=channelTextArea_] {
  margin-bottom: var(--space-xs);
}

nav:not(#_)[aria-label="Servers sidebar"] {
  width: 64px;
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] {
  width: 64px;
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=itemsContainer_] > div {
  gap: 8px !important;
}

nav:not(#_)[aria-label="Servers sidebar"] div[aria-label=Servers] {
  gap: 8px !important;
}

nav:not(#_)[aria-label="Servers sidebar"] div[aria-label=Servers] > div[class*=wrapper_] span[class*=expandedFolderBackground_] {
  background-color: rgba(255, 255, 255, 0.1254901961);
  mix-blend-mode: difference;
  left: 6px;
  width: 52px;
}

nav:not(#_)[aria-label="Servers sidebar"] div[aria-label=Servers] > div[class*=wrapper_] > ul {
  gap: 8px !important;
  height: unset !important;
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] mask {
  display: none;
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] div[class*=wrapper_]:has(svg),
nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] foreignObject,
nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] foreignObject > div,
nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] foreignObject > div > div,
nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] foreignObject > div > img {
  width: 48px;
  height: 48px;
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] svg {
  top: unset;
  left: unset;
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] foreignObject > div {
  clip-path: circle(50%);
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=listItem_] foreignObject > div[class*=selected_] {
  clip-path: inset(0 round 16px);
}

section:not(#_)[aria-label="User area"] > div[class*=container_] {
  height: 52px;
}

div:not(#_)[class*=channelTextArea_] div[class*=contents_],
div:not(#_)[class*=channelTextArea_] div[class*=lottieIcon_],
div:not(#_)[class*=channelTextArea_] div[class*=spriteContainer_],
div:not(#_)[class*=channelTextArea_] svg {
  width: 24px !important;
  height: 24px !important;
}

div:not(#_)[class*=channelTextArea_] div[class*=spriteContainer_] > div[class*=sprite_] {
  scale: 1.3333333333;
  transform-origin: top left;
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=folderIconWrapper_]:has(> div[class*=closedFolderIconWrapper_]) {
  background-color: #5865f2 !important;
}

nav:not(#_)[aria-label="Servers sidebar"] div:has(> div[class*=folderIconWrapper_] > div[class*=closedFolderIconWrapper_]) {
  clip-path: inset(0 round 16px);
}

nav:not(#_)[aria-label="Servers sidebar"] div[class*=folderIconWrapper_] > div[class*=closedFolderIconWrapper_] > div {
  border-radius: 50% !important;
}`;

// src/mod.module.tsx
function setup() {
  if (document && "adoptedStyleSheets" in document) {
    let styles = styles_compiled_default;
    switch (getTheme()) {
      case "light":
        styles = `html:not(#_){--text-normal: #000000;}

${styles}`;
        break;
      case "dark":
      case "darker":
      case "midnight":
        styles = `html:not(#_){--text-normal: #EEEEEE;}

${styles}`;
        break;
    }
    const stylesheet = new CSSStyleSheet;
    stylesheet.replaceSync(styles);
    document.adoptedStyleSheets.push(stylesheet);
    console.log("Mod--Discord-Client: Client mods applied.");
  } else {
    console.error("Mod--Discord-Client: Failed to apply client mods.");
  }
}
setTimeout(setup, 1000);
var observer = new ElementAddedObserver({ selector: 'div[class*="listItem_"] svg' });
observer.subscribe((element) => {
  if ("viewBox" in element) {
    const viewBox = element.viewBox;
    viewBox.baseVal.x = 0;
    viewBox.baseVal.y = 0;
  }
});
function getTheme() {
  const ThemeStore = localStorage.getItem("ThemeStore");
  if (ThemeStore !== null) {
    return JSON.parse(ThemeStore)._state.theme;
  }
  return "dark";
}

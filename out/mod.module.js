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

// src/styles.css
var styles_default = `div:not(#_)[class*="channelTextArea_"] {
  /* fix the awkward bottom margin of the chat input bar */
  margin-bottom: var(--space-xs);
}

nav:not(#_)[aria-label="Servers sidebar"] {
  /* shrink the width of the server sidebar */
  width: 60px;

  & div[class*="itemsContainer_"] > div {
    /* shrink gap spacing between server icons */
    gap: 4px !important;
  }

  & div[aria-label="Servers"] {
    /* shrink gap spacing between server icons */
    gap: 4px !important;

    & > div[class*="wrapper_"] {
      span:not(#_)[class*="expandedFolderBackground_"] {
        /* make the folder background easier to see */
        background-color: #ffffff20;
        mix-blend-mode: difference;
        /* fix background layout for folders */
        left: 6px;
      }

      & > ul {
        /* shrink gap spacing between server icons in folders */
        gap: 4px !important;
        /* fix height issue for folders */
        height: unset !important;
      }
    }
  }

  & div[class*="listItem_"] {
    /* shrink the width of icon element */
    width: 60px;

    & mask {
      /* hide the server icon mask */
      display: none;
    }
    & div[class*="wrapper_"]:has(svg),
    & foreignObject,
    & foreignObject > div,
    & foreignObject > div > div,
    & foreignObject > div > img {
      /* fix all the sizes of the icon layout */
      width: 48px;
      height: 48px;
    }
    & svg {
      /* remove the offset in svg */
      top: unset;
      left: unset;
    }
    & foreignObject > div {
      /* return the server icons back to circles when they are not selected */
      clip-path: circle(50%);
    }
    & foreignObject > div[class*="selected_"] {
      /* give rounded rectangle to selected icons */
      clip-path: inset(0 round 16px);
    }
  }
}

/* fix a seemingly incorrect height of the user's sidebar button */
section:not(#_)[aria-label="User area"] > div[class*="container_"] {
  height: 52px;
}
`;

// src/mod.module.tsx
function setup() {
  if (document && "adoptedStyleSheets" in document) {
    let styles = styles_default;
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

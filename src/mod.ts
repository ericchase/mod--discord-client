const stylemods = `
div:not(#_)[class*=channelTextArea_] {
  margin-bottom: var(--space-xs);
}
div:not(#_)[class*=listItem_],
nav:not(#_)[aria-label="Servers sidebar"] {
  width: 58px;
}
div:not(#_)[class*=listItem_] foreignObject>div:not([class*=selected_]) {
  clip-path: circle(50%);
}
`;

let interval = 1000;
function main() {
  setTimeout(setup, interval);
}
function setup() {
  if (applyMods() === false) {
    interval += interval;
    setTimeout(setup, interval);
  }
}
function applyMods() {
  if (document && 'adoptedStyleSheets' in document) {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(stylemods);
    document.adoptedStyleSheets.push(stylesheet);
    console.log('Mod--Discord-Client: Client mods applied.');
    return true;
  }
  return false;
}
main();

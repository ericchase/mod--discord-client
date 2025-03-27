import { ElementAddedObserver } from './lib/ericchase/Platform/Web/DOM/MutationObserver/ElementAdded.js';
import styles from './styles.css' assert { type: 'text' };
function setup() {
  if (document && 'adoptedStyleSheets' in document) {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(styles);
    document.adoptedStyleSheets.push(stylesheet);
    console.log('Mod--Discord-Client: Client mods applied.');
  } else {
    console.error('Mod--Discord-Client: Failed to apply client mods.');
  }
}
setTimeout(setup, 1000);

const observer = new ElementAddedObserver({ selector: 'div[class*="listItem_"] svg' });
observer.subscribe((element) => {
  if ('viewBox' in element) {
    const viewBox: SVGAnimatedRect = element.viewBox as any;
    viewBox.baseVal.x = 0;
    viewBox.baseVal.y = 0;
  }
});

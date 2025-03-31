import { ElementAddedObserver } from './lib/ericchase/Platform/Web/DOM/MutationObserver/ElementAdded.js';
import imported_stylesheet from './styles.compiled.css' assert { type: 'text' };

// Note: If you change the Appearance > Theme setting, restart Discord for font
// colors to update.

function setup() {
  if (document && 'adoptedStyleSheets' in document) {
    let styles = imported_stylesheet;
    // change normal text color
    switch (getTheme()) {
      case 'light':
        styles = `html:not(#_){--text-normal: #000000;}\n\n${styles}`;
        break;
      case 'dark':
      case 'darker':
      case 'midnight':
        styles = `html:not(#_){--text-normal: #EEEEEE;}\n\n${styles}`;
        break;
    }
    // inject the styles
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

function getTheme() {
  const ThemeStore = localStorage.getItem('ThemeStore');
  if (ThemeStore !== null) {
    return JSON.parse(ThemeStore)._state.theme;
  }
  return 'dark';
}

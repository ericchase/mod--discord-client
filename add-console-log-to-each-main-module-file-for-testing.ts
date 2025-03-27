import { Path } from './src/lib/ericchase/Platform/FilePath.js';
import { globScan } from './src/lib/ericchase/Platform/Glob_Utility.js';
import { getPlatformProvider } from './src/lib/ericchase/Platform/PlatformProvider.js';

const platform = await getPlatformProvider('bun');

for (const path of await globScan(platform, Path('C:/Users/Chase/AppData/Local/Discord'), ['app*/**/*.js'], ['**/node_modules/**'])) {
  await platform.File.appendText(Path('C:/Users/Chase/AppData/Local/Discord', path), `\n\n\n console.log("!!!!! LOADED !!!!! ${Path(path).standard}");`);
}

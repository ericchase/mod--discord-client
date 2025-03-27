import { CPath, Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { globScan } from '../src/lib/ericchase/Platform/Glob_Utility.js';
import { getPlatformProvider } from '../src/lib/ericchase/Platform/PlatformProvider.js';
import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from './lib/Builder.js';

const logger = Logger(Step_InjectMods.name);

const modheader = '\n\n\n//**// CLIENT MOD START //**//\n\n\n';
const discordpath = await findDiscordPath();

export function Step_InjectMods(modpath: CPath | string): Step {
  return new CStep_InjectMods(Path(modpath));
}

class CStep_InjectMods implements Step {
  channel = logger.newChannel();

  constructor(readonly modpath: CPath) {}
  async end(builder: BuilderInternal) {}
  async run(builder: BuilderInternal) {
    if (discordpath !== undefined) {
      // modify the module file
      for (const rawpath of await globScan(builder.platform, discordpath, ['app*/modules/discord_voice-1/discord_voice/index.js'], [], true)) {
        const path = Path(rawpath);
        const text = await builder.platform.File.readText(path);
        const previous_index = text.indexOf(modheader);
        const original_text = previous_index !== -1 ? text.slice(0, previous_index) : text;
        await builder.platform.File.writeText(Path(path), `${original_text}${modheader}${await builder.getFile(this.modpath).getText()}`);
      }
    }
  }
}

async function findDiscordPath() {
  const platform = await getPlatformProvider('bun');

  // Windows
  try {
    if (process.env.LOCALAPPDATA !== undefined) {
      const path = Path(process.env.LOCALAPPDATA, 'Discord');
      await platform.Path.getStats(path);
      return path;
    }
  } catch (error) {}

  // Linux
  try {
    const path = Path('/opt/Discord/');
    await platform.Path.getStats(path);
    return path;
  } catch (error) {}

  // Mac
  try {
    const path = Path('/Applications/Discord.app');
    await platform.Path.getStats(path);
    return path;
  } catch (error) {}

  return undefined;
}

import { Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { globScan } from '../src/lib/ericchase/Platform/Glob_Utility.js';
import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from './lib/Builder.js';

const logger = Logger(Step_InjectMods.name);

const modheader = '\n\n\n//**// CLIENT MOD START //**//\n\n\n';

export function Step_InjectMods(): Step {
  return new CStep_InjectMods();
}

class CStep_InjectMods implements Step {
  channel = logger.newChannel();

  constructor() {}
  async end(builder: BuilderInternal) {}
  async run(builder: BuilderInternal) {
    for (const rawpath of await globScan(builder.platform, Path('C:/Users/Chase/AppData/Local/Discord'), ['app*/modules/discord_voice-1/discord_voice/index.js'], [], true)) {
      const path = Path(rawpath);
      const text = await builder.platform.File.readText(path);
      const previous_index = text.indexOf(modheader);
      const original_text = previous_index !== -1 ? text.slice(0, previous_index) : text;
      await builder.platform.File.writeText(Path(path), `${original_text}${modheader}${await builder.getFile(Path(builder.dir.src, 'mod.ts')).getText()}`);
    }
  }
}

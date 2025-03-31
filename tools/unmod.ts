import { Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Builder } from './lib/Builder.js';
import { Step_InjectMods } from './Step-InjectMods.js';

const builder = new Builder();
builder.setCleanUpSteps(
  Step_InjectMods(Path(builder.dir.src, 'mod.module.tsx'), true), //
);

await builder.start();

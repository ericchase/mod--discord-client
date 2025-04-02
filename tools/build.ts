import { Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Processor_CSS_SASSCompiler } from './lib-mod/processors/CSS-SASSCompiler.js';
import { Step_InjectMods } from './lib-mod/steps/Dev-InjectMods.js';
import { Builder } from './lib/Builder.js';
import { Processor_BasicWriter } from './lib/processors/FS-BasicWriter.js';
import { Processor_TypeScript_GenericBundlerImportRemapper } from './lib/processors/TypeScript-GenericBundler-ImportRemapper.js';
import { pattern, Processor_TypeScript_GenericBundler } from './lib/processors/TypeScript-GenericBundler.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';
import { Step_CleanDirectory } from './lib/steps/FS-CleanDirectory.js';
import { Step_Format } from './lib/steps/FS-Format.js';

const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

builder.setStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'install'] }, 'quiet'),
  Step_CleanDirectory(builder.dir.out),
  Step_Format('quiet'),
  //
);

builder.setProcessorModules(
  Processor_CSS_SASSCompiler(),
  Processor_TypeScript_GenericBundler({ external: ['*.sass', '*.scss'] }),
  Processor_TypeScript_GenericBundlerImportRemapper(),
  Processor_BasicWriter([`**/*${pattern.moduleoriife}`], []),
  //
);

builder.setAfterProcessingSteps(
  Step_InjectMods(Path(builder.dir.src, 'mod.module.ts')),
  //
);

await builder.start();

import { Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Builder } from './lib/Builder.js';
import { Processor_BasicWriter } from './lib/processors/FS-BasicWriter.js';
import { Processor_TypeScript_GenericBundlerImportRemapper } from './lib/processors/TypeScript-GenericBundler-ImportRemapper.js';
import { module_script, Processor_TypeScript_GenericBundler, ts_tsx_js_jsx } from './lib/processors/TypeScript-GenericBundler.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';
import { Step_CleanDirectory } from './lib/steps/FS-CleanDirectory.js';
import { Step_Format } from './lib/steps/FS-Format.js';
import { Processor_SASSCompiler } from './Processor-SASSCompiler.js';
import { Step_InjectMods } from './Step-InjectMods.js';

// Use command line arguments to set watch mode.
const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

// These steps are run during the startup phase only.
builder.setStartUpSteps(
  Step_Bun_Run({ cmd: ['bun', 'install'] }, 'quiet'),
  Step_CleanDirectory(builder.dir.out),
  Step_Format('quiet'),
  //
);

// These steps are run before each processing phase.
builder.setBeforeProcessingSteps();

// The processors are run for every file that added them during every
// processing phase.
builder.setProcessorModules(
  Processor_SASSCompiler(),
  Processor_TypeScript_GenericBundler({ external: ['*.sass', '*.scss'], sourcemap: 'none', target: 'browser' }),
  Processor_TypeScript_GenericBundlerImportRemapper(),
  Processor_BasicWriter([`**/*${module_script}${ts_tsx_js_jsx}`], []),
  //
);

// These steps are run after each processing phase.
builder.setAfterProcessingSteps(
  Step_InjectMods(Path(builder.dir.src, 'mod.module.ts')),
  //
);

// These steps are run during the shutdown phase only.
builder.setCleanUpSteps();

await builder.start();

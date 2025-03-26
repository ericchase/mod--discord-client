import { Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Builder } from './lib/Builder.js';
import { Processor_BasicWriter } from './lib/processors/FS-BasicWriter.js';
import { Processor_TypeScript_GenericCompiler } from './lib/processors/TypeScript-GenericCompiler.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';
import { Step_CleanDirectory } from './lib/steps/FS-CleanDirectory.js';
import { Step_Format } from './lib/steps/FS-Format.js';
import { Step_InjectMods } from './Step-InjectMods.js';

// Use command line arguments to set watch mode.
const builder = new Builder(Bun.argv[2] === '--watch' ? 'watch' : 'build');

// These steps are run during the startup phase only.
builder.setStartupSteps(
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
  Processor_TypeScript_GenericCompiler(['**/*.ts'], [], { target: 'node' }),
  Processor_BasicWriter(['**/*.ts'], [Path(builder.dir.lib, '/**/*')]),
  //
);

// These steps are run after each processing phase.
builder.setAfterProcessingSteps(
  Step_InjectMods(),
  //
);

// These steps are run during the shutdown phase only.
builder.setCleanupSteps();

await builder.start();

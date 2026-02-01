#!/usr/bin/env bun
import { cac } from 'cac';
import pc from 'picocolors';
import { generate } from './commands/generate.js';
import { list } from './commands/list.js';
import { info } from './commands/info.js';

const cli = cac('fast-setup');

cli
  .command('gen <template> [project-name]', 'Generate a new project from a template')
  .action(generate);

cli
  .command('list', 'List available templates and their features')
  .alias('ls')
  .action(list);

cli
  .command('info <template>', 'Show detailed information about a specific template')
  .action(info);

cli.help();


try {
	cli.parse();
} catch (error) {
	if (
		error instanceof Error &&
		error.message.includes("missing required args")
	) {
		console.log(pc.red("Error: Missing required arguments."));
		cli.outputHelp();
	} else {
		throw error;
	}
}

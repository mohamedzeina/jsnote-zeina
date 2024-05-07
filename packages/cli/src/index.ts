#!/usr/bin/env node
import { program } from 'commander';
import { serveCommand } from './commands/serve';

program.addCommand(serveCommand); // We only have one command to add, if we had others we would add them here

program.parse(process.argv);

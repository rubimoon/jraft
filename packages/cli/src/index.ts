#!/usr/bin/env node
import { program } from 'commander';
import { serveCommnad } from './commands/serve';

program.addCommand(serveCommnad);
program.parse(process.argv);

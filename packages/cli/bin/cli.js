#!/usr/bin/env node

import { NodeFileSystem } from 'langium/node';
import { createSlideDeckMlServices } from '../out/language-server/slide-deck-ml-module.js';
import cli from '../out/cli/main.js';

createSlideDeckMlServices(NodeFileSystem);
cli();

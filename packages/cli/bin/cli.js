#!/usr/bin/env node

import { NodeFileSystem } from 'langium/node';
import { createSlideDeckMlServices } from '../../language/out/slide-deck-ml-module.js';
import cli from '../out/main.js';

createSlideDeckMlServices(NodeFileSystem);
cli();

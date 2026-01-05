import { Command } from 'commander';
import { extractAstNode } from './util.js';
import { SlideDeckGenerator } from './generator.js';
import { Presentation } from '../../language/out/generated/ast.js';
import { createSlideDeckMlServices } from '../../language/out/slide-deck-ml-module.js';
import { NodeFileSystem } from 'langium/node';

/**
 * Point d'entrée CLI pour générer les slides
 */
export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createSlideDeckMlServices(NodeFileSystem).SlideDeckMl;
    const presentation = await extractAstNode<Presentation>(fileName, services);
    const generator = new SlideDeckGenerator();
    const destination = opts.destination ?? '../../../demo/generated';
    
    generator.generateHtml(presentation.$document!, destination);
};

export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program
        .version('0.1.0')
        .description('Générateur de présentations SlideDeckML');

    program
        .command('generate')
        .argument('<file>', 'Fichier source SlideDeckML (.sdml)')
        .option('-d, --destination <dir>', 'Dossier de destination', '../../../demo/generated')
        .description('Génère une présentation HTML/Reveal.js')
        .action(generateAction);

    program.parse(process.argv);
}
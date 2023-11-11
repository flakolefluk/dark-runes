import { DarkRuneError } from "../DarkRuneError.js";
import { hasBoundaries, isCallExpressionWithIdentifier, isIdentifier, isSpreadElement } from "../utils.js";

/**
 * 
 * @param {import('estree').VariableDeclaration & import('../nodes').NodeExtension} node 
 * @param {import('magic-string').default} magic
 * @param {*} options 
 */
export function variableDeclarationHandler(node, magic, options) {
    node.declarations.forEach((declaration) => {
        if (isCallExpressionWithIdentifier(declaration.init, '$states')) {
            if (declaration.id.type !== 'ArrayPattern') {
                throw new DarkRuneError('Unhandled id type when using $states rune');
            }

            let elements = declaration.id.elements;
            let nodeToReplace = node;
            if (elements.length !== declaration.init.arguments.length) {
                throw new DarkRuneError('Asymmetric number of declarations');
            }
            if (elements.every((node) => isIdentifier(node))) {
                let output = declaration.init.arguments
                    .map((nodeToKeep, i) => {
                        let element = elements[i];
                        if (isIdentifier(element) && hasBoundaries(nodeToKeep)) {
                            let slice = magic.slice(
                                nodeToKeep.start,
                                nodeToKeep.end,
                            )
                            let value = options.runes === false ? `${slice};` : `$state(${slice});`
                            
                            return `let ${element.name} = ${value}`
                        }
                    })
                    .join('\n');
                if (hasBoundaries(nodeToReplace)) {
                    magic.overwrite(nodeToReplace.start, nodeToReplace.end, output);
                }
            }
        }
    })
}
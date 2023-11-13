import { DarkRuneError } from "../DarkRuneError.js";
import { hasBoundaries, isIdentifier, isObjectExpression, isProperty, isSpreadElement } from "../utils.js";

/**
 * 
 * @param {import('estree').CallExpression & import('../nodes').NodeExtension} node 
 * @param {import('magic-string').default} magic
 * @param {*} options 
 */
export function wrapHandler(node, magic, options) {
    let [writablesNode, readablesNode, propsNode] = node.arguments;
    let props = [];
    if (writablesNode != null) {
        if (!isObjectExpression(writablesNode)) {
            throw new DarkRuneError("Getters must be of type ObjectExpression")
        }
        writablesNode.properties.forEach((prop) => {
            if (isSpreadElement(prop)) {
                throw new DarkRuneError("Spread Elements are not allowed inside getters")
            }
            if (
                isProperty(prop) &&
                isIdentifier(prop.key) &&
                isIdentifier(prop.value) &&
                prop.key.name === prop.value.name
            ) {
                props.push(`get ${prop.key.name}() { return ${prop.key.name}; },
set ${prop.key.name}(value) { ${prop.key.name} = value; }`);
            }
        });
    }

    if (readablesNode != null) {
        if (!isObjectExpression(readablesNode)) {
            throw new DarkRuneError("Setters must be of type ObjectExpression")
        }
        readablesNode.properties.forEach((prop) => {
            if (isSpreadElement(prop)) {
                throw new DarkRuneError("Spread Elements are not allowed inside setters")
            }
            if (
                isProperty(prop) &&
                prop.key.type === 'Identifier' &&
                prop.value.type === 'Identifier' &&
                prop.key.name === prop.value.name
            ) {
                props.push(
                    `get ${prop.key.name}() { return ${prop.key.name}; }`,
                );
            }
        });
    }

    if (propsNode != null) {
        if (!isObjectExpression(propsNode)) {
            throw new DarkRuneError("Props must be of type ObjectExpression")
        }
        propsNode.properties.forEach((prop) => {
            if (hasBoundaries(prop)) {
                props.push(magic.slice(prop.start, prop.end));
            }
        });
    }

    let nodeToReplace = node;
    if (hasBoundaries(nodeToReplace)) {
        magic.overwrite(
            nodeToReplace.start,
            nodeToReplace.end,
            ['{', props.join(',\n'), '}'].join('\n'),
        );
    }
}
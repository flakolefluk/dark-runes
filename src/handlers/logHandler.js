import { getNodesArrayBoundaries, hasBoundaries } from "../utils.js";

/**
 * 
 * @param {import('estree').CallExpression & import('../nodes').NodeExtension} node 
 * @param {import('magic-string').default} magic
 * @param {*} options 
 */
export function logHandler(node, magic, options) {
    let nodeToReplace = node;
    let [start, end] = getNodesArrayBoundaries(node.arguments);
    if (start !== undefined && end !== undefined && hasBoundaries(nodeToReplace)) {
        if (options.runes === false) {
            magic.overwrite(
                nodeToReplace.start,
                nodeToReplace.end,
                `$: console.log(${magic.slice(start, end)})`,
            );
        } else {
            magic.overwrite(
                nodeToReplace.start,
                nodeToReplace.end,
                `$effect(() => {
console.log(${magic.slice(start, end)})
})`,
            );
        }
    }
}
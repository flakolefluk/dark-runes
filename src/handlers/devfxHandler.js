import { fxHandler } from "./fxHandler.js";

/**
 * 
 * @param {import('estree').CallExpression & import('../nodes.js').NodeExtension} node 
 * @param {import('magic-string').default} magic
 * @param {*} options 
 */
export function devfxHandler(node, magic, options) {
    if (options.dev) {
        return fxHandler(node, magic, options)
    }

    let nodeToReplace = node;

    magic.overwrite(
        nodeToReplace.start || 0,
        nodeToReplace.end || 0,
        "",
    );
}

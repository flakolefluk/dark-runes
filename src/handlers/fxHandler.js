import { DarkRuneError } from "../DarkRuneError.js";
import { getNodesArrayBoundaries, hasBoundaries, isSpreadElement } from "../utils.js";

/**
 * 
 * @param {import('estree').CallExpression & import('../nodes.js').NodeExtension} node 
 * @param {import('magic-string').default} magic
 * @param {*} options 
 */
export function fxHandler(node, magic, options) {
    let nodeToReplace = node;

    let [fnToCall, ...otherArgs] = node.arguments;

    if (!fnToCall) {
        throw new DarkRuneError("Expected at least one parameter in fxHandler")
    }

    if (isSpreadElement(fnToCall)) {
        throw new DarkRuneError("Invalid first parameter.")
    }
    /** @type {import('estree').Expression & import('../nodes.js').NodeExtension}**/
    let fnExp =/** @type {*} **/(fnToCall)
    let hasOtherArgs = otherArgs.length > 0

    let [start = 0, end = 0] = getNodesArrayBoundaries(otherArgs);

    if (start !== undefined && end !== undefined && fnExp.start!== undefined &&  fnExp.end!== undefined && hasBoundaries(nodeToReplace)) {
        let fnArgs = hasOtherArgs ? magic.slice(start, end) : ""
        if (options.runes === false) {
            magic.overwrite(
                nodeToReplace.start,
                nodeToReplace.end,
                `$: (${magic.slice(fnExp.start, fnExp.end)})(${fnArgs})`,
            );
        } else {
            magic.overwrite(
                nodeToReplace.start,
                nodeToReplace.end,
                `$effect(() => {
(${magic.slice(fnExp.start, fnExp.end)})(${fnArgs})
})`,
            );
        }
    }
}

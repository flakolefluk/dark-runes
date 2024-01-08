import { DarkRuneError } from '../DarkRuneError.js';
import { isAnyFunctionExpression } from '../utils.js';

/**
 * 
 * @param {import('estree').CallExpression & import('../nodes.js').NodeExtension} node 
 * @param {import('magic-string').default} magic
 * @param {*} options 
 */
export function computedHandler(node, magic, options) {
    if (node.arguments.length < 1) {
        throw new DarkRuneError("$computed requires one argument.")
    }

    if (node.arguments.length > 1) {
        throw new DarkRuneError("$computed accepts one argument only.")
    }

    let nodeToReplace = node;

    let [arg] = node.arguments;


    if (!isAnyFunctionExpression(arg)) {
        throw new DarkRuneError(`Invalid argument type \"${arg.type}\".`)
    }

    if (!nodeToReplace.start || !nodeToReplace.end) {
        throw new DarkRuneError("Invalid range to replace")
    }

    if(arg.start && arg.end){
        magic.overwrite(nodeToReplace.start, nodeToReplace.end, `$derived((${magic.slice(arg.start, arg.end)})())`)
    }

}
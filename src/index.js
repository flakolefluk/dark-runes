import MagicString from 'magic-string';
import { parse, walk as _walk } from 'svelte/compiler';

export class DarkRuneError extends Error {
    constructor(message = "") {
        super(message);
        this.message = message;
    }
}

/**
 * 
 * @param {import('estree').Node} ast 
 * @param {*} [opts] 
 * @returns import('svelte/types/compiler/interfaces').BaseNode
 */
function walk(ast, opts) {
    return _walk(ast, opts)
}

/**
 * 
 * @param {import('svelte/types/compiler/interfaces').BaseNode} node 
 * @param {string} calleeIdentifierName 
 * @returns {boolean}
 */
function isCallExpressionWithIdentifier(node, calleeIdentifierName) {
    return !!node && node.type === "CallExpression" && node.callee.type === "Identifier" && node.callee.name === calleeIdentifierName
}

/**
 * 
 * @param {import('svelte/types/compiler/interfaces').BaseNode[]} nodesArray 
 * @returns {[number|undefined, number|undefined]}
 */
function getNodesArrayBoundaries(nodesArray) {
    let start, end
    for (let node of nodesArray) {
        if (start === undefined || node.start < start) {
            start = node.start
        }
        if (end === undefined || node.end > end) {
            end = node.end
        }
    }
    return [start, end]
}

/**
 * @typedef {Object} WithMarkupPreprocessor
 * @property {string} name
 * @property {import('svelte/compiler').MarkupPreprocessor} markup
 */

/**
 * 
 * @param {*} options
 * @property {string} options.alias
 * @returns {WithMarkupPreprocessor}
 */
export function processDarkRunes(options) {
    return {
        name: "dark-runes",
        markup: ({ filename, content }) => {
            let magic = new MagicString(content, { filename })
            const ast = parse(content, { css: false, filename });
            let instance = ast.instance;
            if (instance) {
                walk(instance.content, {
                    /**
                     * 
                     * @param {import('svelte/types/compiler/interfaces').BaseNode} node 
                     */
                    enter(node) {
                        if (node.type === "VariableDeclaration") {
                            node.declarations.forEach((declaration) => {
                                if (isCallExpressionWithIdentifier(declaration.init, "$state")) {
                                    if (declaration.init.arguments.length === 1 && declaration.init.arguments[0].type !== 'SpreadElement') {
                                        let nodeToReplace = declaration.init
                                        let nodeToKeep = declaration.init.arguments[0]
                                        magic.overwrite(nodeToReplace.start, nodeToReplace.end, magic.slice(nodeToKeep.start, nodeToKeep.end))
                                    }

                                }

                                if (isCallExpressionWithIdentifier(declaration.init, "$states")) {
                                    if (declaration.id.type !== "ArrayPattern") {
                                        throw new DarkRuneError("Unhandled id type when using $states rune")
                                    }

                                    let elements = declaration.id.elements
                                    let nodeToReplace = node
                                    if (elements.length !== declaration.init.arguments.length) {
                                        throw new DarkRuneError("Asymmetric number of declarations")
                                    }
                                    if (elements.every(node => node?.type === "Identifier")) {
                                        let output = declaration.init.arguments.map((nodeToKeep, i) => {
                                            let element = elements[i]
                                            if (element && element.type === "Identifier") {
                                                return `let ${element.name} = ${magic.slice(nodeToKeep.start, nodeToKeep.end)};`
                                            }
                                        }).join("\n")
                                        magic.overwrite(nodeToReplace.start, nodeToReplace.end, output)
                                    }

                                }
                            })
                        }

                        if (isCallExpressionWithIdentifier(node, "$log")) {
                            let nodeToReplace = node;
                            let [start, end] = getNodesArrayBoundaries(node.arguments)
                            if (start !== undefined && end !== undefined) {
                                magic.overwrite(nodeToReplace.start, nodeToReplace.end, `$: console.log(${magic.slice(start, end)})`)
                            }
                        }
                    }
                })
            }

            if (process.env.DEBUG_DARK_RUNES) {
                console.log("DARK RUNES OUTPUT START for:", filename)
                console.log(magic.toString())
                console.log("DARK RUNES OUTPUT END for:", filename)
            }
            return { code: magic.toString(), map: magic.generateMap() }
        },

    }
}
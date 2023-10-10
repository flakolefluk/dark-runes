import { walk as _walk, parse } from 'svelte/compiler';

/**
 *
 * @param {import('estree').Node} ast
 * @param {*} [opts]
 * @returns import('svelte/types/compiler/interfaces').BaseNode
 */
export function walk(ast, opts) {
	return _walk(ast, opts);
}

/**
 *
 * @param {import('svelte/types/compiler/interfaces').BaseNode} node
 * @returns {boolean}
 */
export function isSpreadElement(node) {
	return !!node && node.type === 'SpreadElement';
}

/**
 *
 * @param {import('svelte/types/compiler/interfaces').BaseNode} node
 * @param {string} calleeIdentifierName
 * @returns {boolean}
 */
export function isCallExpressionWithIdentifier(node, calleeIdentifierName) {
	return (
		!!node &&
		node.type === 'CallExpression' &&
		node.callee.type === 'Identifier' &&
		node.callee.name === calleeIdentifierName
	);
}

/**
 *
 * @param {import('svelte/types/compiler/interfaces').BaseNode[]} nodesArray
 * @returns {[number|undefined, number|undefined]}
 */
export function getNodesArrayBoundaries(nodesArray) {
	let start, end;
	for (let node of nodesArray) {
		if (start === undefined || node.start < start) {
			start = node.start;
		}
		if (end === undefined || node.end > end) {
			end = node.end;
		}
	}
	return [start, end];
}

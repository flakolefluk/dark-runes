/**
 * @type {import('./nodes').IsNodeFn}
 */
export function isNode(node) {
	return !!node;
}

/**
 * @type {import('./nodes').IsSpreadElementFn}
 */
export function isSpreadElement(node) {
	return isNode(node) && node.type === 'SpreadElement';
}

/**
 * @type {import('./nodes').IsVariableDeclarationFn}
 */
export function isVariableDeclaration(node) {
	return isNode(node) && node.type === 'VariableDeclaration';
}

/**
 * @type {import('./nodes').IsCallExpressionFn}
 */
export function isCallExpression(node) {
	return isNode(node) && node.type === 'CallExpression';
}

/**
 * @type {import('./nodes').IsIdentifierFn}
 */
export function isIdentifier(node) {
	return isNode(node) && node.type === 'Identifier';
}

/**
 * 
 * @param {import('estree').Identifier} node 
 * @param {string} name 
 * @returns {boolean}
 */
export function hasName(node, name) {
	return node.name === name;
}

/**
 * @type {import('./nodes').IsCallExpressionWithIdentifier}
 */
export function isCallExpressionWithIdentifier(node, calleeIdentifierName) {
	return isCallExpression(node) && isIdentifier(node.callee) && hasName(node.callee, calleeIdentifierName)
}

/**
 * @type {import('./nodes').IsObjectExpressionFn}
 */
export function isObjectExpression(node) {
	return isNode(node) && node.type === 'ObjectExpression';
}

/**
 * @type {import('./nodes').IsPropertyFn}
 */
export function isProperty(node) {
	return isNode(node) && node.type === 'Property';
}

/**
 * @type {import('./nodes').HasBoundariesFn}
 */
export function hasBoundaries(node) {
	return node.start != null && node.end != null
}


/**
 *
 * @param {import('./nodes').ExtendedNode[]} nodesArray
 * @returns {[number|undefined, number|undefined]}
 */
export function getNodesArrayBoundaries(nodesArray) {
	let start, end;
	for (let node of nodesArray) {
		if (hasBoundaries(node)) {
			if (start === undefined || node.start < start) {
				start = node.start;
			}
			if (end === undefined || node.end > end) {
				end = node.end;
			}
		}
	}
	return [start, end];
}

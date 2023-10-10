import MagicString from 'magic-string';
import { parse } from 'svelte/compiler';
import { DarkRuneError } from './DarkRuneError.js';
import {
	getNodesArrayBoundaries,
	isCallExpressionWithIdentifier,
	isSpreadElement,
	walk,
} from './utils.js';

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
		name: 'dark-runes',
		markup: ({ filename, content }) => {
			let magic = new MagicString(content, { filename });
			const ast = parse(content, { css: false, filename });
			let instance = ast.instance;
			if (instance) {
				walk(instance.content, {
					/**
					 *
					 * @param {import('svelte/types/compiler/interfaces').BaseNode} node
					 */
					enter(node) {
						if (node.type === 'VariableDeclaration') {
							node.declarations.forEach((declaration) => {
								if (
									isCallExpressionWithIdentifier(declaration.init, '$state')
								) {
									if (
										declaration.init.arguments.length === 1 &&
										declaration.init.arguments[0].type !== 'SpreadElement'
									) {
										let nodeToReplace = declaration.init;
										let nodeToKeep = declaration.init.arguments[0];
										magic.overwrite(
											nodeToReplace.start,
											nodeToReplace.end,
											magic.slice(nodeToKeep.start, nodeToKeep.end),
										);
									}
								}

								if (
									isCallExpressionWithIdentifier(declaration.init, '$states')
								) {
									if (declaration.id.type !== 'ArrayPattern') {
										throw new DarkRuneError(
											'Unhandled id type when using $states rune',
										);
									}

									let elements = declaration.id.elements;
									let nodeToReplace = node;
									if (elements.length !== declaration.init.arguments.length) {
										throw new DarkRuneError(
											'Asymmetric number of declarations',
										);
									}
									if (elements.every((node) => node?.type === 'Identifier')) {
										let output = declaration.init.arguments
											.map((nodeToKeep, i) => {
												let element = elements[i];
												if (element && element.type === 'Identifier') {
													return `let ${element.name} = ${magic.slice(
														nodeToKeep.start,
														nodeToKeep.end,
													)};`;
												}
											})
											.join('\n');
										magic.overwrite(
											nodeToReplace.start,
											nodeToReplace.end,
											output,
										);
									}
								}
							});
						}

						if (isCallExpressionWithIdentifier(node, '$log')) {
							let nodeToReplace = node;
							let [start, end] = getNodesArrayBoundaries(node.arguments);
							if (start !== undefined && end !== undefined) {
								magic.overwrite(
									nodeToReplace.start,
									nodeToReplace.end,
									`$: console.log(${magic.slice(start, end)})`,
								);
							}
						}

						if (isCallExpressionWithIdentifier(node, '$gsp')) {
							// console.log(JSON.stringify(node, null, 2))
							let [start, end] = getNodesArrayBoundaries(node.arguments);
							let [gettersNode, settersNode, propsNode] = node.arguments;
							let props = [];
							if (gettersNode && gettersNode.type === 'ObjectExpression') {
								gettersNode.properties.forEach((prop) => {
									if (
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
							if (settersNode && settersNode.type === 'ObjectExpression') {
								settersNode.properties.forEach((prop) => {
									if (
										prop.key.type === 'Identifier' &&
										prop.value.type === 'Identifier' &&
										prop.key.name === prop.value.name
									) {
										props.push(
											`set ${prop.key.name}(value) { ${prop.key.name} = value; }`,
										);
									}
								});
							}
							if (propsNode && propsNode.type === 'ObjectExpression') {
								propsNode.properties.forEach((prop) => {
									props.push(magic.slice(prop.start, prop.end));
								});
							}
							let nodeToReplace = node;
							magic.overwrite(
								nodeToReplace.start,
								nodeToReplace.end,
								['{', props.join(',\n'), '}'].join('\n'),
							);
						}

						if (
							isSpreadElement(node) &&
							isCallExpressionWithIdentifier(node.argument, '$get')
						) {
							let nodeToReplace = node;
							let callExpression = node.argument;
							let [gettersNode] = callExpression.arguments;
							let props = [];
							if (gettersNode && gettersNode.type === 'ObjectExpression') {
								gettersNode.properties.forEach((prop) => {
									if (
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
							let replacementString = props.join(',\n');
							magic.overwrite(
								nodeToReplace.start,
								nodeToReplace.end,
								replacementString,
							);
						}
						if (
							isSpreadElement(node) &&
							isCallExpressionWithIdentifier(node.argument, '$set')
						) {
							let nodeToReplace = node;
							let callExpression = node.argument;
							let [gettersNode] = callExpression.arguments;
							let props = [];
							if (gettersNode && gettersNode.type === 'ObjectExpression') {
								gettersNode.properties.forEach((prop) => {
									if (
										prop.key.type === 'Identifier' &&
										prop.value.type === 'Identifier' &&
										prop.key.name === prop.value.name
									) {
										props.push(
											`set ${prop.key.name}(value) { ${prop.key.name} = value; }`,
										);
									}
								});
							}
							let replacementString = props.join(',\n');
							magic.overwrite(
								nodeToReplace.start,
								nodeToReplace.end,
								replacementString,
							);
						}

						if (
							isSpreadElement(node) &&
							isCallExpressionWithIdentifier(node.argument, '$getset')
						) {
							let nodeToReplace = node;
							let callExpression = node.argument;
							let [gettersNode] = callExpression.arguments;
							let props = [];
							if (gettersNode && gettersNode.type === 'ObjectExpression') {
								gettersNode.properties.forEach((prop) => {
									if (
										prop.key.type === 'Identifier' &&
										prop.value.type === 'Identifier' &&
										prop.key.name === prop.value.name
									) {
										props.push(
											`get ${prop.key.name}() { return ${prop.key.name}; }`,
										);
										props.push(
											`set ${prop.key.name}(value) { ${prop.key.name} = value; }`,
										);
									}
								});
							}
							let replacementString = props.join(',\n');

							magic.overwrite(
								nodeToReplace.start,
								nodeToReplace.end,
								replacementString,
							);
						}
					},
				});
			}

			if (process.env.DEBUG_DARK_RUNES) {
				console.log('DARK RUNES OUTPUT START for:', filename);
				console.log(magic.toString());
				console.log('DARK RUNES OUTPUT END for:', filename);
			}
			return { code: magic.toString(), map: magic.generateMap() };
		},
	};
}

import * as acorn from 'acorn';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import { parse } from 'svelte/compiler';
import { gspHandler } from './handlers/gspHandler.js';
import { logHandler } from './handlers/logHandler.js';
import { spreadElementHandler } from './handlers/spreadElement.js';
import { variableDeclarationHandler } from './handlers/variableDeclaration.js';
import {
	isCallExpressionWithIdentifier,
	isSpreadElement,
	isVariableDeclaration
} from './utils.js';
import { wrapHandler } from './handlers/wrapHandler.js';

/**
 * 
 * @param {import('estree').Node} program 
 * @param {MagicString} magic 
 * @param {*} options
 */
function walkProgram(program, magic, options) {
	walk(program, {
		enter(node) {
			if (isVariableDeclaration(node)) {
				variableDeclarationHandler(node, magic, options)
			}

			if (isCallExpressionWithIdentifier(node, '$log')) {
				logHandler(node, magic, options)
			}

			if (isCallExpressionWithIdentifier(node, '$gsp')) {
				gspHandler(node, magic, options)
			}

			if (isCallExpressionWithIdentifier(node, '$wrap')) {
				wrapHandler(node, magic, options)
			}

			if (isSpreadElement(node)) {
				spreadElementHandler(node, magic, options)
			}
		},
	});
}

export function darkRunes() {
	return {
		name: "vite-plugin-dark-runes",
		transform(src, id) {
			if (id.endsWith('.svelte.ts') || id.endsWith('.svelte.js')) {
				let magic = new MagicString(src, { filename: id })
				/**
				   * TODO: fix type
				   * @type {*}
				 */
				const ast = acorn.parse(src, {
					sourceType: 'module',
					ecmaVersion: 13,
					locations: true
				});
				walkProgram(ast, magic, { runes: true })
				return { code: magic.toString(), map: magic.generateMap() };
			}
		}
	}
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
export function processDarkRunes(options = {}) {
	return {
		name: 'dark-runes',
		markup: ({ filename, content }) => {
			let magic = new MagicString(content, { filename });
			/**
			 * TODO: fix type
			 * @type {*}
			 */
			const ast = parse(content, { filename, modern: false });
			let instance = ast.instance;
			if (instance) {
				walkProgram(instance.content, magic, options)
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

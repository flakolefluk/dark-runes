import { expect } from 'vitest';
import { processDarkRunes } from '../src/index.js';
import dedent from 'dedent';

/**
 * 
 * @param {string} input 
 * @param {string} output 
 * @param {Record<string, any>} [opts] 
 */
export async function compareOutput(input, output, opts = {}) {
	let { runes = true, dev = true } = opts
	const { markup } = processDarkRunes({ runes, dev });

	let processed = await markup({ content: input });
	expect(dedent(processed?.code || '')).toBe(dedent(output));
}

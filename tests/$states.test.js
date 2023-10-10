import { describe, expect, test } from 'vitest';
import { processDarkRunes } from '../src/index.js';
import { compareOutput } from './helpers.js';

describe('$states rune', () => {
	describe('single element', () => {
		test('number', async () => {
			let input = `
                <script>
                    let [foo] = $states(1)
                </script>
`;

			let output = `
                <script>
                    let foo = 1;
                </script>
`;
			await compareOutput(input, output);
		});
		test('string', async () => {
			let input = `
                <script>
                    let [foo] = $states("foo")
                </script>
`;

			let output = `
                <script>
                    let foo = "foo";
                </script>
`;
			await compareOutput(input, output);
		});
		test('boolean', async () => {
			let input = `
                <script>
                    let [foo] = $states(true);
                </script>
`;

			let output = `
                <script>
                    let foo = true;
                </script>
`;
			await compareOutput(input, output);
		});

		test('object', async () => {
			let input = `
                <script>
                    let [foo] = $states({foo:1,bar:true})
                </script>
`;

			let output = `<script>
                    let foo = {foo:1,bar:true};
                </script>
`;
			await compareOutput(input, output);
		});

		test('array', async () => {
			let input = `
                <script>
                    let [foo] = $states([1,true])
                </script>
`;

			let output = `
                <script>
                    let foo = [1,true];
                </script>
`;
			await compareOutput(input, output);
		});
	});

	describe('multiple elements', () => {
		test('symmetric', async () => {
			let input = `
                <script>
                    let [foo, bar, baz, fizz, fuzz] = $states(1,"foo", true, {baz:"baz"}, ["a", 1]);
                </script>
`;

			let output = `
                <script>
                    let foo = 1;
let bar = "foo";
let baz = true;
let fizz = {baz:"baz"};
let fuzz = ["a", 1];
                </script>
        `;
			await compareOutput(input, output);
		});

		test('throws if asymmetric (less ids)', async () => {
			let input = `
                <script>
                    let [foo, bar, baz, fizz] = $states(1,"foo", true, {baz:"baz"}, ["a", 1]);
                </script>
`;
			const { markup } = processDarkRunes({});

			expect(async () => {
				await markup({ content: input });
			}).rejects.toThrow('Asymmetric number of declarations');
		});

		test('throws if asymmetric (more ids)', async () => {
			let input = `
                <script>
                    let [foo, bar, baz, fizz, fuzz, jazz] = $states(1,"foo", true, {baz:"baz"}, ["a", 1]);
                </script>
`;
			const { markup } = processDarkRunes({});

			expect(async () => {
				await markup({ content: input });
			}).rejects.toThrow('Asymmetric number of declarations');
		});

		test('throws if id is not an array pattern (identifier)', async () => {
			let input = `
                <script>
                    let bar = $states(1,"foo", true, {baz:"baz"}, ["a", 1]);
                </script>
`;
			const { markup } = processDarkRunes({});

			expect(async () => {
				await markup({ content: input });
			}).rejects.toThrow('Unhandled id type when using $states rune');
		});

		test('throws if id is not an array pattern (object pattern)', async () => {
			let input = `
                <script>
                    let {bar} = $states(1,"foo", true, {baz:"baz"}, ["a", 1]);
                </script>
`;
			const { markup } = processDarkRunes({});

			expect(async () => {
				await markup({ content: input });
			}).rejects.toThrow('Unhandled id type when using $states rune');
		});
	});
});

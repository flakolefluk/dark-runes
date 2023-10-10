import { describe, test } from 'vitest';
import { compareOutput } from './helpers';

describe('$getset rune', () => {
	test('single', async () => {
		let input = `
        <script>
            let a = 1;
            let res = {
                ...$getset({a})
            }
        </script>
`;

		let output = `
    <script>
        let a = 1;
        let res = {
            get a() { return a; },
set a(value) { a = value; }
        }
    </script>
`;
		await compareOutput(input, output);
	});
	test('multiple', async () => {
		let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = {
                ...$getset({a,b,c})
            }
        </script>
`;

		let output = `
    <script>
        let a = 1;
        let b = 1;
        let c = 1;
        let res = {
            get a() { return a; },
set a(value) { a = value; },
get b() { return b; },
set b(value) { b = value; },
get c() { return c; },
set c(value) { c = value; }
        }
    </script>
`;
		await compareOutput(input, output);
	});
});

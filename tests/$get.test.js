import { describe, test } from 'vitest';
import { compareOutput } from './helpers';

describe('$get rune', () => {
	test('single', async () => {
		let input = `
        <script>
            let a = 1;
            let res = {
                ...$get({a})
            }
        </script>
`;

		let output = `
    <script>
        let a = 1;
        let res = {
            get a() { return a; }
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
                ...$get({a,b,c})
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
get b() { return b; },
get c() { return c; }
        }
    </script>
`;
		await compareOutput(input, output);
	});
});

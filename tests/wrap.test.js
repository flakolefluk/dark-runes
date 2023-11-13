import { describe, test } from 'vitest';
import { compareOutput } from './helpers';

describe('$wrap rune', () => {
	test('single writable', async () => {
		let input = `
        <script>
            let a = 1;
            let res = $wrap({a})
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

	test('multiple writables', async () => {
		let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = $wrap({a,b,c})
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

	test('single readable', async () => {
		let input = `
        <script>
            let a = 1;
            let res = $wrap({}, {a})
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

	test('multiple setters', async () => {
		let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = $wrap({},{a,b,c})
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

	test('mixed writables and readables', async () => {
		let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = $wrap({a,b},{c})
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
get c() { return c; }
}
    </script>
`;
		await compareOutput(input, output);
	});

	test('mixed witables, readables and props', async () => {
		let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = $wrap({a,b},{c}, {foo:'bar', baz:5, fizz:true})
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
foo:'bar',
baz:5,
fizz:true
}
    </script>
`;
		await compareOutput(input, output);
	});

    test("todo example", () => {
        let input=`
        <script>
        todos = [
            ...todos,
            $wrap({done, text})
        ]
        </script>`

        let output=`
        <script>
        todos = [
            ...todos,
            {
        get done() { return done; },
        set done(value) { done = value; },
        get text() { return text; },
        set text(value) { text = value; }
        }
        ]
        </script>`


          compareOutput(input, output)

    })
});

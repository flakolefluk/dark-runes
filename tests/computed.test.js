import { describe, test } from 'vitest';
import { compareOutput } from './helpers';
import { expect } from 'vitest';
import { processDarkRunes } from '../src';

describe('$computed rune', () => {
    test('converts arrow function expression to iife', async () => {
        let input = `
        <script>
            let a = $computed(() => { console.log(foo); return foo;})
        </script>
`;

        let output = `
        <script>
            let a = $derived((() => { console.log(foo); return foo;})())
        </script>
`;
        compareOutput(input, output);

    })

    test('converts function expression to iife', async () => {
        let input = `
        <script>
            let a = $computed(function(){ console.log(foo); return foo;})
        </script>
`;

        let output = `
        <script>
            let a = $derived((function(){ console.log(foo); return foo;})())
        </script>
`;
        compareOutput(input, output);

    })

    test('converts named function expression to iife', async () => {
        let input = `
        <script>
            let a = $computed(function boo(){ console.log(foo); return foo;})
        </script>
`;

        let output = `
        <script>
            let a = $derived((function boo(){ console.log(foo); return foo;})())
        </script>
`;
        compareOutput(input, output);

    })

    test('$throws if argument is spread element', async () => {
        let input = `
        <script>
            let a = $computed(...na)
        </script>
`;

        const { markup } = processDarkRunes({});

        expect(async () => {
            await markup({ content: input });
        }).rejects.toThrow("Invalid argument type \"SpreadElement\".");
    });

    test('throws if argument is not a function expression or arrow function expression', async () => {
        let input = `
        <script>
            let a = $computed(foo*2)
        </script>
`;

const { markup } = processDarkRunes({});

expect(async () => {
    await markup({ content: input });
}).rejects.toThrow("Invalid argument type \"BinaryExpression\".");
    })

    test('$throws if no argument is given', async () => {
        let input = `
        <script>
            let a = $computed()
        </script>
`;

        const { markup } = processDarkRunes({});

        expect(async () => {
            await markup({ content: input });
        }).rejects.toThrow("$computed requires one argument.");
    })

    test('$throws if more than one argument is given', async () => {
        let input = `
        <script>
            let a = $computed(a, b)
        </script>
`;

        const { markup } = processDarkRunes({});

        expect(async () => {
            await markup({ content: input });
        }).rejects.toThrow("$computed accepts one argument only.");
    })
});

import { describe, test } from 'vitest';
import { compareOutput } from './helpers';

describe('$fx rune', () => {
    test('identifier fn with no args', async () => {
        let input = `
        <script>
            let a = 1;
            $fx(foo);
        </script>
`;

        let output = `
    <script>
        let a = 1;
        $effect(() => {
    (foo)()
});
    </script>
`;
        await compareOutput(input, output);
    });

    test('identifier fn with args', async () => {
        let input = `
        <script>
            let a = 1;
            $fx(foo, 1, 2, "lol", a);
        </script>
`;

        let output = `
    <script>
        let a = 1;
        $effect(() => {
    (foo)(1, 2, "lol", a)
});
    </script>
`;
        await compareOutput(input, output);
    });

    test('member exp fn with no args', async () => {
        let input = `
        <script>
            let a = 1;
            $fx(console.log);
        </script>
`;

        let output = `
    <script>
        let a = 1;
        $effect(() => {
    (console.log)()
});
    </script>
`;
        await compareOutput(input, output);
    });

    test('member exp fn with args', async () => {
        let input = `
        <script>
            let a = 1;
            $fx(console.log, 1, 2, "lol", a);
        </script>
`;

        let output = `
    <script>
        let a = 1;
        $effect(() => {
    (console.log)(1, 2, "lol", a)
});
    </script>
`;
        await compareOutput(input, output);
    });

    test('inline arrow fn with no args', async () => {
        let input = `
        <script>
            let a = 1;
            $fx((...args) => klaxon(...args));
        </script>
`;

        let output = `
    <script>
        let a = 1;
        $effect(() => {
    ((...args) => klaxon(...args))()
});
    </script>
`;
        await compareOutput(input, output);
    });

    test('inline arrow fn with args', async () => {
        let input = `
        <script>
            let a = 1;
            $fx((...args) => klaxon(...args), 1, 2, "lol", a);
        </script>
`;

        let output = `
    <script>
        let a = 1;
        $effect(() => {
    ((...args) => klaxon(...args))(1, 2, "lol", a)
});
    </script>
`;
        await compareOutput(input, output);
    });
});

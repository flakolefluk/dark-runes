import { describe, test } from 'vitest';
import { compareOutput } from './helpers';

describe('$log rune', () => {
    test('single argument', async () => {
        let input = `
        <script>
            let a = 1;
            $log(a);
        </script>
`;

        let v4Output = `
    <script>
        let a = 1;
        $: console.log(a);
    </script>
`;

        let output = `
    <script>
        let a = 1;
        $effect(() => {
console.log(a)
});
    </script>
`;
        await compareOutput(input, v4Output, { runes: false });
        await compareOutput(input, output, { runes: true });
        await compareOutput(input, output);
    });

    test('multiple arguments', async () => {
        let input = `
        <script>
            let a = 1;
            let b = 2;
            let c = 3;
            let d = 4;
            $log(a,b,c,d);
        </script>
`;

        let v4Output = `
    <script>
        let a = 1;
        let b = 2;
        let c = 3;
        let d = 4;
        $: console.log(a,b,c,d);
    </script>
`;

        let output = `
<script>
        let a = 1;
        let b = 2;
        let c = 3;
        let d = 4;
        $effect(() => {
    console.log(a,b,c,d)
});
    </script>
`;
        await compareOutput(input, v4Output, { runes: false });
        await compareOutput(input, output, { runes: true });
        await compareOutput(input, output,);
    });

    test('multiple arguments with spread operator', async () => {
        let input = `
<script>
    let a = 1;
    let b = 2;
    let c = 3;
    let d = [a,b,c];
    $log(a,b,c,...d);
</script>
`;

        let v4Output = `
            <script>
    let a = 1;
    let b = 2;
    let c = 3;
    let d = [a,b,c];
    $: console.log(a,b,c,...d);
    </script>
`;

        let output = `
    <script>
    let a = 1;
    let b = 2;
    let c = 3;
    let d = [a,b,c];
    $effect(() => {
console.log(a,b,c,...d)
});
    </script>
`;

        await compareOutput(input, v4Output, { runes: false });
        await compareOutput(input, output, { runes: true });
        await compareOutput(input, output);
    });

    test('sequential $log', async () => {
        let input = `
        <script>
            let a = 1;
            let b = 2;
            $log(a);
            $log(b);
        </script>
`;

        let v4Output = `
    <script>
        let a = 1;
        let b = 2;
        $: console.log(a);
        $: console.log(b);
    </script>
`;

        let output = `
<script>
        let a = 1;
        let b = 2;
        $effect(() => {
    console.log(a)
});
        $effect(() => {
    console.log(b)
});
    </script>
`;
        await compareOutput(input, v4Output, { runes: false });
        await compareOutput(input, output, { runes: true });
        await compareOutput(input, output);
    });
});

import { describe, test } from "vitest";
import { compareOutput } from "./helpers";

describe("$gsp rune", () => {
    test("single getter", async () => {
        let input = `
        <script>
            let a = 1;
            let res = $gsp({a})
        </script>
`

        let output = `
    <script>
        let a = 1;
        let res = {
get a() { return a; }
}
    </script>
`
        await compareOutput(input, output);
    })

    test("multiple getters", async () => {
        let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = $gsp({a,b,c})
        </script>
`

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
`
        await compareOutput(input, output);
    })

    test("single setter", async () => {
        let input = `
        <script>
            let a = 1;
            let res = $gsp({}, {a})
        </script>
`

        let output = `
    <script>
        let a = 1;
        let res = {
set a(value) { a = value; }
}
    </script>
`
        await compareOutput(input, output);
    })

    test("multiple setters", async () => {
        let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = $gsp({},{a,b,c})
        </script>
`

        let output = `
    <script>
        let a = 1;
        let b = 1;
        let c = 1;
        let res = {
set a(value) { a = value; },
set b(value) { b = value; },
set c(value) { c = value; }
}
    </script>
`
        await compareOutput(input, output);
    })

    test("mixed getters and setters", async () => {
        let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = $gsp({a,b,c},{a,b,c})
        </script>
`

        let output = `
    <script>
        let a = 1;
        let b = 1;
        let c = 1;
        let res = {
get a() { return a; },
get b() { return b; },
get c() { return c; },
set a(value) { a = value; },
set b(value) { b = value; },
set c(value) { c = value; }
}
    </script>
`
        await compareOutput(input, output);
    })

    test("mixed getters,setters and props", async () => {
        let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = $gsp({a,b,c},{a,b,c}, {foo:'bar', baz:5, fizz:true})
        </script>
`

        let output = `
    <script>
        let a = 1;
        let b = 1;
        let c = 1;
        let res = {
get a() { return a; },
get b() { return b; },
get c() { return c; },
set a(value) { a = value; },
set b(value) { b = value; },
set c(value) { c = value; },
foo:'bar',
baz:5,
fizz:true
}
    </script>
`
        await compareOutput(input, output);
    })

})
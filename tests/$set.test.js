import { describe, test } from "vitest";
import { compareOutput } from "./helpers";

describe("$set rune", () => {
    test("single", async () => {
        let input = `
        <script>
            let a = 1;
            let res = {
                ...$set({a})
            }
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

    test("multiple", async () => {
        let input = `
        <script>
            let a = 1;
            let b = 1;
            let c = 1;
            let res = {
                ...$set({a,b,c})
            }
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
})
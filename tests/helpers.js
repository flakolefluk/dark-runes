import { expect } from "vitest";
import { processDarkRunes } from "../src/index.js";
import dedent from "dedent"

export async function compareOutput(input, output) {
    const { markup } = processDarkRunes({});

    let processed = await markup({ content: input })
    expect(dedent(processed?.code || "")).toBe(dedent(output))
}
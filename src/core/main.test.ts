import { describe, it } from "vitest";
import { Main } from "./main";

describe.only("Tests for main", () => {
    it("should pass", () => {
        const main = new Main(10);
        main.run()
    });
})
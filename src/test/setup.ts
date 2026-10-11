import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

// jest-dom's bundled Vitest typings still declare Assertion with one type
// parameter, which no longer matches Vitest 5, so declare the matchers here.
declare module "vitest" {
	interface Assertion<R extends void | Promise<void> = void, T = unknown>
		extends TestingLibraryMatchers<unknown, R> {
		_value?: T;
	}
	interface AsymmetricMatchersContaining
		extends TestingLibraryMatchers<unknown, unknown> {}
}

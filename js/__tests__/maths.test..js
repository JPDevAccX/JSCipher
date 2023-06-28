import { factorial } from "../maths";

globalThis.console.error = () => {} ; // Suppress error output - we only care that the tests pass

test('factorial(0)', () => {
	expect(factorial(0)).toBe(1);
});
test('factorial(1)', () => {
	expect(factorial(1)).toBe(1);
});
test('factorial(2)', () => {
	expect(factorial(2)).toBe(2);
});
test('factorial(3)', () => {
	expect(factorial(3)).toBe(6);
});
test('factorial(17)', () => {
	expect(factorial(17)).toBe(355687428096000);
});
// (higher values will lead to floating-point rounding errors)
test('factorial(-1) (invalid)', () => {
	expect(factorial(-1)).toBe(false); // (invalid input)
});
test('factorial(0.5) (invalid)', () => {
	expect(factorial(0.5)).toBe(false); // (invalid input)
});
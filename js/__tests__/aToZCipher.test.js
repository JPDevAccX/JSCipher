import AToZCipher from "../ciphers/aToZCipher";

const identityTransform = (c) => c ;
const shiftRightOne = (c) => (c + 1) ;

const boundaryTestInput = '@AZ[`az{' // (boundary testing for pass-through)

test('processText() with boundary condition characters and identity transform function', () => {
	const aToZCipher = new AToZCipher() ;
	expect(aToZCipher.processText(boundaryTestInput, identityTransform)).toBe(boundaryTestInput) ;
});

test('processText() with non-identity transform function', () => {
	const aToZCipher = new AToZCipher() ;
	expect(aToZCipher.processText("ABC", shiftRightOne)).toBe("BCD") ;
});
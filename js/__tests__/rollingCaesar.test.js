import CipherRollingCaesar from "../ciphers/rollingCaesar";

const boundaryTestInput = '@AZ[`az{' // (boundary testing for pass-through)

test('processText() encode with boundary characters and default shift values', () => {
	const cipherRollingCaesar = new CipherRollingCaesar() ;
	expect(cipherRollingCaesar.processText(boundaryTestInput, 1)).toBe("@YY[`cc{") ;
});

test('processText() decode with boundary characters and default shift values', () => {
	const cipherRollingCaesar = new CipherRollingCaesar() ;
	expect(cipherRollingCaesar.processText("@YY[`cc{", -1)).toBe(boundaryTestInput) ;
});

test('processText() encode with default shift values, full cycle', () => {
	const cipherRollingCaesar = new CipherRollingCaesar() ;
	expect(cipherRollingCaesar.processText("AAAAAAAAAAAAAAAAAAAAAAAAAAA", 1)).toBe("XYZABCDEFGHIJKLMNOPQRSTUVWX") ;
});

test('processText() decode with default shift values, full cycle', () => {
	const cipherRollingCaesar = new CipherRollingCaesar() ;
	expect(cipherRollingCaesar.processText("XYZABCDEFGHIJKLMNOPQRSTUVWX", -1)).toBe("AAAAAAAAAAAAAAAAAAAAAAAAAAA") ;
});

test('processText() encode with shift values of (1, 5) (set through constructor), one loop around alphabet', () => {
	const cipherRollingCaesar = new CipherRollingCaesar(1, 5) ;
	expect(cipherRollingCaesar.processText("AAAAAAA", 1)).toBe("BGLQVAF") ;
});

test('processText() decode with shift values of (1, 5) (set through setSettingsFieldValue()), one loop around alphabet', () => {
	const cipherRollingCaesar = new CipherRollingCaesar() ;
	cipherRollingCaesar.setSettingsFieldValue('int0', 1) ;
	cipherRollingCaesar.setSettingsFieldValue('int1', 5) ;
	expect(cipherRollingCaesar.processText("BGLQVAF", -1)).toBe("AAAAAAA") ;
});
import CipherCaesar from "../ciphers/caesar";

const boundaryTestInput = '@AZ[`az{' // (boundary testing for pass-through)

test('processText() encode with boundary characters and default shift value', () => {
	const cipherCaesar = new CipherCaesar() ;
	expect(cipherCaesar.processText(boundaryTestInput, 1)).toBe("@XW[`xw{") ;
});

test('processText() decode with boundary characters and default shift value', () => {
	const cipherCaesar = new CipherCaesar() ;
	expect(cipherCaesar.processText("@XW[`xw{", -1)).toBe(boundaryTestInput) ;
});

test('processText() encode with boundary characters and shift value of 13 (set through constructor) (ROT-13)', () => {
	const cipherCaesar = new CipherCaesar(13) ;
	expect(cipherCaesar.processText(boundaryTestInput, 1)).toBe("@NM[`nm{") ;
});

test('processText() decode with boundary characters and default shift of 13 (set through setSettingsFieldValue()) (ROT-13)', () => {
	const cipherCaesar = new CipherCaesar() ;
	cipherCaesar.setSettingsFieldValue('int0', 13) ;
	expect(cipherCaesar.processText(boundaryTestInput, -1)).toBe("@NM[`nm{") ;
});
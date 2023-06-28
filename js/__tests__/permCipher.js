import PermCipher from "../ciphers/permCipher";

test('processText() encode with default settings, partial block', () => {
	const permCipher = new PermCipher() ;
	expect(permCipher.processText("A", 1)).toBe(" A") ;
});

test('processText() decode with default settings, partial block', () => {
	const permCipher = new PermCipher() ;
	expect(permCipher.processText(" A", -1)).toBe("A") ;
});

test('processText() encode with default settings, single block', () => {
	const permCipher = new PermCipher() ;
	expect(permCipher.processText("AB", 1)).toBe("BA") ;
});

test('processText() decode with default settings, single block', () => {
	const permCipher = new PermCipher() ;
	expect(permCipher.processText("BA", -1)).toBe("AB") ;
});

test('processText() encode with default settings, single + partial block', () => {
	const permCipher = new PermCipher() ;
	expect(permCipher.processText("ABC", 1)).toBe("BA C") ;
});

test('processText() decode with default settings, single + partial block', () => {
	const permCipher = new PermCipher() ;
	expect(permCipher.processText("BA C", -1)).toBe("ABC") ;
});

test('processText() encode with largest supported block-length and highest permutation # (set through constructor)', () => {
	const permCipher = new PermCipher(8, 40319) ; // (40319 = 8! - 1)
	expect(permCipher.processText("ABCDEFGH", 1)).toBe("HGFEDCBA") ;
});

test('processText() decode with largest supported block-length and highest permutation # (set through setSettingsFieldValue())', () => {
	const permCipher = new PermCipher() ;
	permCipher.setSettingsFieldValue('int0', 8) ;
	permCipher.setSettingsFieldValue('int1', 40319) ;
	expect(permCipher.processText("HGFEDCBA", -1)).toBe("ABCDEFGH") ;
});

test('getConfigurationDescription() permutation max # after calling constructor with custom block length', () => {
	const permCipher = new PermCipher(5, 1) ;
	expect(permCipher.getConfigurationDescription()[1].maxValue).toBe(119) ; // (119 = 5! - 1)
});

test('getConfigurationDescription() permutation max # after calling setSettingsFieldValue() with custom block length', () => {
	const permCipher = new PermCipher() ;
	permCipher.setSettingsFieldValue('int0', 5) ;
	expect(permCipher.getConfigurationDescription()[1].maxValue).toBe(119) ; // (119 = 5! - 1)
});
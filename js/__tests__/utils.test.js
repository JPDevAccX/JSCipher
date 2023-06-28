/** @jest-environment jsdom */

// https://stackoverflow.com/questions/47788199/is-it-possible-to-test-with-jest-an-old-non-module-javascript/59969255#59969255
const script = (url) => {
	const { protocol } = new URL(url, 'file://');
	switch (protocol) {
		case 'file:':
			return require('fs').readFileSync(`${process.cwd()}/${url}`, 'UTF8');
		default:
			throw new Error('unsupported protocol');
	}
};
eval(script('js/utils.js'));

test('getElementsBySelector()', () => {
	document.write(`
		<div id="test1">Test1</div>
		<span class="test2">Test2</div>
	`) ;

	const keysToSelectorsTable = {test1: '#test1', test2: '.test2'}
	const keysToRetrieve = ['test1', 'test2'] ;
	const els = getElementsBySelector(keysToSelectorsTable, keysToRetrieve) ;
	expect(els.test1).toBe(document.getElementById('test1'));
	expect(els.test2).toBe(document.getElementsByClassName('test2')[0]);
});

test('getNodeIndex()', () => {
	document.write(`
		<div id="outer1">
			<span id="inner1">Inner1</span>
			<span id="inner2">Inner2</span>
		</div>
		<div id="outer2"></div>
	`) ;

	expect(getNodeIndex(document.getElementById('outer1'))).toBe(0);
	expect(getNodeIndex(document.getElementById('inner1'))).toBe(0);
	expect(getNodeIndex(document.getElementById('inner2'))).toBe(1);
	expect(getNodeIndex(document.getElementById('outer2'))).toBe(1);
});

test('getNodeIndexOfAncestorWithClass()', () => {
	document.write(`
		<div class="outer">
			<div class="mid">
				<span id="innerA1">Inner1</span>
				<span id="innerA2">Inner2</span>
			</div>
			<div id="mid2" class="mid another-class">
				<span id="innerB1">Inner1</span>
				<span id="innerB2">Inner2</span>
			</div>
		</div>
	`) ;

	expect(getNodeIndexOfAncestorWithClass(document.getElementById('mid2'), 'mid')).toBe(null); // (no ancestor with class 'mid')
});
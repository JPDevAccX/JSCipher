import AToZCipher from "./aToZCipher.js";

export default class CipherCaesar extends AToZCipher {
	constructor(shift) {
		super() ;
		this.shift = (shift === undefined) ? CipherCaesar.getDefaultValues()[0] : shift ;
	}

	static get displayName() {
		return "Caesar" ;
	}

	get displayName() {
		return CipherCaesar.displayName ;
	}

	static getConfigurationDescription() {
		return [{id: "int0", name: "shift", type: "int", label: 'RShift', minValue: 1, maxValue: 25}] ;
	}

	getConfigurationDescription() {
		return CipherCaesar.getConfigurationDescription() ;
	}

	getInfo() {
		return (this.shift === 13) && 
			{
				title: "Reciprocal (ROT-13)",
				desc : "These settings create the \"ROT-13\" cipher where the encoding and decoding operations are the same."
			}
	}

	static getDefaultValues() {
		return [23] ; // Equivalent to left-shift of 3 (the original Caesar Cipher)
	}

	getCurrentValues() {
		return [this.shift] ;
	}

	_generateKeyStreamValue() {
		return this.shift ; // (iron-clad encryption here for sure!)
	}

	processText(text, shiftSign) {
		return this._processText(text, shiftSign, () => this._generateKeyStreamValue()) ;
	}
	
	_processText(text, shiftSign, generateKeyStreamValueFunc) {
		const transformFunc = (charCode, i) => {
			const keyValue = generateKeyStreamValueFunc(i) ;
			// Calculate the output (note: we have to add this.moduloLen to get correct wrapping behaviour for decode)
			return ((charCode - this.processCharCodeMin) + this.moduloLen + keyValue * shiftSign) % this.moduloLen + this.processCharCodeMin ;
		} ;
		return super.processText(text, transformFunc) ;
	}
}
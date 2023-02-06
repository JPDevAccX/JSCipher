import AToZCipher from "./aToZCipher.js";

export default class CipherCaesar extends AToZCipher {
	constructor(shift) {
		super() ;
		this.shift = (shift === undefined) ? CipherCaesar.getDefaultValues()[0] : shift ;
	}

	static get displayName() {
		return "Caesar Cipher" ;
	}

	get displayName() {
		return CipherCaesar.displayName ;
	}

	setSettingsFieldValue(fieldName, value) {
		this.shift = parseInt(value) ;
	}

	static getConfigurationDescription() {
		return [{type: "int", label: 'RShift', minValue: 1, maxValue: 25}] ;
	}

	getConfigurationDescription() {
		return CipherCaesar.getConfigurationDescription() ;
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
		const transformFunc = (charCode) => {
			const keyValue = this._generateKeyStreamValue() ;
			// Calculate the output (note: we have to add this.moduloLen to get correct wrapping behaviour for decode)
			return ((charCode - this.processCharCodeMin) + this.moduloLen + keyValue * shiftSign) % this.moduloLen + this.processCharCodeMin ;
		} ;
		return super.processText(text, transformFunc) ;
	}
}
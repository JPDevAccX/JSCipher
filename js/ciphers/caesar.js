import AToZCipher from "./aToZCipher.js";

export default class CipherCaesar extends AToZCipher {
	constructor(shift, keyStreamLen = 1000) {
		super(keyStreamLen) ;
		this.shift = shift ;
	}

	get displayName() {
		return "Caesar Cipher"
	}

	setSettingsFieldValue(fieldName, value) {
		this.shift = parseInt(value) ;
	}

	getConfigurationDescription() {
		return [{type: "int", minValue: 1, maxValue: 25}] ;
	}

	_generateKeyStreamValue() {
		return this.shift ; // (iron-clad encryption here for sure!)
	}

	encodeText(text) {
		return this._processText(text, 1) ;
	}

	decodeText(text) {
		return this._processText(text, -1) ;
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
import CipherCaesar from "./caesar.js";

export default class CipherRollingCaesar extends CipherCaesar {
	constructor(shift, rollingShift) {
		super() ;
		this.shift = (shift === undefined) ? CipherRollingCaesar.getDefaultValues()[0] : shift ;
		this.rollingShift = (rollingShift === undefined) ? CipherRollingCaesar.getDefaultValues()[1] : rollingShift ;
	}

	static get displayName() {
		return "Rolling Caesar" ;
	}

	get displayName() {
		return CipherRollingCaesar.displayName ;
	}

	setSettingsFieldValue(fieldName, value) {
		if (fieldName === 'int0') this.shift = parseInt(value) ;
		else this.rollingShift = parseInt(value) ;
	}

	static getConfigurationDescription() {
		return [
			{type: "int", label: 'RShift', minValue: 1, maxValue: 25},
			{type: "int", label: 'RRShift', minValue: 1, maxValue: 25}
		] ;
	}

	getConfigurationDescription() {
		return CipherRollingCaesar.getConfigurationDescription() ;
	}

	static getDefaultValues() {
		return [23, 1] ; // Equivalent to left-shift of 3 (the original Caesar Cipher) for first character
	}

	getCurrentValues() {
		return [this.shift, this.rollingShift] ;
	}

	_generateKeyStreamValue(i) {
		return (this.shift + i * this.rollingShift) % this.moduloLen; // (marginally better encryption!)
	}

	processText(text, shiftSign) {
		return this._processText(text, shiftSign, (i) => this._generateKeyStreamValue(i)) ;
	}
}
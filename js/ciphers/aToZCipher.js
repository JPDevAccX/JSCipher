import StreamCipher from "./streamCipher.js";

export default class AToZCipher extends StreamCipher {
	constructor() {
		super() ;
		
		this.processCharCodeMin = "A".charCodeAt(0) ;
		this.processCharCodeMax = "Z".charCodeAt(0) ;
		this.moduloLen = (this.processCharCodeMax - this.processCharCodeMin) + 1
	}

	processText(text, transformFunc) {
		const textUpperCase = text.toUpperCase() ;
		let out = '' ;
		for (let i = 0; i < text.length; i++) {
			const charCode = textUpperCase.charCodeAt(i) ;
			if (charCode >= this.processCharCodeMin && charCode <= this.processCharCodeMax) {
				const capsMask = (text.charCodeAt(i) & 32) ;
				const newCharCode = transformFunc(charCode) ;
				out += String.fromCharCode(newCharCode | capsMask) ;
			}
			else out += String.fromCharCode(charCode) ;
		}
		return out ;
	}
}
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

			// Handle the character if it's within the range A-Z (after conversion to uppercase)
			if (charCode >= this.processCharCodeMin && charCode <= this.processCharCodeMax) {
				const capsMask = (text.charCodeAt(i) & 32) ; // Extract the bitmask representing the original capitalisation
				const newCharCode = transformFunc(charCode, i) ; // Get new character code after encoding / decoding
				out += String.fromCharCode(newCharCode | capsMask) ; // Add the character to the string after re-applying the original capitalisation
			}
			else out += String.fromCharCode(text.charCodeAt(i)) ; // Pass-through on unhandled characters
		}
		return out ;
	}
}
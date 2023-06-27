import Cipher from "./cipher.js";

export default class PermCipher extends Cipher {
	constructor(blockLen, permutationCode) {
		super() ;
		this.blockLen = (blockLen === undefined) ? PermCipher.getDefaultValues()[0] : blockLen ;
		this.permutationCode = (permutationCode === undefined) ? PermCipher.getDefaultValues()[1] : permutationCode ;
		this._generatePositionTables() ;
	}

	_generatePositionTables() {
		this.availablePositions = [...Array(this.blockLen).keys()] ;
		let permutationCodeRemainder = this.permutationCode ;
		this.positionTableEncode = [] ;
		let i = 0 ;
		do {
			// Get position index (in the remaining available positions list)
			const radix = this.blockLen - i ;
			const divider = factorial(radix - 1) ;
			const positionIndex =  Math.floor(permutationCodeRemainder / divider) ;
			permutationCodeRemainder -= (positionIndex * divider) ;
			
			// Calculate the actual position and remove it from the list of those remaining
			const position = this.availablePositions[positionIndex] ;
			this.availablePositions = this.availablePositions.filter(val => val !== position) ;

			// Add position to the table and proceed to the next character
			this.positionTableEncode[i] = position ;
			i++ ;
		}
		while (i < this.blockLen) ;
	
		// Invert the table for decode
		this.positionTableDecode = [] ;
		for (const [i, position] of this.positionTableEncode.entries()) {
			this.positionTableDecode[position] = i ;
		}

		// Determine if the tables are the same (and the cipher is symmetric)
		this.isSymmetric = (this.positionTableEncode.toString() === this.positionTableDecode.toString()) ;
	}

	static get displayName() {
		return "Permutation" ;
	}

	get displayName() {
		return PermCipher.displayName ;
	}

	setSettingsFieldValue(fieldName, value) {
		if (fieldName === 'int0') this.blockLen = parseInt(value) ;
		else this.permutationCode = parseInt(value) ;

		const maxPermutationCode = this.getConfigurationDescription()[1].maxValue ;
		this.permutationCode = Math.min(this.permutationCode, maxPermutationCode) ;
		this._generatePositionTables() ;
	}

	getConfigurationDescription() {
		return [
			{type: "int", label: 'BlockLen', minValue: 2, maxValue: 8},
			{type: "int", label: 'Perm #', minValue: 1, maxValue: factorial(this.blockLen) - 1}
		] ;
	}

	getInfo() {
		return this.isSymmetric && 
			{
				title: "Symmetric",
				desc : "These settings create a cipher where the encoding and decoding operations are the same."
			}
	}

	static getDefaultValues() {
		return [3, 1] ;
	}

	getCurrentValues() {
		return [this.blockLen, this.permutationCode] ;
	}

	processText(text, encodingDir) {
		if (text === '') return "" ;

		const positionTable = (encodingDir === 1) ? this.positionTableEncode : this.positionTableDecode ;

		// Apply padding if text is not a multiple of the block-length
		const align = text.length % this.blockLen ;
		const paddingCharsRequired = (align === 0) ? 0 : this.blockLen - align ;
		text = text.padEnd(text.length + paddingCharsRequired, " ") ;

		let textOut = '' ;
		const textInArray = text.split('') ;
		for (const i of textInArray.keys()) {
			const positionOffsetForBlock = Math.floor(i / this.blockLen) * this.blockLen ;
			const offsetInBlock = i % this.blockLen ;
			const position = positionTable[offsetInBlock] ;
			textOut += textInArray[positionOffsetForBlock + position] ;
		}

		return textOut ;
	}
}
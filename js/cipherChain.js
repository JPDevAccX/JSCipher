import Cipher from "./ciphers/cipher.js";

export default class CipherChain {
	constructor(maxCipherInstances = 5) {
		this.cipherInstances = [] ;
		this.maxCipherInstances = maxCipherInstances ;
	}

	addCipherInstanceFromClass(cipherClass) {
		if (this.cipherInstances.length >= this.maxCipherInstances) {
			return consoleErrAndReturnNull('Maximum number of cipher instances already reached') ;
		}
		const cipherInstance = new cipherClass() ;
		if (!instanceCheck(cipherInstance, Cipher)) return consoleErrAndReturnNull('Argument 1 was not a Cipher Class') ;
		this.cipherInstances.push(cipherInstance) ;
		return {cipherInstance, isMaxCipherInstances: this.cipherInstances.length === this.maxCipherInstances}  ;
	}

	removeCipherInstance(i) {
		this.cipherInstances.splice(i, 1) ;
	}

	processText(stageText, dir) {
		if (dir === -1) {
			for (let i = this.cipherInstances.length - 1; i >= 0; i--) {
				stageText = this.cipherInstances[i].processText(stageText, dir) ;
			}
		}
		else {
			for (let i = 0; i < this.cipherInstances.length; i++) {
				stageText = this.cipherInstances[i].processText(stageText, dir) ;
			}
		}
		return stageText ;
	}
}
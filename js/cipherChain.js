import Cipher from "./ciphers/cipher.js";

export default class CipherChain {
	constructor(maxCipherInstances = 5) {
		this.cipherInstances = [] ;
		this.maxCipherInstances = maxCipherInstances ;
	}

	addCipherInstance(cipher) {
		if (!instanceCheck(cipher, Cipher)) return consoleErrAndReturnNull('Argument 1 is not a Cipher') ;
		if (this.cipherInstances.length >= this.maxCipherInstances) return null ;
		this.cipherInstances.push(cipher) ;
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
// Type: Module (with side-effects)
import CipherChain from './cipherChain.js' ;
import UIManager from './uiManager.js';
import selectors from './selectors.js' ;
import CipherCaesar from './ciphers/caesar.js' ;
import CipherRollingCaesar from './ciphers/rollingCaesar.js';
import CipherPerm from './ciphers/permCipher.js';

const cipherChain = new CipherChain() ;
const textInputEl = document.querySelector(selectors.textInput) ;
const textOutputEl = document.querySelector(selectors.textOutput) ;
textInputEl.addEventListener('input', (e) => handleUpdate(e.target.value)) ;
document.querySelector(selectors.encodeDecodeSelector).addEventListener('change', (e) => selectEncodeOrDecodeMode(e.target.id)) ;
const uiManager = new UIManager(selectors, addActiveCipherInstance, handleUpdate, removeActiveCipherInstance) ;

// Add Cipher Classes
uiManager.addCipherClass(CipherCaesar) ;
uiManager.addCipherClass(CipherRollingCaesar) ;
uiManager.addCipherClass(CipherPerm) ;

/// -----------------------------------------

function handleUpdate(val = null) {
	if (val === null) val = textInputEl.value ;
	textOutputEl.value = cipherChain.processText(val, (mode === 'mode_enc') ? 1 : -1) ;
}

function addActiveCipherInstance(cipherClass) {
	const {cipherInstance, isMaxCipherInstances} = cipherChain.addCipherInstanceFromClass(cipherClass) ;
	handleUpdate() ;
	return {cipherInstance, isMaxCipherInstances} ;
}

function removeActiveCipherInstance(i) {
	cipherChain.removeCipherInstance(i) ;
	handleUpdate() ;
}

let mode = 'mode_enc'; // Initial mode
function selectEncodeOrDecodeMode(newMode) {
	mode = newMode ;
	handleUpdate() ;
}
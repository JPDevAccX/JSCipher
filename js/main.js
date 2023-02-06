// Type: Module (with side-effects)
import CipherChain from './cipherChain.js' ;
import CipherCaesar from './ciphers/caesar.js' ;
import UIManager from './uiManager.js';
import selectors from './selectors.js' ;

const maxCipherInstances = 10 ;

const cipherChain = new CipherChain() ;

const cipherCaesar = new CipherCaesar() ;
const cipherCaesar2 = new CipherCaesar() ;

const textInputEl = document.querySelector(selectors.textInput) ;
const textOutputEl = document.querySelector(selectors.textOutput) ;

textInputEl.addEventListener('input', (e) => handleUpdate(e.target.value)) ;
document.querySelector(selectors.encodeDecodeSelector).addEventListener('change', (e) => selectEncodeOrDecodeMode(e.target.id)) ;

const uiManager = new UIManager(selectors, addActiveCipherInstance, handleUpdate) ;

uiManager.addSelectionUIForCipherClass(CipherCaesar) ;

function handleUpdate(val = null) {
	if (val === null) val = textInputEl.value ;
	textOutputEl.value = cipherChain.processText(val, (mode === 'mode_enc') ? 1 : -1) ;
}

function addActiveCipherInstance(cipherClass) {
	if (cipherChain.getNumInstances() >= maxCipherInstances) return null ;
	const cipherInstance = new cipherClass() ;
	cipherChain.addCipherInstance(cipherInstance) ;
	handleUpdate() ;
	return cipherInstance ;
}

let mode = 'mode_enc';
function selectEncodeOrDecodeMode(newMode) {
	mode = newMode ;
	handleUpdate() ;
}
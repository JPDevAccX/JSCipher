// Type: Module (with side-effects)
import CipherCaesar from './ciphers/caesar.js' ;
import UIManager from './uiManager.js';
import selectors from './selectors.js' ;

const caesarCipher = new CipherCaesar(3) ;

const textInputEl = document.querySelector(selectors.textInput) ;
const textOutputEl = document.querySelector(selectors.textOutput) ;

textInputEl.addEventListener('input', (e) => handleUpdate(e.target.value)) ;
document.querySelector(selectors.encodeDecodeSelector).addEventListener('change', (e) => selectEncodeOrDecodeMode(e.target.id)) ;

const uiManager = new UIManager(selectors, handleUpdate) ;

uiManager.addSettingsUIForCipher(caesarCipher, [3]) ;

function handleUpdate(val = null) {
	if (val === null) val = textInputEl.value ;
	textOutputEl.value = caesarCipher.processText(val, (mode === 'mode_enc') ? 1 : -1) ;
}

let mode = 'mode_enc';
function selectEncodeOrDecodeMode(newMode) {
	mode = newMode ;
	handleUpdate() ;
}
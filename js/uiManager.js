import Cipher from "./ciphers/cipher.js";

export default class UIManager {
	constructor(selectors, updateResultsCallback) {
		this.selectors = selectors ;
		this.updateResultsCallback = updateResultsCallback ;
		this.ciphers = [] ;

		const keysToRetrieve = [
			'cipherSelectionContainer', 'cipherStageContainer', 'cipherSettingsContainer',
			'templateSingleIntSetting'
		] ;
		this.els = getElementsBySelector(selectors, keysToRetrieve) ;
		this.els.cipherSettingsContainer.addEventListener('input', (e) => this.handleSettingsInput(e.target)) ;
	}

	addSettingsUIForCipher(cipher, initialValues) {
		if (!instanceCheck(cipher, Cipher)) return consoleErrAndReturnNull('Argument 1 is not a Cipher') ;

		const cipherIndex = this.ciphers.length ;
		this.ciphers.push(cipher) ;

		const settingsToTemplate = {'int' : 'templateSingleIntSetting'} ;
		const confDesc = cipher.getConfigurationDescription() ;
		const settingsType = confDesc.reduce((str, {type}) => str + type, "") ;
		const template = settingsToTemplate[settingsType] ;
		if (template) {
			const settingsEl = this.els[template].content.firstElementChild.cloneNode(true);
			if (settingsEl) {
				settingsEl.dataset.cipherIndex = cipherIndex ;
				settingsEl.querySelector(this.selectors.templateSettingCipherName).innerText = cipher.displayName ;

				// Single integer setting
				if (template === 'templateSingleIntSetting') {
					const inputId = cipherIndex + '_int' ;
					settingsEl.querySelector(this.selectors.templateSingleIntSettingLabel).htmlFor = inputId ;

					const intInputEl = settingsEl.querySelector(this.selectors.templateSingleIntInput) ;
					intInputEl.id = inputId ;
					intInputEl.dataset.fieldName = 'int' ;
					intInputEl.min = confDesc[0].minValue ;
					intInputEl.value = initialValues[0] ;
					intInputEl.max = confDesc[0].maxValue ;
			}

				this.els.cipherSettingsContainer.appendChild(settingsEl) ;
			}
			else console.error("No template element for this combination of settings") ;
		}
		else console.error("No template definition for this combination of settings") ;
	}

	handleSettingsInput(target) {
		const cipherIndex = target.parentNode.dataset.cipherIndex ;
		const fieldName = target.dataset.fieldName ;
		let value = target.value ;
		if (isNaN(parseInt(value))) {
			value = 0 ;
			target.value = value ;
		}
		this.ciphers[cipherIndex].setSettingsFieldValue(fieldName, value)
		this.updateResultsCallback() ;
	}
}
import Cipher from "./ciphers/cipher.js";

export default class UIManager {
	constructor(selectors, addActiveCipherInstanceCallback, handleSettingsChangeCallback) {
		this.selectors = selectors ;
		this.addActiveCipherInstanceCallback = addActiveCipherInstanceCallback ;
		this.handleSettingsChangeCallback = handleSettingsChangeCallback ;
		this.cipherClasses = [] ;
		this.cipherInstances = [] ;

		const keysToRetrieve = [
			'cipherSelectionContainer', 'templateCipherAdd',
			'cipherSettingsContainer', 'templateSingleIntSetting'
		] ;
		this.els = getElementsBySelector(selectors, keysToRetrieve) ;
		this.els.cipherSelectionContainer.addEventListener('click', (e) => {
			if (e.target.dataset.cipherClassIndex) this.addCipherInstance(e.target) ;
		}) ;
		this.els.cipherSettingsContainer.addEventListener('input', (e) => this.handleSettingsInput(e.target)) ;
	}

	addSelectionUIForCipherClass(cipherClass) {
		const cipherClassIndex = this.cipherClasses.length ;
		this.cipherClasses.push(cipherClass) ;

		const cipherAddEl = this.els.templateCipherAdd.content.firstElementChild.cloneNode(true);
		cipherAddEl.querySelector(this.selectors.cipherAddButton).dataset.cipherClassIndex = cipherClassIndex ;
		cipherAddEl.querySelector(this.selectors.cipherAddButton).id = 'cipherClass_' + cipherClassIndex ;
		cipherAddEl.querySelector(this.selectors.cipherAddButton).innerText = cipherClass.displayName ;
		this.els.cipherSelectionContainer.appendChild(cipherAddEl) ;
	}

	addCipherInstance(target) {
		const cipherClass = this.cipherClasses[target.dataset.cipherClassIndex] ;
		console.log(cipherClass) ;
		const cipherInstance = this.addActiveCipherInstanceCallback(cipherClass) ;
		if (cipherInstance) this.addSettingsUIForCipherInstance(cipherInstance) ;
	}

	addSettingsUIForCipherInstance(cipher) {
		if (!instanceCheck(cipher, Cipher)) return consoleErrAndReturnNull('Argument 1 is not a Cipher') ;

		const cipherInstanceIndex = this.cipherInstances.length ;
		this.cipherInstances.push(cipher) ;

		const settingsToTemplate = {'int' : 'templateSingleIntSetting'} ;
		const confDesc = cipher.getConfigurationDescription() ;
		const settingsType = confDesc.reduce((str, {type}) => str + type, "") ;
		const template = settingsToTemplate[settingsType] ;
		if (template) {
			const settingsEl = this.els[template].content.firstElementChild.cloneNode(true);
			if (settingsEl) {
				settingsEl.dataset.cipherInstanceIndex = cipherInstanceIndex ;
				settingsEl.querySelector(this.selectors.templateSettingCipherName).innerText = cipher.displayName ;

				// Single integer setting
				if (template === 'templateSingleIntSetting') {
					const inputId = cipherInstanceIndex + '_int' ;
					settingsEl.querySelector(this.selectors.templateSingleIntSettingLabel).htmlFor = inputId ;
					settingsEl.querySelector(this.selectors.templateSingleIntSettingLabel).innerText = confDesc[0].label ;

					const intInputEl = settingsEl.querySelector(this.selectors.templateSingleIntInput) ;
					intInputEl.id = inputId ;
					intInputEl.dataset.fieldName = 'int' ;
					intInputEl.min = confDesc[0].minValue ;
					intInputEl.value = cipher.getCurrentValues()[0] ;
					intInputEl.max = confDesc[0].maxValue ;
			}

				this.els.cipherSettingsContainer.appendChild(settingsEl) ;
			}
			else console.error("No template element for this combination of settings") ;
		}
		else console.error("No template definition for this combination of settings") ;
	}

	handleSettingsInput(target) {
		const cipherInstanceIndex = target.parentNode.dataset.cipherInstanceIndex ;
		const fieldName = target.dataset.fieldName ;
		let value = target.value ;
		if (isNaN(parseInt(value))) {
			value = 0 ;
			target.value = value ;
		}
		this.cipherInstances[cipherInstanceIndex].setSettingsFieldValue(fieldName, value) ;
		this.handleSettingsChangeCallback() ;
	}
}
import Cipher from "./ciphers/cipher.js";

export default class UIManager {
	constructor(selectors, addActiveCipherInstanceCallback, handleSettingsChangeCallback, removeActiveCipherInstanceCallback) {
		this.selectors = selectors ;
		this.addActiveCipherInstanceCallback = addActiveCipherInstanceCallback ;
		this.handleSettingsChangeCallback = handleSettingsChangeCallback ;
		this.removeActiveCipherInstanceCallback = removeActiveCipherInstanceCallback ;
		this.cipherClasses = [] ;
		this.cipherInstances = [] ;

		const keysToRetrieve = [
			'cipherSelectionContainer', 'templateCipherAdd',
			'cipherSettingsContainer',
			'templateSettings_int', 'templateSettings_intint',
		] ;
		this.els = getElementsBySelector(selectors, keysToRetrieve) ;
		this.els.cipherSelectionContainer.addEventListener('click', (e) => {
			if (e.target.dataset.cipherClassIndex) this.addActiveCipherInstance(e.target) ;
		}) ;
		this.els.cipherSettingsContainer.addEventListener('input', (e) => this.handleSettingsInput(e.target)) ;
		this.els.cipherSettingsContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('remove_instance_button')) this.handleCipherInstanceRemoval(e.target) ;
		}) ;
	}

	addCipherClass(cipherClass) {
		const cipherClassIndex = this.cipherClasses.length ;
		this.cipherClasses.push(cipherClass) ;

		const cipherAddEl = this.els.templateCipherAdd.content.firstElementChild.cloneNode(true);
		cipherAddEl.querySelector(this.selectors.cipherAddButton).dataset.cipherClassIndex = cipherClassIndex ;
		cipherAddEl.querySelector(this.selectors.cipherAddButton).id = 'cipherClass_' + cipherClassIndex ;
		cipherAddEl.querySelector(this.selectors.cipherAddButton).innerText = cipherClass.displayName ;
		this.els.cipherSelectionContainer.appendChild(cipherAddEl) ;
	}

	addActiveCipherInstance(target) {
		const cipherClass = this.cipherClasses[target.dataset.cipherClassIndex] ;
		const cipherInstance = this.addActiveCipherInstanceCallback(cipherClass) ;
		if (cipherInstance) this.addCipherInstanceEl(cipherInstance) ;
	}

	addCipherInstanceEl(cipherInstance) {
		if (!instanceCheck(cipherInstance, Cipher)) return consoleErrAndReturnNull('Argument 1 is not a Cipher') ;

		const cipherInstanceIndex = this.cipherInstances.length ;
		this.cipherInstances.push(cipherInstance) ;

		const confDesc = cipherInstance.getConfigurationDescription() ;
		const settingsType = confDesc.reduce((str, {type}) => str + type, "") ;
		const templateElKey = 'templateSettings_' + settingsType ;
		if (templateElKey) {
			const settingsEl = this.els[templateElKey].content.firstElementChild.cloneNode(true);
			if (settingsEl) {
				settingsEl.querySelector(this.selectors.templateSettingCipherName).innerText = cipherInstance.displayName ;

				// Integer settings
				let intInputIndex = 0 ;
				for (const inputDesc of confDesc) {
					if (inputDesc.type === 'int') {
						const labelSelectorKey = 'templateIntsSettingLabel' + intInputIndex ;
						const inputSelectorKey = 'templateIntsSettingInput' + intInputIndex ;
						const inputId = cipherInstanceIndex + '_int' + intInputIndex ;
						settingsEl.querySelector(this.selectors[labelSelectorKey]).htmlFor = inputId ;
						settingsEl.querySelector(this.selectors[labelSelectorKey]).innerText = inputDesc.label ;

						const intInputEl = settingsEl.querySelector(this.selectors[inputSelectorKey]) ;
						intInputEl.id = inputId ;
						intInputEl.dataset.fieldName = 'int' + intInputIndex ;
						intInputEl.min = inputDesc.minValue ;
						intInputEl.value = cipherInstance.getCurrentValues()[intInputIndex] ;
						intInputEl.max = inputDesc.maxValue ;

						intInputIndex++ ;
					}
				}

				this.els.cipherSettingsContainer.appendChild(settingsEl) ;
			}
			else console.error("No template element for this combination of settings") ;
		}
		else console.error("No template definition for this combination of settings") ;
	}

	handleSettingsInput(target) {
		const cipherInstanceIndex = getNodeIndex(target.parentNode);
		const fieldName = target.dataset.fieldName ;
		let value = target.value ;
		if (isNaN(parseInt(value))) {
			value = 0 ;
			target.value = value ;
		}
		this.cipherInstances[cipherInstanceIndex].setSettingsFieldValue(fieldName, value) ;
		this.handleSettingsChangeCallback() ;
	}

	handleCipherInstanceRemoval(target) {
		const cipherInstanceIndex = getNodeIndex(target.parentNode.parentNode);
		this.removeActiveCipherInstanceCallback(cipherInstanceIndex) ;
		this.removeCipherInstanceEl(cipherInstanceIndex) ;
	}

	removeCipherInstanceEl(cipherInstanceIndex) {
		this.els.cipherSettingsContainer.children[cipherInstanceIndex].remove() ;
		this.cipherInstances.splice(cipherInstanceIndex, 1) ;
	}
}
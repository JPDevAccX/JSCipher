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

	setAddCipherButtonsEnabledState(areEnabled) {
		this.els.cipherSelectionContainer.querySelectorAll('button').forEach((el) => {
			el.disabled = !areEnabled ;
		}) ;
	}

	addActiveCipherInstance(target) {
		const cipherClass = this.cipherClasses[target.dataset.cipherClassIndex] ;
		const {cipherInstance, isMaxCipherInstances} = this.addActiveCipherInstanceCallback(cipherClass) ;
		this.addCipherInstanceEl(cipherInstance) ;
		this.setAddCipherButtonsEnabledState(!isMaxCipherInstances) ;
	}

	addCipherInstanceEl(cipherInstance) {
		if (!instanceCheck(cipherInstance, Cipher)) return consoleErrAndReturnNull('Argument 1 is not a Cipher') ;

		const cipherInstanceIndex = this.cipherInstances.length ;
		this.cipherInstances.push(cipherInstance) ;

		const confDesc = cipherInstance.getConfigurationDescription() ;
		const settingsType = confDesc.reduce((str, {type}) => str + type, "") ;
		const templateElKey = 'templateSettings_' + settingsType ;
		const settingsEl = this.els[templateElKey].content.firstElementChild.cloneNode(true);
		if (settingsEl) {
			settingsEl.querySelector(this.selectors.templateSettingCipherName).innerText = cipherInstance.displayName ;

			// Integer settings
			let intInputIndex = 0 ;
			for (const inputDesc of confDesc) {
				if (inputDesc.type === 'int') {
					const inputSelectorKey = 'templateIntsSettingInput' + intInputIndex ;
					const labelSelectorKey = 'templateIntsSettingLabel' + intInputIndex ;
					settingsEl.querySelector(this.selectors[labelSelectorKey]).innerText = inputDesc.label ;

					const intInputEl = settingsEl.querySelector(this.selectors[inputSelectorKey]) ;
					intInputEl.dataset.fieldName = 'int' + intInputIndex ;
					this.initIntSettingsForCipherInstanceEl(cipherInstance, inputDesc, intInputEl, intInputIndex) ;

					intInputIndex++ ;
				}
			}
			
			this.els.cipherSettingsContainer.appendChild(settingsEl) ;
		}
		else console.error("No template element for this combination of settings") ;
	}

	handleSettingsInput(target) {
		const cipherInstanceIndex = getNodeIndexOfAncestorWithClass(target, "settings");
		const fieldName = target.dataset.fieldName ;
		let value = target.value ;
		if (isNaN(parseInt(value))) {
			value = 0 ;
			target.value = value ;
		}
		const cipherInstance = this.cipherInstances[cipherInstanceIndex] ;

		cipherInstance.setSettingsFieldValue(fieldName, value) ;
		this.handleSettingsChangeCallback() ;

		const confDesc = cipherInstance.getConfigurationDescription() ;
		const settingsEl = this.els.cipherSettingsContainer.children[cipherInstanceIndex] ;

		// Integer settings
		let intInputIndex = 0 ;
		for (const inputDesc of confDesc) {
			if (inputDesc.type === 'int') {
				const inputSelectorKey = 'templateIntsSettingInput' + intInputIndex ;
				const intInputEl = settingsEl.querySelector(this.selectors[inputSelectorKey]) ;
				this.initIntSettingsForCipherInstanceEl(cipherInstance, inputDesc, intInputEl, intInputIndex) ;
				intInputIndex++ ;
			}
		}
	}

	handleCipherInstanceRemoval(target) {
		const cipherInstanceIndex = getNodeIndexOfAncestorWithClass(target, "settings");
		this.removeActiveCipherInstanceCallback(cipherInstanceIndex) ;
		this.removeCipherInstanceEl(cipherInstanceIndex) ;
		this.setAddCipherButtonsEnabledState(true) ;
	}

	removeCipherInstanceEl(cipherInstanceIndex) {
		this.els.cipherSettingsContainer.children[cipherInstanceIndex].remove() ;
		this.cipherInstances.splice(cipherInstanceIndex, 1) ;
	}

	initIntSettingsForCipherInstanceEl(cipherInstance, inputDesc, intInputEl, intInputIndex) {
		intInputEl.min = inputDesc.minValue ;
		intInputEl.value = cipherInstance.getCurrentValues()[intInputIndex] ;
		intInputEl.max = inputDesc.maxValue ;
	}
}
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

		// Event listener for adding ciphers to the chain
		this.els.cipherSelectionContainer.addEventListener('click', (e) => {
			if (e.target.dataset.cipherClassIndex) this.addActiveCipherInstance(e.target) ;
		}) ;

		// Event listeners for the settings panel
		this.els.cipherSettingsContainer.addEventListener('input', (e) => this.handleSettingsInput(e.target)) ;
		this.els.cipherSettingsContainer.addEventListener('click', (e) => {
			if (e.target.classList.contains('remove_instance_button')) this.handleCipherInstanceRemoval(e.target) ;
		}) ;
	}

	// Add a cipher class to the ciphers panel
	addCipherClass(cipherClass) {
		const cipherClassIndex = this.cipherClasses.length ;
		this.cipherClasses.push(cipherClass) ;

		const cipherAddEl = this.els.templateCipherAdd.content.firstElementChild.cloneNode(true);
		cipherAddEl.querySelector(this.selectors.cipherAddButton).dataset.cipherClassIndex = cipherClassIndex ;
		cipherAddEl.querySelector(this.selectors.cipherAddButton).id = 'cipherClass_' + cipherClassIndex ;
		cipherAddEl.querySelector(this.selectors.cipherAddButton).innerText = cipherClass.displayName ;
		this.els.cipherSelectionContainer.appendChild(cipherAddEl) ;
	}

	// Enable or disable all the 'add-cipher' buttons
	setAddCipherButtonsEnabledState(areEnabled) {
		this.els.cipherSelectionContainer.querySelectorAll('button').forEach((el) => {
			el.disabled = !areEnabled ;
		}) ;
	}

	// Handle button-click for adding a cipher instance to the chain
	addActiveCipherInstance(target) {
		const cipherClass = this.cipherClasses[target.dataset.cipherClassIndex] ;
		const {cipherInstance, isMaxCipherInstances} = this.addActiveCipherInstanceCallback(cipherClass) ;
		this.addCipherInstanceEl(cipherInstance) ;

		// Disable the 'add-cipher' buttons if maximum chain length has been reached
		this.setAddCipherButtonsEnabledState(!isMaxCipherInstances) ;
	}

	// Add the element for a new cipher instance to the cipher-chain panel
	addCipherInstanceEl(cipherInstance) {
		if (!instanceCheck(cipherInstance, Cipher)) return consoleErrAndReturnNull('Argument 1 is not a Cipher') ;

		this.cipherInstances.push(cipherInstance) ;

		// Get configuration settings and associated template
		const confDesc = cipherInstance.getConfigurationDescription() ;
		const settingsType = confDesc.reduce((str, {type}) => str + type, "") ;
		const settingsEl = this.els['templateSettings_' + settingsType].content.firstElementChild.cloneNode(true);

		// Set the associated values
		if (settingsEl) {
			settingsEl.querySelector(this.selectors.templateSettingCipherName).innerText = cipherInstance.displayName ;

			// Settings
			let intInputIndex = 0 ;
			for (const inputDesc of confDesc) {
				// (integers)
				if (inputDesc.type === 'int') {
					const inputSelectorKey = 'templateIntsSettingInput' + intInputIndex ;
					const labelSelectorKey = 'templateIntsSettingLabel' + intInputIndex ;
					settingsEl.querySelector(this.selectors[labelSelectorKey]).innerText = inputDesc.label ;

					const intInputEl = settingsEl.querySelector(this.selectors[inputSelectorKey]) ;
					intInputEl.dataset.fieldId = 'int' + intInputIndex ;
					this.initIntSettingsForCipherInstanceEl(intInputEl, inputDesc, cipherInstance, intInputIndex) ;

					intInputIndex++ ;
				}
			}

			this.updateInfoButton(settingsEl, cipherInstance, true) ;
			this.els.cipherSettingsContainer.appendChild(settingsEl) ;
		}
		else console.error("No template element for this combination of settings") ;
	}

	// Handle changes to settings
	handleSettingsInput(target) {
		const cipherInstanceIndex = getNodeIndexOfAncestorWithClass(target, "settings");
		const fieldId = target.dataset.fieldId ;
		const cipherInstance = this.cipherInstances[cipherInstanceIndex] ;

		// Update the cipher-instance settings and execute the callback to update the output text
		cipherInstance.setSettingsFieldValue(fieldId, target.value) ;
		this.handleSettingsChangeCallback() ;

		// Update the UI settings (as the cipher instance may have changed them)
		const confDesc = cipherInstance.getConfigurationDescription() ;
		const settingsEl = this.els.cipherSettingsContainer.children[cipherInstanceIndex] ;
		let intInputIndex = 0 ;
		for (const inputDesc of confDesc) {
			// (integers)
			if (inputDesc.type === 'int') {
				const inputSelectorKey = 'templateIntsSettingInput' + intInputIndex ;
				const intInputEl = settingsEl.querySelector(this.selectors[inputSelectorKey]) ;
				this.initIntSettingsForCipherInstanceEl(intInputEl, inputDesc, cipherInstance, intInputIndex) ;
				intInputIndex++ ;
			}
		}

		this.updateInfoButton(settingsEl, cipherInstance) ;
	}

	// Handle button-click for removing a cipher-instance from the chain
	handleCipherInstanceRemoval(target) {
		const cipherInstanceIndex = getNodeIndexOfAncestorWithClass(target, "settings");
		this.removeActiveCipherInstanceCallback(cipherInstanceIndex) ;
		this.removeCipherInstance(cipherInstanceIndex) ;
		this.setAddCipherButtonsEnabledState(true) ;
	}

	// Remove the cipher-instance with the given index
	removeCipherInstance(cipherInstanceIndex) {
		this.els.cipherSettingsContainer.children[cipherInstanceIndex].remove() ;
		this.cipherInstances.splice(cipherInstanceIndex, 1) ;
	}

	// Set min, current, and max values for the given setting associated with a cipher instance
	initIntSettingsForCipherInstanceEl(intInputEl, inputDesc, cipherInstance, intInputIndex) {
		intInputEl.min = inputDesc.minValue ;
		intInputEl.value = cipherInstance.getCurrentValues()[intInputIndex] ;
		intInputEl.max = inputDesc.maxValue ;
	}

	// Update the info button according to the current settings for the specified cipher instance
	updateInfoButton(settingsEl, cipherInstance, isCreating = false) {
		const infoButtonEl = settingsEl.querySelector(this.selectors.infoButton) ;

		// If creating the cipher instance then add the event listener to set the info-modal title / description when the button is clicked
		if (isCreating) {
			infoButtonEl.addEventListener('click', () => {
				const info = cipherInstance.getInfo ? cipherInstance.getInfo() : null ;
				if (info) {
					document.querySelector(this.selectors.modalTitle).innerText = info.title ;
					document.querySelector(this.selectors.modalBody).innerText = info.desc ;
				}
			}) ;
		}

		// Set the button title and visibility
		const info = cipherInstance.getInfo ? cipherInstance.getInfo() : null ;
		if (info) {
			infoButtonEl.title = info.title ;
			infoButtonEl.classList.remove('d-none') ;
		}
		else infoButtonEl.classList.add('d-none') ;
	}
}
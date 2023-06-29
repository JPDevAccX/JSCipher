export default class Cipher {
	setSettingsFieldValue(fieldId, value) {
		const conf = this.getConfigurationDescription() ;
		conf.forEach((c) => {
			if (c.id === fieldId) {
				if (c.type === 'int') {
					value = parseInt(value) ;
					if (isNaN(value)) value = 0 ;
					if (value < c.minValue) value = c.minValue ;
					else if (value > c.maxValue) value = c.maxValue ;
				}
				this[c.name] = value ;
			}
		}) ;
	}

	getConfigurationDescription() {
		throw("Cipher class is missing getConfigurationDescription() method") ;
	}
}
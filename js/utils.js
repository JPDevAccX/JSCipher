// Retrieve the elements for the specified selectors and return as an object
function getElementsBySelector(keysToSelectorsTable, keysToRetrieve) {
	return Object.fromEntries(keysToRetrieve.map(key => ([key, document.querySelector(keysToSelectorsTable[key])]))) ;
}

// Log error to console and return null
function consoleErrAndReturnNull(errMsg) {
	console.error(errMsg) ;
	return null ;
}

// Check arg is instance of type
function instanceCheck(arg, type) {
	return (arg instanceof type) ;
}

// Get index of given node in parent
function getNodeIndex(node) {
	return Array.prototype.indexOf.call(node.parentNode.children, node);
}

// Get index of ancestor node with given class in parent
function getNodeIndexOfAncestorWithClass(node, className) {
	do {
		node = node.parentNode ;
	}
	while (node !== null && node.className !== className) ;
	return (node !== null) ? getNodeIndex(node) : null ;
}

// Calculate factorial
function factorial(value) {
	return (value > 1) ? value * factorial(value - 1) : 1 ; 
}
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
	while (node.classList && !node.classList.contains(className)) ;
	return (node !== window.document) ? getNodeIndex(node) : null ;
}

// Calculate factorial
function factorial(value) {
	if (value < 0 || Math.floor(value) !== value) {
		console.error("factorial() > Invalid input") ;
		return false ;
	}
	if (value > 17) console.warn("factorial() > Potential accuracy loss") ;
	return (value > 1) ? value * factorial(value - 1) : 1 ; 
}
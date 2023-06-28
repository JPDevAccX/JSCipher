// Calculate factorial
export function factorial(value) {
	if (value < 0 || Math.floor(value) !== value) {
		console.error("factorial() > Invalid input") ;
		return false ;
	}
	if (value > 17) console.warn("factorial() > Potential accuracy loss") ;
	return (value > 1) ? value * factorial(value - 1) : 1 ; 
}
/**
 * It returns a function that checks if the click is outside the component and a function that adds an
 * event listener to the document
 * @returns An object with two functions.
 */
export const useClickOutside = (ref, isOpenStateInParent, onClose) => {
	// If the component is open, and the click is outside the component, then close the component.
	const checkIfClickedOutside = (event) => {
		// Checking if the click is outside the component.
		if (isOpenStateInParent && ref.current && !ref.current.contains(event.target)) {
			onClose(false);
		}
	};

	/**
	 * Add an event listener to the document that calls the function passed
	 * to it when the user clicks outside of the document.
	 *
	 * The function is a closure. It returns a function that removes the event listener
	 * @returns A function that removes the event listener.
	 */
	const addListenerClickedOutside = (functionToCall) => {
		document.addEventListener("mousedown", functionToCall);
		return () => {
			// Cleanup the event listener
			document.removeEventListener("mousedown", functionToCall);
		};
	};

	return { checkIfClickedOutside, addListenerClickedOutside };
};

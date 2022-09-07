import { useEffect } from "react";

/**
 * It returns a function that checks if the click is outside the component and a function that adds an
 * event listener to the document
 * @returns An object with two functions.
 */
export const useClickOutside = (ref, isOpenStateInParent, handler) => {
	// If the component is open, and the click is outside the component, then the handler is launch.

	/**
	 * Add an event listener to the document that calls the function passed
	 * to it when the user clicks outside of the document.
	 *
	 * The function is a closure. It returns a function that removes the event listener
	 * @returns A function that removes the event listener.
	 */

	useEffect(() => {
		const listener = (event) => {
			if (!isOpenStateInParent || !ref.current || ref.current.contains(event.target)) {
				return;
			}

			handler(event);
		};
		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);
		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};
	}, [ref, isOpenStateInParent, handler]);
};

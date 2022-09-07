import { useEffect } from "react";

/**
 * "When the key is pressed, call the handler function."
 *
 * The function add an event listener to the document.
 * When the keydown event is fired, the function checks if the isOpenStateInParent is true.
 * If it is, the function checks if the event.key is equal to the key argument.
 * If it is, the handler function is called
 * @param key - The key to listen for.
 * @param isOpenStateInParent - This is a boolean that tells us whether the modal is open or not.
 * @param handler - The function to call when the key is pressed.
 */
export const useKeypress = (key, isOpenStateInParent, handler) => {
	useEffect(() => {
		const onKeydown = (event) => {
			if (!isOpenStateInParent) {
				return;
			}

			if (event.key === key) {
				handler(event);
			}
		};
		document.addEventListener("keydown", onKeydown);
		return () => {
			document.removeEventListener("keydown", onKeydown);
		};
	}, [key, isOpenStateInParent, handler]);
};

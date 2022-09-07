import { useEffect } from "react";

/**
 * "When the modal is open, listen for the tab key and prevent the user from tabbing out of the modal."
 *
 * The function add a keydown event listener to the document.
 * The event listener is only added when the modal is open
 * @param ref - The ref of the element that should be focused when the modal is open.
 * @param isOpen - boolean
 */
export const useTrapFocus = (ref, isOpen) => {
	useEffect(() => {
		const handleTabKey = (e) => {
			const focusableElements = ref.current.querySelectorAll(
				'a[href], area[href], input:not([disabled],[tabindex="-1"]), select:not([disabled],[tabindex="-1"]), textarea:not([disabled],[tabindex="-1"]), button:not([disabled],[tabindex="-1"]), *[tabindex]:not([tabindex="-1"])'
			);

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (!e.shiftKey && document.activeElement === lastElement) {
				firstElement.focus();
				return e.preventDefault();
			}

			if (e.shiftKey && document.activeElement === firstElement) {
				lastElement.focus();
				e.preventDefault();
			}
		};
		const keyListenersMap = new Map([[9, handleTabKey]]);

		if (isOpen) {
			const keyListener = (e) => {
				const listener = keyListenersMap.get(e.keyCode);
				return listener && listener(e);
			};
			document.addEventListener("keydown", keyListener);

			return () => document.removeEventListener("keydown", keyListener);
		}
	}, [ref, isOpen]);
};

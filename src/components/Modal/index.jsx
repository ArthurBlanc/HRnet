import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { useClickOutside } from "../../Hooks/useClickOutside";

import "./styles.scss";

/**
 * Modal component that can be opened and closed by clicking outside of the modal or the close button.
 *
 *  @returns {React.Component} - The modal component.
 */
function Modal({
	id,
	modalContent,
	isOpenStateInParent = false,
	onClose,
	modalClassName = "modal",
	modalBackgroundClassName = "modal-background",
	addCloseButton = true,
	closeButtonClassName = "close-modal",
	closeButtonText = "Close",
	...props
}) {
	// UseRef hook to create a ref for the modal.
	// The useEffect hook is then used to add an event listener to the document.
	// The event listener checks if the user clicked outside of the modal.
	const ref = useRef();
	const { checkIfClickedOutside, addListenerClickedOutside } = useClickOutside(ref, isOpenStateInParent, onClose);
	useEffect(() => {
		if (isOpenStateInParent) {
			addListenerClickedOutside(checkIfClickedOutside);
		}
	}, [isOpenStateInParent, addListenerClickedOutside, checkIfClickedOutside]);

	const handleClose = () => {
		if (onClose) {
			onClose(false);
		}
	};

	return (
		<>
			{isOpenStateInParent && (
				<>
					<span id={id + "-modal-background"} className={modalBackgroundClassName}></span>
					<div id={id + "-modal"} ref={ref} className={modalClassName} {...props}>
						{modalContent}
						{addCloseButton && (
							<button id={id + "-modal-button"} className={closeButtonClassName} type="button" onClick={handleClose}>
								{closeButtonText}
							</button>
						)}
					</div>
				</>
			)}
		</>
	);
}

Modal.propTypes = {
	// id string (required): The id of the modal.
	id: PropTypes.string.isRequired,

	// modalContent node (required): The content of the modal.
	modalContent: PropTypes.node.isRequired,

	// isOpenStateInParent (required): A boolean that determines whether or not the modal is open.
	isOpenStateInParent: PropTypes.bool.isRequired,

	// onClose (required): A function that is called when the modal is closed.
	onClose: PropTypes.func.isRequired,

	// modalClassName string: The class name of the modal.
	modalClassName: PropTypes.string,

	// modalBackgroundClassName string: The class name of the modal background.
	modalBackgroundClassName: PropTypes.string,

	// addCloseButton boolean: Determines whether or not to add a close button to the modal.
	addCloseButton: PropTypes.bool,

	// closeButtonClassName string: The class name of the close button.
	closeButtonClassName: PropTypes.string,

	// closeButtonText node: The text of the close button.
	closeButtonText: PropTypes.node,
};

export default Modal;

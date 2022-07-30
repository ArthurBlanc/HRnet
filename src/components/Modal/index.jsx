import { useState, useEffect } from "react";

import "./styles.scss";

function Modal({ content, id, isOpenState = false, onClose }) {
	const [isOpen, setIsOpen] = useState(isOpenState);

	useEffect(() => {
		setIsOpen(isOpenState);
	}, [isOpenState]);

	useEffect(() => {
		const modal = document.querySelector(`#${id}`);
		if (modal) {
			const handleClickOutside = (e) => {
				if (modal.contains(e.target)) {
					return;
				}
				setIsOpen(false);
			};
			document.addEventListener("click", handleClickOutside);
			return () => {
				document.removeEventListener("click", handleClickOutside);
			};
		}
	}, [isOpen, id]);

	useEffect(() => {
		const main = document.querySelector("main");
		const removeBackground = () => {
			const modalBackgrounds = document.querySelectorAll(".modal-background");
			modalBackgrounds.forEach((modalBackground) => {
				main.removeChild(modalBackground);
			});
		};
		removeBackground();
		if (main) {
			if (isOpen) {
				const background = document.createElement("div");
				background.classList.add("modal-background");
				main.appendChild(background);
			}
		}
	}, [isOpen]);

	const handleClose = () => {
		setIsOpen(false);
		if (onClose) {
			onClose(false);
		}
	};

	return (
		<>
			{isOpen && (
				<div className="modal" id={id}>
					{content}
					<button className="close-modal" onClick={handleClose}>
						Close
					</button>
				</div>
			)}
		</>
	);
}

export default Modal;

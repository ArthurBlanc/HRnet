import "./styles.scss";

function Modal({ setModalIsOpen, content, id }) {
	return (
		<>
			<div className="modal-background" onClick={() => setModalIsOpen(false)}>
				<div className="modal" id={id}>
					{content}
					<button className="close-modal" onClick={() => setModalIsOpen(false)}>
						Close
					</button>
				</div>
			</div>
		</>
	);
}

export default Modal;

import { useState } from "react";

import "./styles.scss";

function Dropdown({ label, dropdownText, options, onChange }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleOptionClick = (event) => {
		onChange(event.target.attributes.value.value, event.target.innerText);
		setIsOpen(false);
	};

	return (
		<>
			{isOpen && <div className="dropdown-background" onClick={() => setIsOpen(false)}></div>}
			<label>{label}</label>
			<span className="relative">
				<span id="state-button" className="dropdown-button" onClick={() => setIsOpen(true)}>
					<span className="dropdown-icon"></span>
					<span className="dropdown-text">{dropdownText}</span>
				</span>
				{isOpen && (
					<div className="dropdown-list-container">
						<ul id="state-menu" className="dropdown-list">
							{options.map((option, index) => (
								<li className="dropdown-list-item" key={option.value} onClick={handleOptionClick}>
									<div id={"ui-id-" + (index + 1)} className="dropdown-list-item-wrapper" value={option.value}>
										{option.label}
									</div>
								</li>
							))}
						</ul>
					</div>
				)}
			</span>
		</>
	);
}

export default Dropdown;

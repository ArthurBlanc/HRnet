import { useState, useEffect } from "react";

import "./styles.scss";

function Dropdown({ label, options, onChange, id, selectedOptionNumber = 0 }) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState();

	useEffect(() => {
		if (options[0].label) {
			setSelectedOption(options[selectedOptionNumber].label);
		} else {
			setSelectedOption(options[selectedOptionNumber]);
		}
	}, [selectedOptionNumber, options]);

	useEffect(() => {
		const dropdown = document.querySelector(`#${id}`);

		const handleClickOutside = (e) => {
			if (dropdown.contains(e.target)) {
				return;
			}
			setIsOpen(false);
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isOpen, id]);

	useEffect(() => {
		const intElemScrollTop = document.querySelector(".current-selection");
		if (intElemScrollTop) {
			intElemScrollTop.scrollIntoView({
				behavior: "instant",
				inline: "start",
			});
		}
	}, [isOpen]);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const handleOptionClick = (label, value) => {
		setSelectedOption(label);
		onChange(value);
		setIsOpen(false);
	};

	return (
		<>
			<label>{label}</label>
			<span className="relative">
				<span className="dropdown-button" id={id} onClick={handleClick}>
					<span className="dropdown-icon"></span>

					<span className="dropdown-text">{selectedOption}</span>
				</span>
				{isOpen && (
					<div className="dropdown-list-container" id={`${id}-content`}>
						<ul id={id + "-menu"} className="dropdown-list">
							{options.map((option, index) => {
								let label = option;
								let value = option;
								if (option.label && option.value) {
									label = option.label;
									value = option.value;
								}
								return (
									<li className="dropdown-option" key={index} value={value} id={`${id}-${value}`} onClick={() => handleOptionClick(label, value)}>
										<div id={"ui-id-" + (index + 1)} className={"dropdown-list-item-wrapper " + (selectedOption === label ? "current-selection" : "")}>
											{label}
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</span>
		</>
	);
}

export default Dropdown;

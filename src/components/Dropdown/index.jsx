import { useState, useEffect } from "react";

import "./styles.scss";

function Dropdown({ label, options, onChange, id, selectedOptionNumber = 0, listLabel = "Choose your option", showListLabel = false }) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState("");

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
		if (isOpen) {
			const dropdown = document.querySelector(`#${id}`);
			const selectedOption = dropdown.querySelector(`.current-selection`);
			selectedOption.scrollIntoView();
		}
	}, [isOpen, id]);

	useEffect(() => {
		if (showListLabel) {
			if (isOpen) {
				const label = document.querySelector(`#${id}-label`);
				if (label) {
					label.classList.add("active");
				}
			} else {
				const label = document.querySelector(`#${id}-label`);
				if (label) {
					label.classList.remove("active");
				}
			}
		}
	}, [isOpen, id, showListLabel]);

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
			<label id={id + "-label"}>{label}</label>
			<div id={id} className="dropdown-wrapper">
				<span className="dropdown-button" id={id} onClick={handleClick}>
					<span className="dropdown-icon"></span>
					<input type="text" className="dropdown-text select-dropdown" readOnly={true} data-activates={id + "-menu"} value={selectedOption} onClick={handleClick} />
				</span>
				{isOpen && (
					<div className="dropdown-list-container" id={`${id}-content`}>
						{showListLabel && <div className={"dropdown-option label"}>{listLabel}</div>}
						<ul id={id + "-menu"} className="dropdown-list">
							{options.map((option, index) => {
								let label = option;
								let value = option;
								if (option.label && option.value) {
									label = option.label;
									value = option.value;
								}
								return (
									<li
										className={"dropdown-option" + (selectedOption === label ? " current-selection" : "")}
										key={index}
										value={value}
										id={`${id}-${value}`}
										onClick={() => handleOptionClick(label, value)}
									>
										{label}
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</>
	);
}

export default Dropdown;

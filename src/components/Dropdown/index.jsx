import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import { useClickOutside } from "../../hooks/useClickOutside";
import { useKeypress } from "../../hooks/useKeypress";
import { useTrapFocus } from "../../hooks/useTrapFocus";

import Input from "../Input";

import "./styles.scss";

/**
 * Dropdown with an input that allows the user to select a value from a list of options.
 *
 * options can be an array of strings, numbers, or objects.
 * If options labels and values are different, options must be an array of objects with label and value keys:
 * [{ label: "January", value: "0" }, ...],
 *
 * @returns {React.Component} - The dropdown component.
 */
function Dropdown({
	id,
	label,
	value,
	options,
	onChange,
	listLabel = "Choose your option",
	showListLabel = false,
	// Class names for the component.
	labelClassName = "",
	dropdownWrapperClassName = "dropdown-wrapper",
	dropdownButtonClassName = "dropdown-button",
	dropdownIconClassName = "dropdown-icon",
	dropdownListWrapperClassName = "dropdown-list-wrapper",
	dropdownOptionClassName = "dropdown-option",
	dropdownOptionSelectedClassName = "current-selection",
	dropdownListClassName = "dropdown-list",
	dropdownListLabelClassName = "label",
	// Input props.
	error,
	addErrorElement = true,
	maxLength = 128,
	required = false,
	requiredFeedbackEnabled = false,
	requiredFeedback = "*",
	dropdownInputClassName = "dropdown-text",
	// Input classnames.
	activeClassName = "active",
	invalidClassName = "invalid",
	errorClassName = "error",
	requiredFeedbackClassName = "required",
	...props
}) {
	// State to track if the dropdown is open or not.
	const [isOpen, setIsOpen] = useState(false);
	// State to track the selected option label.
	const [selectedOptionLabel, setSelectedOptionLabel] = useState("");
	// State to track the selected option value.
	const [selectedOptionValue, setSelectedOptionValue] = useState("");
	// UseRef hook to create a ref for the modal.
	// The useEffect hook is then used to add an event listener to the document.
	const ref = useRef();
	useClickOutside(ref, isOpen, () => setIsOpen(false));
	useKeypress("Escape", isOpen, () => setIsOpen(false));
	useTrapFocus(ref, isOpen);

	useEffect(() => {
		if (isOpen) {
			// Scrolling the selected option into view.
			const dropdown = document.querySelector(`#${id}-dropdown-wrapper`);
			const selectedOption = dropdown.querySelector(`.current-selection`);
			if (selectedOption) {
				selectedOption.scrollIntoView();
				selectedOption.focus();
			}
		}
	}, [isOpen, id]);

	useEffect(() => {
		// Setting the label and value of the dropdown.
		// If the value prop is passed in, it sets the label and value to the value prop.
		// Else, it sets the label and value to the first option in the options array. */
		let label = "";
		let newValue = "";

		if (!value) {
			label = options[0].label ? options[0].label : options[0];
			newValue = options[0].value ? options[0].value : options[0];
		} else {
			label = value;
			newValue = value;
			// If the option is an object (different label and value), get the option label.
			const selectedOption = options.find((option) => option.value === value);
			if (selectedOption) {
				label = selectedOption.label;
			}
		}
		setSelectedOptionValue(newValue);
		setSelectedOptionLabel(label);
	}, [value, options]);

	// Sets the selected option label and value, closes the dropdown, and calls the onChange function if it exists.
	const handleOptionClick = (label, value) => {
		setSelectedOptionLabel(label);
		setSelectedOptionValue(value);
		setIsOpen(false);
		if (onChange) {
			onChange(value);
		}
		const button = document.getElementById(id + "-dropdown-button");
		if (button) {
			button.focus();
		}
	};

	const handleKeyDown = (e, label, value) => {
		if (e.key === "Enter" || e.key === " ") {
			handleOptionClick(label, value);
		}
		if (e.key === "ArrowDown") {
			e.preventDefault();
			const selectedOption = e.target;
			if (selectedOption) {
				const nextOption = selectedOption.nextElementSibling;
				if (nextOption) {
					nextOption.focus();
				}
			}
		}
		if (e.key === "ArrowUp") {
			e.preventDefault();
			const selectedOption = e.target;
			if (selectedOption) {
				const previousOption = selectedOption.previousElementSibling;
				if (previousOption) {
					previousOption.focus();
				}
			}
		}
	};

	const handleKeyDownLabel = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			setIsOpen(true);
		}
	};

	return (
		<div ref={ref}>
			{label && (
				<label
					id={id + "-dropdown-label"}
					htmlFor={id + "-input"}
					// Adding the class name "active" to the label if the dropdown is open.
					className={labelClassName + (isOpen ? " active" : "")}
				>
					{label} {requiredFeedbackEnabled && <span className={requiredFeedbackClassName}>{requiredFeedback}</span>}
				</label>
			)}
			<div id={id + "-dropdown-wrapper"} className={dropdownWrapperClassName}>
				<div
					id={id + "-dropdown-button"}
					className={dropdownButtonClassName}
					onClick={(e) => {
						e.preventDefault();
						setIsOpen(true);
					}}
					onKeyDown={handleKeyDownLabel}
					tabIndex={0}
					aria-expanded={isOpen}
					aria-label={label}
					role="listbox"
				>
					<Input
						id={id}
						className={dropdownInputClassName}
						tabIndex={-1}
						error={error}
						readOnly={true}
						data-activates={id + "-dropdown-list"}
						value={selectedOptionLabel}
						wrapperClassName=""
						addErrorElement={addErrorElement}
						maxLength={maxLength}
						required={required}
						requiredFeedbackEnabled={requiredFeedbackEnabled}
						requiredFeedback={requiredFeedback}
						activeClassName={activeClassName}
						invalidClassName={invalidClassName}
						errorClassName={errorClassName}
						requiredFeedbackClassName={requiredFeedbackClassName}
						{...props}
					/>
					<span className={dropdownIconClassName}></span>
				</div>
				{isOpen && (
					<div className={dropdownListWrapperClassName} aria-modal="true">
						{showListLabel && <div className={dropdownOptionClassName + " " + dropdownListLabelClassName}>{listLabel}</div>}
						<ul id={id + "-dropdown-list"} className={dropdownListClassName} role="listbox" tabIndex={-1}>
							{options.map((option) => {
								let label = option;
								let value = option;
								// Checking if the option is an object.
								//If it is, it sets the label and value to the label and value of the object.
								if (option.label && option.value) {
									label = option.label;
									value = option.value;
								}
								return (
									<li
										id={`${id}-dropdown-item-${value}`}
										// Adding the class name "current-selection" to the selected option.
										className={dropdownOptionClassName + (selectedOptionValue === value ? " " + dropdownOptionSelectedClassName : "")}
										key={`${id}-dropdown-item-${value}`}
										onClick={() => handleOptionClick(label, value)}
										onKeyDown={(e) => handleKeyDown(e, label, value)}
										tabIndex="0"
										role="option"
										aria-selected={selectedOptionValue === value}
										aria-label={label}
									>
										{label}
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

Dropdown.propTypes = {
	// Id string (required): The id of the dropdown
	id: PropTypes.string.isRequired,

	// Label string: The label of the dropdown
	label: PropTypes.string,

	// value node: The value of the dropdown
	value: PropTypes.node,

	// Options array (required): The options of the dropdown
	options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.number])).isRequired,

	// onChange function: The function called when the dropdown is changed
	onChange: PropTypes.func.isRequired,

	// error string: The error of the dropdown
	error: PropTypes.string,

	// listLabel string: The label of the dropdown list
	listLabel: PropTypes.string,

	// showListLabel boolean: Whether or not to show the list label
	showListLabel: PropTypes.bool,

	// labelClassName string: The class name of the label
	labelClassName: PropTypes.string,

	// dropdownWrapperClassName string: The class name of the dropdown wrapper
	dropdownWrapperClassName: PropTypes.string,

	// dropdownButtonClassName string: The class name of the dropdown button
	dropdownButtonClassName: PropTypes.string,

	// dropdownIconClassName string: The class name of the dropdown icon
	dropdownIconClassName: PropTypes.string,

	// dropdownInputClassName string: The class name of the dropdown input
	dropdownInputClassName: PropTypes.string,

	// dropdownListWrapperClassName string: The class name of the dropdown list wrapper
	dropdownListWrapperClassName: PropTypes.string,

	// dropdownListClassName string: The class name of the dropdown list
	dropdownListClassName: PropTypes.string,

	// dropdownOptionClassName string: The class name of the dropdown option
	dropdownOptionClassName: PropTypes.string,

	// dropdownOptionSelectedClassName string: The class name of the selected dropdown option
	dropdownOptionSelectedClassName: PropTypes.string,

	// dropdownListLabelClassName string: The class name of the dropdown list label
	dropdownListLabelClassName: PropTypes.string,

	// addErrorElement boolean: Whether or not to add the error element
	addErrorElement: PropTypes.bool,

	// maxLength number: The maximum length of the dropdown
	maxLength: PropTypes.number,

	// required boolean: Whether or not the dropdown is required
	required: PropTypes.bool,

	// requiredFeedbackEnabled boolean: Whether or not to show the required feedback
	requiredFeedbackEnabled: PropTypes.bool,

	// requiredFeedback string: The required feedback
	requiredFeedback: PropTypes.string,

	// activeClassName string: The class name of the active dropdown option
	activeClassName: PropTypes.string,

	// invalidClassName string: The class name of the invalid dropdown option
	invalidClassName: PropTypes.string,

	// errorClassName string: The class name of the error dropdown option
	errorClassName: PropTypes.string,

	// requiredFeedbackClassName string: The class name of the required feedback
	requiredFeedbackClassName: PropTypes.string,
};

export default Dropdown;

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import ConditionalWrapper from "../ConditionalWrapper";

import "./styles.scss";

/**
 * Function to add an input element with label and error message (can be disable).
 *
 * @returns {React.Component} - The Input component.
 */
function Input({
	id,
	label,
	type = "text",
	value,
	onChange,
	onFocus,
	onBlur,
	addErrorElement = true,
	error,
	maxLength = 128,
	required = false,
	requiredFeedbackEnabled = false,
	requiredFeedback = "*",
	readOnly = false,
	// Class names for the component.
	wrapperClassName = "form-group",
	labelClassName = "form-label",
	inputClassName = "form-input",
	activeClassName = "active",
	invalidClassName = "invalid",
	errorClassName = "error",
	requiredFeedbackClassName = "required",
	...props
}) {
	// State to track if the input is focused or not.
	const [isFocused, setIsFocused] = useState(false);

	// Focus the input element when the isFocused state is true.
	useEffect(() => {
		if (isFocused) {
			document.getElementById(id + "-input").focus();
		}
	}, [isFocused, id]);

	/*useEffect(() => {
		if (onChange) {
			onChange(value);
		}
		/**
		 * DO NOT ADD THE ONCHANGE PROP TO THE USEEFFECT ARGUMENTS. THIS WILL CAUSE AN INFINITE LOOP.
		 * TODO: find a way to fix this.
		 * */
	//}, [value]);

	// If the onChange prop is defined, call it with the event.
	const handleChange = (event) => {
		if (onChange) {
			onChange(event);
		}
	};

	// If the onBlur prop is defined, call it with the event and the id.
	// Then set the isFocused state to false
	const handleBlur = (event) => {
		if (onBlur) {
			onBlur(event, id);
			if (!error) {
				// add valid class if there is no error
				event.target.classList.add("valid");
				event.target.previousSibling.classList.add("valid");
			}
		}
		setIsFocused(false);
	};

	// If the onFocus prop is defined, call it with the event.
	// Then set the isFocused state to true
	const handleFocus = (event) => {
		if (onFocus) {
			onFocus(event);
		}
		setIsFocused(true);
	};

	// On click on label, set the isFocused state to true
	const handleLabelClick = () => {
		setIsFocused(true);
	};

	return (
		<ConditionalWrapper className={wrapperClassName}>
			{label && (
				<label
					id={id + "-input-label"}
					htmlFor={id + "-input"}
					// If the isFocused state is true or value is defined, add the active class to the label.
					// If error is defined, add the invalid class to the label.
					className={labelClassName + (value || isFocused ? " " + activeClassName : "") + (error ? " " + invalidClassName : "")}
					onClick={handleLabelClick}
				>
					{label} {requiredFeedbackEnabled && <span className={requiredFeedbackClassName}>{requiredFeedback}</span>}
				</label>
			)}

			{type === "textarea" ? (
				<textarea
					className={inputClassName}
					id={id + "-input"}
					name={id}
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					required={required}
					form={id}
					readOnly={readOnly}
					maxLength={maxLength}
					{...props}
				/>
			) : (
				<input
					id={id + "-input"}
					className={inputClassName + (error ? " " + invalidClassName : "")}
					name={id}
					type={type}
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					required={required}
					readOnly={readOnly}
					maxLength={maxLength}
					{...props}
				/>
			)}
			{addErrorElement && (
				<p id={id + "-input-error"} className={errorClassName}>
					{error}
				</p>
			)}
		</ConditionalWrapper>
	);
}

Input.propTypes = {
	// Id string (required): The id of input.
	id: PropTypes.string.isRequired,

	// Label string: The label of input.
	label: PropTypes.string,

	// Type string: The type of input.
	type: PropTypes.string,

	// Value node: The value of input.
	value: PropTypes.node,

	// onChange function: The callback function when input value is changed.
	onChange: PropTypes.func,

	// onFocus function: The callback function when input is focused.
	onFocus: PropTypes.func,

	// onBlur function: The callback function when input is blurred.
	onBlur: PropTypes.func,

	// addErrorElement boolean: Whether to add an error element.
	addErrorElement: PropTypes.bool,

	// MaxLength number: The max length of input.
	maxLength: PropTypes.number,

	// Required boolean: Whether the input is required.
	required: PropTypes.bool,

	// RequiredFeedbackEnabled boolean: Whether to add the required feedback.
	requiredFeedbackEnabled: PropTypes.bool,

	// RequiredFeedback string: The feedback to show if the input is required.
	requiredFeedback: PropTypes.string,

	// ReadOnly boolean: Whether the input is read only.
	readOnly: PropTypes.bool,

	// Error string: The error message of input.
	error: PropTypes.string,

	// WrapperClassName string: The class name of wrapper.
	wrapperClassName: PropTypes.string,

	// LabelClassName string: The class name of label.
	labelClassName: PropTypes.string,

	// InputClassName string: The class name of input.
	inputClassName: PropTypes.string,

	// ActiveClassName string: The class name of input when it is active.
	activeClassName: PropTypes.string,

	// InvalidClassName string: The class name of input when it is invalid.
	invalidClassName: PropTypes.string,

	// ErrorClassName string: The class name of input when it is error.
	errorClassName: PropTypes.string,

	// RequiredFeedbackClassName string: The class name of feedback when the input is required.
	requiredFeedbackClassName: PropTypes.string,
};

export default Input;

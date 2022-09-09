import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import ConditionalWrapper from "../ConditionalWrapper";

import "./styles.scss";

/**
 * Function to add an input element with label and error message (can be disable).
 *
 * @category Components
 * @component
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

	/** If the onChange prop is defined, call it with the event. */
	const handleChange = (event) => {
		if (onChange) {
			onChange(event);
		}
	};

	/**
	 * If the onBlur prop is defined, call it with the event and the id.
	 * Then set the isFocused state to false
	 * */
	const handleBlur = (event) => {
		if (onBlur) {
			onBlur(event, id);
			if (!error) {
				// add valid class if there is no error
				if (event.target.value) {
					event.target.classList.add("valid");
				}
				if (event.target.previousSibling) {
					event.target.previousSibling.classList.add("valid");
				}
			}
		}
		setIsFocused(false);
	};

	/**
	 * If the onFocus prop is defined, call it with the event.
	 * Then set the isFocused state to true
	 * */
	const handleFocus = (event) => {
		if (onFocus) {
			onFocus(event);
		}
		setIsFocused(true);
	};

	/** On click on label, set the isFocused state to true */
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
					aria-required={requiredFeedbackEnabled || required}
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
					aria-required={requiredFeedbackEnabled || required}
					aria-label={"Enter " + label}
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
	/** The id of input. */
	id: PropTypes.string.isRequired,

	/** The label of input. */
	label: PropTypes.string,

	/** The type of input. */
	type: PropTypes.string,

	/** The value of input. */
	value: PropTypes.node,

	/** The callback function when input value is changed. */
	onChange: PropTypes.func,

	/** The callback function when input is focused. */
	onFocus: PropTypes.func,

	/** The callback function when input is blurred. */
	onBlur: PropTypes.func,

	/** Whether to add an error element. */
	addErrorElement: PropTypes.bool,

	/** The max length of input. */
	maxLength: PropTypes.number,

	/** Whether the input is required. */
	required: PropTypes.bool,

	/** Whether to add the required feedback. */
	requiredFeedbackEnabled: PropTypes.bool,

	/** The feedback to show if the input is required. */
	requiredFeedback: PropTypes.string,

	/** Whether the input is read only. */
	readOnly: PropTypes.bool,

	/** The error message of input. */
	error: PropTypes.string,

	/** The class name of wrapper. */
	wrapperClassName: PropTypes.string,

	/** The class name of label. */
	labelClassName: PropTypes.string,

	/** The class name of input. */
	inputClassName: PropTypes.string,

	/** The class name of input when it is active. */
	activeClassName: PropTypes.string,

	/** The class name of input when it is invalid. */
	invalidClassName: PropTypes.string,

	/** The class name of input when it is error. */
	errorClassName: PropTypes.string,

	/** The class name of feedback when the input is required. */
	requiredFeedbackClassName: PropTypes.string,
};

export default Input;

import { useState } from "react";

/**
 * Custom hook to manage form state and validation
 * @param {Object} options - options object
 *
 * @returns An object with the data, handleChange, handleSubmit, handleValidation, and errors.
 */
export const useForm = (options) => {
	const [data, setData] = useState(options?.initialValues || {});
	const [errors, setErrors] = useState({});

	/**
	 * It takes a key and a sanitize function as arguments and returns a function that takes an event as an
	 * argument and sets the data state with the event value
	 */
	const handleChange = (key, sanitizeFn) => (event) => {
		if (event !== undefined && key) {
			// If event as an target value, value is the target value else value is the event value.
			const value = event.target ? event.target.value : event;
			// If the sanitize function is passed, then sanitize the value.
			const sanitizeValue = sanitizeFn ? sanitizeFn(value) : value;
			setData({
				...data,
				[key]: sanitizeValue,
			});

			//

			// Creating a new object with the same properties as the errors, then deleting the property
			// with the key that was passed in, and then set the errors state. */
			const newErrors = { ...errors };
			delete newErrors[key];
			setErrors(newErrors);
		}
	};

	/**
	 * It takes an event and a key, and if the event is not undefined and the key is valid, it will check
	 * if the value of the event is valid based on the validations object
	 * @returns An object with the key of the field that has an error and the error message.
	 */
	const handleValidation = (event, key) => {
		if (event !== undefined && key) {
			const value = event.target ? event.target.value : event;
			const validations = options?.validations;
			if (validations) {
				const validation = validations[key];
				const pattern = validation?.pattern;
				const custom = validation?.custom;
				const newErrors = { ...errors };

				if (validation?.required?.value && !value) {
					newErrors[key] = validation?.required?.message;
				} else if (pattern?.value && !RegExp(pattern.value).test(value)) {
					newErrors[key] = pattern.message;
				} else if (custom?.isValid && !custom.isValid(value)) {
					newErrors[key] = custom.message;
				} else delete newErrors[key];

				setErrors(newErrors);
				return newErrors;
			}
		}
	};

	/**
	 * Checks if there are validations, if true, it loops through the validations and calls the handleValidation function,
	 * Then sets the errors state if there are errors,
	 * Otherwise it sets the errors state to an empty object and calls the onSubmit function if it exists
	 */
	const handleSubmit = (event) => {
		event.preventDefault();
		const validations = options?.validations;
		if (validations) {
			let newErrors = {};
			for (const key in validations) {
				const error = handleValidation(data[key], key);
				Object.assign(newErrors, error);
			}

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				return;
			}
		}

		setErrors({});

		if (options?.onSubmit) {
			options.onSubmit();
		}
	};

	return {
		data,
		handleChange,
		handleSubmit,
		handleValidation,
		errors,
	};
};

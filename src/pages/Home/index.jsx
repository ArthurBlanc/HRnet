import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../Hooks/useForm";

import { states, departments } from "../../utils/statesAndDepartments";

import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Dropdown from "../../components/Dropdown";
import DatePicker from "../../components/DatePicker";

import "./styles.scss";

function Home() {
	const navigate = useNavigate();

	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const nameRegex = "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,128}$";
	const dateRegex = "^(0[1-9]|1[0-2])/(0[1-9]|[1-2][0-9]|3[0-1])/(19|20)\\d{2}$";
	const addressRegex = "^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{1,128}$";
	const zipRegex = "^\\d{4}$|^\\d{5}$";
	const zipRegexOnChange = "^\\d{1,5}$";

	const {
		handleSubmit, // handles form submission
		handleChange, // handles input changes
		handleValidation,
		data, // access to the form data
		errors, // includes the errors to show
	} = useForm({
		// the hook we are going to create
		validations: {
			// all our validation rules go here
			firstName: {
				required: {
					value: true,
					message: "First Name is required",
				},
				pattern: {
					value: nameRegex,
					message: "First Name must contain only letters, spaces and some special characters",
				},
			},
			lastName: {
				required: {
					value: true,
					message: "Last Name is required",
				},
				pattern: {
					value: nameRegex,
					message: "Last Name must contain only letters, spaces and some special characters",
				},
			},
			dateOfBirth: {
				required: {
					value: true,
					message: "Date of Birth is required",
				},
				pattern: {
					value: dateRegex,
					message: "Date of Birth must be in the format MM/DD/YYYY",
				},
			},
			startDate: {
				required: {
					value: true,
					message: "Start Date is required",
				},
				pattern: {
					value: dateRegex,
					message: "Start Date must be in the format MM/DD/YYYY",
				},
			},
			street: {
				required: {
					value: true,
					message: "Street is required",
				},
				pattern: {
					value: addressRegex,
					message: "Street must contain only letters, numbers, spaces and some special characters",
				},
			},
			city: {
				required: {
					value: true,
					message: "City is required",
				},
				pattern: {
					value: addressRegex,
					message: "City must contain only letters, numbers, spaces and some special characters",
				},
			},
			state: {
				required: {
					value: true,
					message: "State is required",
				},
				custom: {
					isValid: (value) => states.some((state) => state.value === value),
					message: "Your selection is not valid",
				},
			},
			zip: {
				required: {
					value: true,
					message: "Zip is required",
				},
				pattern: {
					value: zipRegex,
					message: "Zip must be 4 or 5 digits",
				},
			},
			department: {
				required: {
					value: true,
					message: "Department is required",
				},
				custom: {
					isValid: (value) => departments.includes(value),
					message: "Your selection is not valid",
				},
			},
		},
		onSubmit: () => {
			const employees = JSON.parse(localStorage.getItem("employees")) || [];
			const employee = {
				firstName: sanitizerOnSubmit(data.firstName),
				lastName: sanitizerOnSubmit(data.lastName),
				dateOfBirth: sanitizerOnSubmit(data.dateOfBirth),
				startDate: sanitizerOnSubmit(data.startDate),
				department: sanitizerOnSubmit(data.department),
				street: sanitizerOnSubmit(data.street),
				city: sanitizerOnSubmit(data.city),
				state: sanitizerOnSubmit(data.state),
				zipCode: sanitizerOnSubmit(data.zip),
			};
			employees.push(employee);
			localStorage.setItem("employees", JSON.stringify(employees));
			setShowConfirmationModal(true);
		},
		initialValues: {
			firstName: "",
			lastName: "",
			dateOfBirth: "",
			startDate: "",
			department: departments[0],
			street: "",
			city: "",
			state: states[0].value,
			zip: "",
		},
	});

	const sanitizerOnSubmit = (value) => {
		return value.trim();
	};
	const sanitizerOnChange = (value, regex) => {
		let firstLetterUpperCase = value.charAt(0).toUpperCase() + value.slice(1);

		// check if first letter is a letter or a number, if not, remove it
		let regexFirstLetter = new RegExp("^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð]");
		if (!regexFirstLetter.test(firstLetterUpperCase.charAt(0))) {
			firstLetterUpperCase = firstLetterUpperCase.slice(0, -1);
		}

		// remove last character is not in the regex
		if (!RegExp(regex).test(firstLetterUpperCase)) {
			firstLetterUpperCase = firstLetterUpperCase.slice(0, -1);
		}

		return firstLetterUpperCase;
	};

	return (
		<main>
			<div className="title">
				<h1>HRnet</h1>
			</div>
			<div className="container">
				<button className="button" onClick={() => navigate("/employee-list")}>
					Employee List
				</button>
				<h2>Create Employee</h2>

				<form id="create-employee" onSubmit={handleSubmit}>
					<Input
						id="firstName"
						label="First Name"
						value={data.firstName}
						onChange={handleChange("firstName", (event) => sanitizerOnChange(event, nameRegex))}
						maxLength={128}
						onBlur={handleValidation}
						error={errors.firstName || ""}
						requiredFeedbackEnabled={true}
					/>

					<Input
						id="lastName"
						label="Last Name"
						value={data.lastName}
						onChange={handleChange("lastName", (event) => sanitizerOnChange(event, nameRegex))}
						maxLength={128}
						onBlur={handleValidation}
						error={errors.lastName || ""}
						requiredFeedbackEnabled={true}
					/>

					<DatePicker
						id="dateOfBirth"
						label="Date of Birth"
						value={data.dateOfBirth}
						onChange={handleChange("dateOfBirth")}
						onBlurFunction={handleValidation}
						maxLength={10}
						error={errors.dateOfBirth || ""}
						yearsBackNumber={80}
						yearsForwardNumber={0}
						requiredFeedbackEnabled={true}
					/>

					<DatePicker
						id="startDate"
						label="Start Date"
						onChange={handleChange("startDate")}
						onBlurFunction={handleValidation}
						maxLength={10}
						error={errors.startDate || ""}
						yearsBackNumber={50}
						yearsForwardNumber={1}
						requiredFeedbackEnabled={true}
					/>

					<fieldset className="address">
						<legend>Address</legend>

						<Input
							id="street"
							label="Street"
							value={data.street}
							onChange={handleChange("street", (event) => sanitizerOnChange(event, addressRegex))}
							maxLength={128}
							onBlur={handleValidation}
							error={errors.street || ""}
							requiredFeedbackEnabled={true}
						/>

						<Input
							id="city"
							label="City"
							value={data.city}
							onChange={handleChange("city", (event) => sanitizerOnChange(event, addressRegex))}
							maxLength={128}
							onBlur={handleValidation}
							error={errors.city || ""}
							requiredFeedbackEnabled={true}
						/>
						<div className="form-group">
							<Dropdown id="state" label="State" value={data.state} options={states} onChange={handleChange("state")} listLabel="Chose your state" showListLabel={true} requiredFeedbackEnabled={true} />
						</div>
						<Input
							id="zip"
							label="Zip Code"
							value={data.zip}
							onChange={handleChange("zip", (event) => sanitizerOnChange(event, zipRegexOnChange))}
							maxLength={5}
							onBlur={handleValidation}
							error={errors.zip || ""}
							requiredFeedbackEnabled={true}
						/>
					</fieldset>
					<div className="form-group">
						<Dropdown
							id="department"
							label="Department"
							value={data.department}
							options={departments}
							onChange={handleChange("department")}
							error={errors.department || ""}
							listLabel="Chose your department"
							showListLabel={true}
							requiredFeedbackEnabled={true}
						/>
					</div>
					<div className="form-group">
						<button id="form-submit-button" type="submit" className="button">
							Create
						</button>
					</div>
				</form>
				<Modal id="confirmation" modalContent="Employee Created!" isOpenStateInParent={showConfirmationModal} onClose={setShowConfirmationModal} />
			</div>
		</main>
	);
}

export default Home;

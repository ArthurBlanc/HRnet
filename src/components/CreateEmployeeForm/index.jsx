import { useState } from "react";

import { states, departments } from "../../utils/statesAndDepartments";

import Modal from "../Modal";
import Dropdown from "../Dropdown";

function CreateEmployeeForm() {
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [startDate, setStartDate] = useState("");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [countryState, setCountryState] = useState(states[0].value);
	const [countryStateLabel, setCountryStateLabel] = useState(states[0].label);
	const [zip, setZip] = useState("");
	const [department, setDepartment] = useState(departments[0].value);

	const [firstNameError, setFirstNameError] = useState("");
	const [lastNameError, setLastNameError] = useState("");
	const [dateOfBirthError, setDateOfBirthError] = useState("");
	const [startDateError, setStartDateError] = useState("");
	const [streetError, setStreetError] = useState("");
	const [cityError, setCityError] = useState("");
	const [stateError, setStateError] = useState("");
	const [zipError, setZipError] = useState("");
	const [departmentError, setDepartmentError] = useState("");

	const nameRegex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
	const dateYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/;
	const addressRegex = /^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
	const zipRegex = /^\d{4}$|^\d{5}$/;

	const validateFirstName = () => {
		if (!nameRegex.test(firstName)) {
			setFirstNameError("First name is not valid");
		} else {
			setFirstNameError("");
		}
	};

	const validateLastName = () => {
		if (!nameRegex.test(lastName)) {
			setLastNameError("Last name is not valid");
		} else {
			setLastNameError("");
		}
	};

	const validateDateOfBirth = () => {
		if (!dateYYYYMMDD.test(dateOfBirth)) {
			console.log(dateOfBirth);
			setDateOfBirthError("Date of birth is not valid");
		} else {
			setDateOfBirthError("");
		}
	};

	const validateStartDate = () => {
		console.log(startDate);
		if (!dateYYYYMMDD.test(startDate)) {
			setStartDateError("Start date is not valid");
		} else {
			setStartDateError("");
		}
	};

	const validateStreet = () => {
		if (!addressRegex.test(street)) {
			setStreetError("Street is not valid");
		} else {
			setStreetError("");
		}
	};

	const validateCity = () => {
		if (!addressRegex.test(city)) {
			setCityError("City is not valid");
		} else {
			setCityError("");
		}
	};

	const validateState = () => {
		if (!states.some((element) => element.value === countryState)) {
			setStateError("State is not valid");
		} else {
			setStateError("");
		}
	};

	const validateZip = () => {
		if (!zipRegex.test(zip)) {
			setZipError("Zip code is not valid");
		} else {
			setZipError("");
		}
	};

	const validateDepartment = () => {
		if (!departments.some((element) => element.value === department)) {
			setDepartmentError("Department is not valid");
		} else {
			setDepartmentError("");
		}
	};

	const handleFirstNameChange = (e) => {
		setFirstName(e.target.value);
		setFirstNameError("");
	};

	const handleLastNameChange = (e) => {
		setLastName(e.target.value);
		setLastNameError("");
	};

	const handleDateOfBirthChange = (e) => {
		setDateOfBirth(e.target.value);
		setDateOfBirthError("");
	};

	const handleStartDateChange = (e) => {
		setStartDate(e.target.value);
		setStartDateError("");
	};

	const handleStreetChange = (e) => {
		setStreet(e.target.value);
		setStreetError("");
	};

	const handleCityChange = (e) => {
		setCity(e.target.value);
		setCityError("");
	};

	const handleStateChange = (value, label) => {
		setCountryState(value);
		setCountryStateLabel(label);
		setStateError("");
	};

	const handleZipChange = (e) => {
		setZip(e.target.value);
		setZipError("");
	};

	const handleDepartmentChange = (value) => {
		setDepartment(value);
		setDepartmentError("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (firstName === "" || lastName === "" || dateOfBirth === "" || startDate === "" || street === "" || city === "" || countryState === "" || zip === "" || department === "") {
			validateFirstName();
			validateLastName();
			validateDateOfBirth();
			validateStartDate();
			validateStreet();
			validateCity();
			validateState();
			validateZip();
			validateDepartment();
		} else {
			if (
				firstNameError === "" &&
				lastNameError === "" &&
				dateOfBirthError === "" &&
				startDateError === "" &&
				streetError === "" &&
				cityError === "" &&
				stateError === "" &&
				zipError === "" &&
				departmentError === ""
			) {
				const employees = JSON.parse(localStorage.getItem("employees")) || [];
				const employee = {
					firstName: firstName,
					lastName: lastName,
					dateOfBirth: dateOfBirth,
					startDate: startDate,
					department: department,
					street: street,
					city: city,
					state: countryState,
					zipCode: zip,
				};
				employees.push(employee);
				localStorage.setItem("employees", JSON.stringify(employees));
				setShowConfirmationModal(true);
			}
		}
	};

	return (
		<>
			<form id="create-employee" onSubmit={handleSubmit}>
				<label htmlFor="firstName">First Name</label>
				<input type="text" className="form-control" id="firstName" value={firstName} onChange={handleFirstNameChange} onBlur={validateFirstName} />
				<div className="error">{firstNameError}</div>

				<label htmlFor="lastName">Last Name</label>
				<input type="text" className="form-control" id="lastName" value={lastName} onChange={handleLastNameChange} onBlur={validateLastName} />

				<div className="error">{lastNameError}</div>

				<label htmlFor="dateOfBirth">Date of Birth</label>
				<input type="date" className="form-control" id="dateOfBirth" value={dateOfBirth} onChange={handleDateOfBirthChange} onBlur={validateDateOfBirth} />
				<div className="error">{dateOfBirthError}</div>

				<label htmlFor="startDate">Start Date</label>
				<input type="date" className="form-control" id="startDate" value={startDate} onChange={handleStartDateChange} onBlur={validateStartDate} />
				<div className="error">{startDateError}</div>

				<fieldset className="address">
					<legend>Address</legend>

					<label htmlFor="street">Street</label>
					<input type="text" className="form-control" id="street" value={street} onChange={handleStreetChange} onBlur={validateStreet} />
					<div className="error">{streetError}</div>

					<label htmlFor="city">City</label>
					<input type="text" className="form-control" id="city" value={city} onChange={handleCityChange} onBlur={validateCity} />
					<div className="error">{cityError}</div>

					<Dropdown label="State" options={states} dropdownText={countryStateLabel} onChange={handleStateChange} onBlur={validateState} id={"state"} />
					<div className="error">{stateError}</div>

					<label htmlFor="zip">Zip</label>
					<input type="text" className="form-control" id="zip" value={zip} onChange={handleZipChange} onBlur={validateZip} />
					<div className="error">{zipError}</div>
				</fieldset>
				<Dropdown label="Department" options={departments} dropdownText={department} onChange={handleDepartmentChange} onBlur={validateDepartment} id={"department"} />
				<div className="error">{departmentError}</div>
			</form>
			<button type="submit" className="btn btn-primary" onClick={handleSubmit}>
				Save
			</button>

			<Modal isOpenState={showConfirmationModal} onClose={setShowConfirmationModal} content="Employee Created!" id="confirmation" />
		</>
	);
}
export default CreateEmployeeForm;

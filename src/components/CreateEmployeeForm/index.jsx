import { useState, useEffect, useCallback } from "react";

import { states, departments } from "../../utils/statesAndDepartments";

import Modal from "../Modal";
import Dropdown from "../Dropdown";
import Button from "../Button";
import DatePicker from "../DatePicker";

import "./styles.scss";

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
	const dateMMDDYYYY = /^(0[1-9]|1[0-2]).(0[1-9]|1\d|2\d|3[01]).(19|20)\d{2}$/;
	const addressRegex = /^[a-zA-Z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
	const zipRegex = /^\d{4}$|^\d{5}$/;

	const addClass = useCallback((type, selectorAttribute, selector, classToAdd, state) => {
		const element = document.querySelector(`${type}[${selectorAttribute}="${selector}"]`);

		if (element && state !== "") {
			element.classList.add(classToAdd);
		} else {
			element.classList.remove(classToAdd);
		}
	}, []);

	useEffect(() => {
		addClass("label", "for", "startDate", "active", startDate);
	}, [startDate, addClass]);

	useEffect(() => {
		addClass("label", "for", "dateOfBirth", "active", dateOfBirth);
	}, [dateOfBirth, addClass]);

	useEffect(() => {
		addClass("input", "id", "firstName", "invalid", firstNameError);
		addClass("label", "for", "firstName", "invalid", firstNameError);
	}, [firstNameError, addClass]);

	useEffect(() => {
		addClass("input", "id", "lastName", "invalid", lastNameError);
		addClass("label", "for", "lastName", "invalid", lastNameError);
	}, [lastNameError, addClass]);

	useEffect(() => {
		addClass("input", "id", "dateOfBirth", "invalid", dateOfBirthError);
		addClass("label", "for", "dateOfBirth", "invalid", dateOfBirthError);
	}, [dateOfBirthError, addClass]);

	useEffect(() => {
		addClass("input", "id", "startDate", "invalid", startDateError);
		addClass("label", "for", "startDate", "invalid", startDateError);
	}, [startDateError, addClass]);

	useEffect(() => {
		addClass("input", "id", "street", "invalid", streetError);
		addClass("label", "for", "street", "invalid", streetError);
	}, [streetError, addClass]);

	useEffect(() => {
		addClass("input", "id", "city", "invalid", cityError);
		addClass("label", "for", "city", "invalid", cityError);
	}, [cityError, addClass]);

	useEffect(() => {
		addClass("input", "id", "zip", "invalid", zipError);
		addClass("label", "for", "zip", "invalid", zipError);
	}, [zipError, addClass]);

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
		if (!dateMMDDYYYY.test(dateOfBirth)) {
			setDateOfBirthError("Date of birth is not valid");
		} else {
			setDateOfBirthError("");
		}
	};

	const validateStartDate = () => {
		if (!dateMMDDYYYY.test(startDate)) {
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

	const handleDateOfBirthChange = (value) => {
		setDateOfBirth(value);
		if (dateMMDDYYYY.test(value)) {
			setDateOfBirthError("");
		}
	};

	const handleStartDateChange = (value) => {
		setStartDate(value);
		if (dateMMDDYYYY.test(value)) {
			setStartDateError("");
		}
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

	const handleInputFocus = (e) => {
		const label = e.target.previousSibling;
		label.classList.add("active");

		e.target.addEventListener("blur", () => {
			if (e.target.value === "") {
				label.classList.remove("active");
			}
		});
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
				<div className="form-group">
					<label htmlFor="firstName" className={"form-label"}>
						First Name *
					</label>
					<input type="text" className={"form-control form-input"} id="firstName" value={firstName} onChange={handleFirstNameChange} onFocus={handleInputFocus} onBlur={validateFirstName} />
					<div className="error">{firstNameError}</div>
				</div>
				<div className="form-group">
					<label htmlFor="lastName" className="form-label">
						Last Name *
					</label>
					<input type="text" className="form-control form-input" id="lastName" value={lastName} onChange={handleLastNameChange} onFocus={handleInputFocus} onBlur={validateLastName} />
					<div className="error">{lastNameError}</div>
				</div>

				<DatePicker
					id="dateOfBirth"
					label="Date of Birth *"
					labelClassName="form-label"
					onChange={handleDateOfBirthChange}
					onFocus={handleInputFocus}
					yearsBackNumber={80}
					yearsForwardNumber={0}
					onBlur={validateDateOfBirth}
					errorMessage={dateOfBirthError}
				/>

				<DatePicker
					id="startDate"
					label="Start Date*"
					labelClassName="form-label"
					onChange={handleStartDateChange}
					onFocus={handleInputFocus}
					yearsBackNumber={50}
					yearsForwardNumber={1}
					onBlur={validateStartDate}
					errorMessage={startDateError}
				/>

				<fieldset className="address">
					<legend>Address</legend>
					<div className="form-group">
						<label htmlFor="street" className="form-label">
							Street *
						</label>
						<input type="text" className="form-control form-input" id="street" value={street} onChange={handleStreetChange} onFocus={handleInputFocus} onBlur={validateStreet} />
						<div className="error">{streetError}</div>
					</div>
					<div className="form-group">
						<label htmlFor="city" className="form-label">
							City *
						</label>
						<input type="text" className="form-control form-input" id="city" value={city} onChange={handleCityChange} onFocus={handleInputFocus} onBlur={validateCity} />
						<div className="error">{cityError}</div>
					</div>
					<div className="form-group">
						<Dropdown label="State *" options={states} dropdownText={countryStateLabel} onChange={handleStateChange} onBlur={validateState} id={"state"} listLabel="Chose your state" showListLabel={true} />
						<div className="error">{stateError}</div>
					</div>
					<div className="form-group">
						<label htmlFor="zip" className="form-label">
							Zip *
						</label>
						<input type="text" className="form-control form-input" id="zip" value={zip} onChange={handleZipChange} onFocus={handleInputFocus} onBlur={validateZip} />
						{zipError && <div className="error">{zipError}</div>}
					</div>
				</fieldset>
				<div className="form-group">
					<Dropdown
						label="Department *"
						options={departments}
						dropdownText={department}
						onChange={handleDepartmentChange}
						onBlur={validateDepartment}
						id={"department"}
						listLabel="Chose your department"
						showListLabel={true}
					/>
					<div className="error">{departmentError}</div>
				</div>
			</form>
			<Button type="submit" text={"Save"} onClick={handleSubmit} />

			<Modal isOpenState={showConfirmationModal} onClose={setShowConfirmationModal} content="Employee Created!" id="confirmation" />
		</>
	);
}
export default CreateEmployeeForm;

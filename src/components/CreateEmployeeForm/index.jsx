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
	const [department, setDepartment] = useState(departments[0].label);
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [countryStateLabel, setCountryStateLabel] = useState(states[0].label);
	const [countryState, setCountryState] = useState(states[0].value);
	const [zipCode, setZipCode] = useState("");

	const handleStateChange = (value, label) => {
		setCountryState(value);
		setCountryStateLabel(label);
	};

	const handleDepartmentChange = (value) => {
		setDepartment(value);
	};

	function saveEmployee() {
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
			zipCode: zipCode,
		};
		employees.push(employee);
		localStorage.setItem("employees", JSON.stringify(employees));
		setShowConfirmationModal(true);
	}

	return (
		<>
			<form action="#" id="create-employee">
				<label htmlFor="first-name">First Name</label>
				<input type="text" id="first-name" onChange={(e) => setFirstName(e.target.value)} />

				<label htmlFor="last-name">Last Name</label>
				<input type="text" id="last-name" onChange={(e) => setLastName(e.target.value)} />

				<label htmlFor="date-of-birth">Date of Birth</label>
				<input id="date-of-birth" type="date" onChange={(e) => setDateOfBirth(e.target.value)} />

				<label htmlFor="start-date">Start Date</label>
				<input id="start-date" type="date" onChange={(e) => setStartDate(e.target.value)} />

				<fieldset className="address">
					<legend>Address</legend>

					<label htmlFor="street">Street</label>
					<input id="street" type="text" onChange={(e) => setStreet(e.target.value)} />

					<label htmlFor="city">City</label>
					<input id="city" type="text" onChange={(e) => setCity(e.target.value)} />

					<Dropdown label="State" options={states} dropdownText={countryStateLabel} onChange={handleStateChange} id={"state"} />

					<label htmlFor="zip-code">Zip Code</label>
					<input id="zip-code" type="number" onChange={(e) => setZipCode(e.target.value)} />
				</fieldset>

				<Dropdown label="Department" options={departments} dropdownText={department} onChange={handleDepartmentChange} id={"department"} />
			</form>

			<button onClick={saveEmployee}>Save</button>
			{showConfirmationModal && <Modal setModalIsOpen={setShowConfirmationModal} content="Employee Created!" id="confirmation" />}
		</>
	);
}

export default CreateEmployeeForm;

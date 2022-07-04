import { useState } from "react";

import { states, departments } from "../../utils/statesAndDepartments";

function CreateEmployeeForm() {
	const [showConfirmationModal, setShowConfirmationModal] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [startDate, setStartDate] = useState("");
	const [department, setDepartment] = useState("Sales");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [countryState, setCountryState] = useState("AL");
	const [zipCode, setZipCode] = useState("");

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

					<label htmlFor="state">State</label>
					<select name="state" id="state" value={countryState} onChange={(e) => setCountryState(e.target.value)}>
						{states.map((state) => (
							<option key={state.name} value={state.abbreviation}>
								{state.name}
							</option>
						))}
					</select>

					<label htmlFor="zip-code">Zip Code</label>
					<input id="zip-code" type="number" onChange={(e) => setZipCode(e.target.value)} />
				</fieldset>

				<label htmlFor="department">Department</label>
				<select name="department" id="department" value={department} onChange={(e) => setDepartment(e.target.value)}>
					{departments.map((department) => (
						<option key={department.name} value={department.name}>
							{department.name}
						</option>
					))}
				</select>
			</form>

			<button onClick={saveEmployee}>Save</button>

			{showConfirmationModal && (
				<div id="confirmation" className="modal">
					Employee Created!
				</div>
			)}
		</>
	);
}

export default CreateEmployeeForm;

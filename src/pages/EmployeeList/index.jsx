import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "../../components/DataTable";

import { selectEmployeeList } from "../../store/selectors";

import { useSelector } from "react-redux";

import "./styles.scss";

function EmployeeList() {
	const navigate = useNavigate();

	const employees = useSelector(selectEmployeeList());

	useEffect(() => {
		document.title = "Current Employees - HRnet";
	}, []);

	const columns = [
		{ name: "First Name", id: "firstName", sortable: true },
		{ name: "Last Name", id: "lastName", sortable: true },
		{ name: "Start Date", id: "startDate", sortable: true },
		{ name: "Department", id: "department", sortable: true },
		{ name: "Date of Birth", id: "dateOfBirth", sortable: true },
		{ name: "Street", id: "street", sortable: true },
		{ name: "City", id: "city", sortable: true },
		{ name: "State", id: "state", sortable: true },
		{ name: "Zip Code", id: "zipCode", sortable: true },
	];

	return (
		<main>
			<div id="employee-div" className="container">
				<h1>Current Employees</h1>
				{employees ? <DataTable columns={columns} data={employees} tableId="employee" sortId="startDate" /> : "No Data"}
				<button className="button" onClick={() => navigate("/")}>
					Home
				</button>
			</div>
		</main>
	);
}

export default EmployeeList;

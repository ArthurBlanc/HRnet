import DataTable from "../DataTable";

function EmployeeTable() {
	const employees = JSON.parse(localStorage.getItem("employees"));

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
		<>
			{employees && <DataTable columns={columns} data={employees} tableId="employee" />}
			{!employees && "No Data"}
		</>
	);
}

export default EmployeeTable;

import DataTable from "../DataTable";

function EmployeeTable() {
	const employees = JSON.parse(localStorage.getItem("employees"));

	const columns = [
		{ name: "First Name", id: "firstName", selector: (row) => row.firstName, sortable: true },
		{ name: "Last Name", id: "lastName", selector: (row) => row.lastName, sortable: true },
		{ name: "Start Date", id: "startDate", selector: (row) => row.startDate, sortable: true },
		{ name: "Department", id: "department", selector: (row) => row.department, sortable: true },
		{ name: "Date of Birth", id: "dateOfBirth", selector: (row) => row.dateOfBirth, sortable: true },
		{ name: "Street", id: "street", selector: (row) => row.street, sortable: true },
		{ name: "City", id: "city", selector: (row) => row.city, sortable: true },
		{ name: "State", id: "state", selector: (row) => row.state, sortable: true },
		{ name: "Zip Code", id: "zipCode", selector: (row) => row.zipCode, sortable: true },
	];

	return (
		<>
			{employees && <DataTable columns={columns} data={employees} tableId="employee" />}
			{!employees && "No Data"}
		</>
	);
}

export default EmployeeTable;

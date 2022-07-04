import EmployeeTable from "../../components/EmployeeTable";

function EmployeeList() {
	return (
		<main>
			<div id="employee-div" className="container">
				<h1>Current Employees</h1>
				<EmployeeTable />
				<a href="/">Home</a>
			</div>
		</main>
	);
}

export default EmployeeList;

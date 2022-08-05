import EmployeeTable from "../../components/EmployeeTable";
import Button from "../../components/Button";

import "./styles.scss";

function EmployeeList() {
	return (
		<main>
			<div id="employee-div" className="container">
				<h1>Current Employees</h1>
				<EmployeeTable />
				<a href="/">
					<Button text="Home" />
				</a>
			</div>
		</main>
	);
}

export default EmployeeList;

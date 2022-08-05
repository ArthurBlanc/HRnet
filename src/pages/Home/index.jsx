import CreateEmployeeForm from "../../components/CreateEmployeeForm";
import Button from "../../components/Button";

function Home() {
	return (
		<main>
			<div className="title">
				<h1>HRnet</h1>
			</div>
			<div className="container">
				<a href="employee-list">
					<Button text="Employee List" />
				</a>
				<h2>Create Employee</h2>
				<CreateEmployeeForm />
			</div>
		</main>
	);
}

export default Home;

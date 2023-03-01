import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import EmployeeList from "./pages/EmployeeList";

/**
 * Router to render the 2 pages of the application
 *
 * @category Router
 * @component
 * @returns { React.Component } A React component
 */
function Router() {
	return (
		<React.StrictMode>
			<BrowserRouter basename="/HRnet-live">
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/employee-list" element={<EmployeeList />} />
				</Routes>
			</BrowserRouter>
		</React.StrictMode>
	);
}

export default Router;

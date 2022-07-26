/* React component to render a table with data and columns props, row are sortable, searchable and have pagination */
import { useState, useEffect } from "react";

import "./styles.scss";

function DataTable({ data, columns, tableId, sortId = "startDate" }) {
	const [sortColumn, setSortColumn] = useState(sortId);
	const [sortOrder, setSortOrder] = useState("asc");

	const [sortedData, setSortedData] = useState([]);

	useEffect(() => {
		setSortedData(sortData(data, sortColumn, sortOrder));
	}, [data, sortColumn, sortOrder, sortedData]);

	const sortData = (data, column, direction) => {
		const isDate = (value) => {
			return !isNaN(Date.parse(value));
		};

		return data.sort((a, b) => {
			if (isDate(a[column]) && isDate(b[column])) {
				const dateA = new Date(a[column]);
				const dateB = new Date(b[column]);
				return direction === "asc" ? dateA - dateB : dateB - dateA;
			} else {
				const stringA = String(a[column]).toLowerCase();
				const stringB = String(b[column]).toLowerCase();
				return direction === "asc" ? stringA > stringB : stringB > stringA;
			}
		});
	};

	const handleSort = (event, column) => {
		document.querySelectorAll(".sorting_asc").forEach((element) => {
			element.classList.add("sorting");
			element.classList.remove("sorting_asc");
		});

		document.querySelectorAll(".sorting_desc").forEach((element) => {
			element.classList.add("sorting");
			element.classList.remove("sorting_desc");
		});

		//add class "sorted" to the column and remove it from the other columns
		const oldSortedColumns = document.querySelectorAll(".sorting_1");
		if (oldSortedColumns.length > 0) {
			oldSortedColumns.forEach((column) => {
				column.classList.remove("sorting_1");
			});
		}

		const newSortedColumns = document.querySelectorAll("." + column);
		if (newSortedColumns.length > 0) {
			newSortedColumns.forEach((column) => {
				column.classList.add("sorting_1");
			});
		}

		let direction = "asc";

		if (column === sortColumn) {
			direction = sortOrder === "asc" ? "desc" : "asc";
			setSortOrder(direction);
		} else {
			setSortOrder("asc");
		}

		if (direction === "asc") {
			event.currentTarget.classList.remove("sorting_desc");
			event.currentTarget.classList.add("sorting_asc");
		} else if (direction === "desc") {
			event.currentTarget.classList.remove("sorting_asc");
			event.currentTarget.classList.add("sorting_desc");
		}

		setSortColumn(column);
	};

	return (
		<div id={tableId + "-table_wrapper"} className="dataTables_wrapper">
			<table id={tableId + "-table"} className="dataTable" role="grid" aria-describedby="employee-table_info">
				<thead>
					<tr role="row">
						{columns.map((column) => (
							<th key={column.id} className="sorting" tabIndex="0" rowSpan="1" colSpan="1" onClick={(event) => handleSort(event, column.id)}>
								{column.name}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{sortedData.length === 0 && (
						<tr className="odd">
							<td colSpan="9" className="dataTables_empty" valign="top">
								No data available in table
							</td>
						</tr>
					)}

					{sortedData &&
						sortedData.map((row, index) => (
							<tr key={index} className={index % 2 ? "even" : "odd"} role="row">
								{columns.map((column) => (
									<td key={column.id} className={column.id}>
										{row[column.id]}
									</td>
								))}
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
}

export default DataTable;

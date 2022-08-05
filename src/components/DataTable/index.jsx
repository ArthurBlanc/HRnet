/* React component to render a table with data and columns props, row are sortable, searchable and have pagination */
import { useState, useEffect } from "react";

import Pagination from "../Pagination";

import "./styles.scss";

function DataTable({ data, columns, tableId, sortId = "startDate" }) {
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [search, setSearch] = useState("");
	const [sortColumn, setSortColumn] = useState(sortId);
	const [sortOrder, setSortOrder] = useState("asc");
	const [totalCount, setTotalCount] = useState(0);
	const [totalFilteredCount, setTotalFilteredCount] = useState(0);

	const [filteredData, setFilteredData] = useState([]);
	const [sortedData, setSortedData] = useState([]);
	const [paginatedData, setPaginatedData] = useState([]);

	useEffect(() => {
		setFilteredData(
			data.filter((row) => {
				return Object.keys(row).some((key) => {
					return String(row[key]).toLowerCase().includes(search.toLowerCase());
				});
			})
		);
	}, [search, data]);

	useEffect(() => {
		setSortedData(sortData(filteredData, sortColumn, sortOrder));
		setPaginatedData(sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage));
	}, [filteredData, sortColumn, sortOrder, sortedData, page, rowsPerPage]);

	useEffect(() => {
		setPage(1);
		setTotalCount(data.length);
		setTotalFilteredCount(filteredData.length);
	}, [filteredData, data, rowsPerPage, totalFilteredCount]);

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

	const handleChangePage = (value) => {
		setPage(value);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(1);
	};

	const handleSearch = (event) => {
		setSearch(event.target.value);
	};

	const handleSort = (event, column) => {
		document.querySelectorAll(".sorting-asc").forEach((element) => {
			element.classList.add("sorting");
			element.classList.remove("sorting-asc");
		});

		document.querySelectorAll(".sorting-desc").forEach((element) => {
			element.classList.add("sorting");
			element.classList.remove("sorting-desc");
		});

		const oldSortedColumns = document.querySelectorAll(".sorting-1");
		if (oldSortedColumns.length > 0) {
			oldSortedColumns.forEach((column) => {
				column.classList.remove("sorting-1");
			});
		}

		const newSortedColumns = document.querySelectorAll("." + column);
		if (newSortedColumns.length > 0) {
			newSortedColumns.forEach((column) => {
				column.classList.add("sorting-1");
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
			event.currentTarget.classList.remove("sorting-desc");
			event.currentTarget.classList.add("sorting-asc");
		} else if (direction === "desc") {
			event.currentTarget.classList.remove("sorting-asc");
			event.currentTarget.classList.add("sorting-desc");
		}

		setSortColumn(column);
	};

	return (
		<div id={tableId + "-table-wrapper"}>
			<div id={tableId + "-table-length"} className="data-tables-length">
				<label>
					{"Show "}
					<select className="" name={tableId + "-table-length"} aria-controls={tableId + "-table"} value={rowsPerPage} onChange={handleChangeRowsPerPage}>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
					{" entries"}
				</label>
			</div>
			<div id={tableId + "-table-filter"} className="data-tables-filter">
				<label>
					{"Search: "}
					<input className="" type="search" placeholder="" aria-controls={tableId + "-table"} value={search} onChange={handleSearch} />
				</label>
			</div>
			<table id={tableId + "-table"} className="data-table" role="grid" aria-describedby="employee-table-info">
				<thead>
					<tr role="row">
						{columns.map((column) => (
							<th key={column.id} className={column.sortable ? "sorting" : ""} tabIndex="0" onClick={column.sortable ? (event) => handleSort(event, column.id) : null} rowSpan="1" colSpan="1">
								{column.name}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{paginatedData.length === 0 && (
						<tr className="odd">
							<td colSpan="9" className="data-tables-empty" valign="top">
								No data available in table
							</td>
						</tr>
					)}

					{paginatedData &&
						paginatedData.map((row, index) => (
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

			<div id={tableId + "-table-info"} className="data-tables-info" role="status" aria-live="polite">
				{`Showing ${paginatedData.length === 0 ? 0 : 1 + (page * rowsPerPage - rowsPerPage)} to ${
					page * rowsPerPage <= totalFilteredCount ? page * rowsPerPage : totalFilteredCount
				} of ${totalFilteredCount} entries`}
				{totalCount !== totalFilteredCount && " (filtered from " + totalCount + " total entries)"}
			</div>
			<div id={tableId + "-table-paginate"} className="data-tables-paginate paging-simple-numbers">
				<Pagination totalCount={totalFilteredCount} pageSize={rowsPerPage} siblingCount={1} currentPage={page} onPageChange={handleChangePage} />
			</div>
		</div>
	);
}

export default DataTable;

/* React component to render a table with data and columns props, row are sortable, searchable and have pagination */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Pagination from "../Pagination";
import Input from "../Input";

import "./styles.scss";

/**
 * Takes in data, columns and returns a table that can be sorted (if the column is declared sortable),
 * filtered (can be disable), and paginated (can be disable).
 * data and columns must be arrays of object.
 *
 * data must be an array of objects, each object will be a row in the table, the keys in the objects must be the id of the column.
 * [{ idOfColumnOne: "dataOfColumnOne", idOfColumnTwo: "dataOfColumnTwo", idOfColumnThree: "dataOfColumnThree", ...},...]
 *
 * columns must be an array of objects with the following properties:
 * [{ name: "First Name", id: "firstName", sortable: true, headColSpan: 2, bodyColSpan: 2 },...]
 * name: the name of the column displayed in the table header.
 * id: the id of the column
 * sortable: boolean, if the column is sortable
 * headColSpan: size of the column in the header
 * bodyColSpan: size of the column in the body
 *
 * @returns {React.Component} - The table component.
 */
function DataTable({
	data,
	columns,
	tableId,
	sortId = columns[0].id,
	itemsPerPageOptions = [10, 25, 50, 100],
	itemsPerPageSelectionEnabled = true,
	searchEnabled = true,
	tableInfoEnabled = true,
	paginationEnabled = true,
	// Class names for the component.
	dataTablesWrapperClassName = "data-tables-wrapper",
	dataTablesLengthClassName = "data-tables-length",
	dataTablesLengthLabelClassName = "data-tables-length-label",
	dataTablesLengthSelectClassName = "data-tables-length-select",
	dataTablesLengthOptionClassName = "data-tables-length-option",
	dataTablesSearchWrapperClassName = "data-tables-search-wrapper",
	dataTablesSearchLabelClassName = "form-label",
	dataTablesSearchInputClassName = "form-input",
	dataTablesInfoClassName = "data-tables-info",
	dataTablesPaginateClassName = "data-tables-paginate",
	dataTableClassName = "data-table",
	dataTableHeaderClassName = "data-table-header",
	dataTableHeaderTrClassName = "data-table-header-tr",
	dataTableHeaderThClassName = "data-table-header-th",
	dataTableHeaderSortedClassName = "sorting",
	dataTableBodyClassName = "data-table-body",
	dataTableBodyTrClassName = "data-table-body-tr",
	dataTableBodyTdClassName = "data-table-body-td",
	dataTableBodyTdSortedClassName = "sorting_1",
	dataTableBodyTdEmptyClassName = "data-tables-empty",
	dataTableBodyOddRowClassName = "odd",
	dataTableBodyEvenRowClassName = "even",
}) {
	/**
	 * It sorts the data by date if the value is a valid date, otherwise it sorts the data by string
	 * @returns the sorted data.
	 */
	const sortData = (data, column, direction) => {
		/**
		 * Checks if the value is a valid date.
		 * @returns a boolean value.
		 */
		const isDate = (value) => {
			return !isNaN(Date.parse(value));
		};
		// Create a copy of the data to sort.
		const dataCopy = [...data];

		if (dataCopy && dataCopy.length > 0) {
			return dataCopy.sort((a, b) => {
				// Sorting the data by date.
				if (isDate(a[column]) && isDate(b[column])) {
					const dateA = new Date(a[column]);
					const dateB = new Date(b[column]);
					return direction === "asc" ? dateA - dateB : dateB - dateA;
				} // If the value is not a valid date, it will sort the data by string.
				else {
					const stringA = String(a[column]).toLowerCase();
					const stringB = String(b[column]).toLowerCase();
					return direction === "asc" ? stringA > stringB : stringB > stringA;
				}
			});
		}
	};
	// State to track the current currentPage.
	const [currentPage, setCurrentPage] = useState(1);
	// State to track the number of items per page.
	const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
	// State to track the user's searchInput query.
	const [searchInput, setSearchInput] = useState("");
	// State to track the current sort column.
	const [sortColumn, setSortColumn] = useState(sortId);
	// State to track the current sort direction.
	const [sortOrder, setSortOrder] = useState("asc");
	// State to track the first item of the current page.
	const [firstItemOnPage, setFirstItemOnPage] = useState(1);
	// State to track the last item of the current page.
	const [lastItemOnPage, setLastItemOnPage] = useState(itemsPerPageOptions[0]);
	// State to store the data that matches the searchInput query.
	const [filteredData, setFilteredData] = useState(data);
	// State to store the data that matches the searchInput query and are sorted.
	const [sortedData, setSortedData] = useState(filteredData);
	// State to store the data that matches the searchInput query, are sorted on the current page.
	const [paginatedData, setPaginatedData] = useState(sortedData);
	// State to track the count of all items that match the searchInput query.
	const [totalFilteredItemsCount, setTotalFilteredCount] = useState(filteredData.length);

	// Variable to track the count of all items.
	const totalItemsCount = data.length;

	useEffect(() => {
		if (filteredData.length > 0) {
			setSortedData(sortData(filteredData, sortColumn, sortOrder));
		} else {
			setSortedData([]);
		}
	}, [filteredData, sortColumn, sortOrder]);

	useEffect(() => {
		// Calculating the first item on the current page.
		const firstItemOnPage = (currentPage - 1) * itemsPerPage;
		// Checking if the last item on the page is less than the length of the sorted data. If it is, it will
		// set the last item on the page to the first item on the page plus the number of items per page. If it
		// is not, it will set the last item on the page to the length of the sorted data.
		const lastItemOnPage = firstItemOnPage + itemsPerPage < sortedData.length ? firstItemOnPage + itemsPerPage : sortedData.length;

		setFirstItemOnPage(firstItemOnPage + 1);
		setLastItemOnPage(lastItemOnPage);
		setPaginatedData(sortedData.slice(firstItemOnPage, lastItemOnPage));

		// If the first item on the page is greater than the length of the sorted data, it will set the
		// current page to 1.
		if (firstItemOnPage > sortedData.length) {
			setCurrentPage(1);
		}
	}, [filteredData, sortedData, sortColumn, sortOrder, currentPage, itemsPerPage]);

	// Check if pagination is enabled, if not, the items per page is set to the length of the data.
	useEffect(() => {
		if (!paginationEnabled) {
			setItemsPerPage(data.length);
		}
	}, [paginationEnabled, data]);

	// Takes the search input and filters the data based on the search input
	const handleSearch = (event) => {
		const searchValue = event.target ? event.target.value : event;
		setSearchInput(searchValue);

		let filteredData = [...data];

		const searchValueLowerCase = searchValue.toLowerCase();
		if (searchValueLowerCase) {
			filteredData = data.filter((item) => {
				return Object.values(item).some((value) => {
					return String(value).toLowerCase().includes(searchValueLowerCase);
				});
			});
		}
		setFilteredData(filteredData);
		setTotalFilteredCount(filteredData.length);
	};

	// If the column is the same as the current sort column, then toggle the sort order.
	// Otherwise, set the sort order to ascending
	const handleSortChange = (column) => {
		let direction = "asc";
		if (column === sortColumn) {
			direction = sortOrder === "asc" ? "desc" : "asc";
		}

		setSortOrder(direction);
		setSortColumn(column);
	};

	// Sets the items per page to the value of the event target and sets the current page to 1.
	const handleChangeItemsPerPage = (event) => {
		setItemsPerPage(+event.target.value);
		setCurrentPage(1);
	};

	return (
		<div id={tableId + "-table-wrapper"} className={dataTablesWrapperClassName}>
			{itemsPerPageSelectionEnabled && paginationEnabled && (
				<div id={tableId + "-table-length"} className={dataTablesLengthClassName}>
					<label className={dataTablesLengthLabelClassName}>
						{"Show "}
						<select className={dataTablesLengthSelectClassName} name={tableId + "-table-length"} aria-controls={tableId + "-table"} value={itemsPerPage} onChange={handleChangeItemsPerPage}>
							{itemsPerPageOptions.map((option) => (
								<option key={option} value={option} className={dataTablesLengthOptionClassName}>
									{option}
								</option>
							))}
						</select>
						{" entries"}
					</label>
				</div>
			)}

			{searchEnabled && (
				<div id={tableId + "-table-search-wrapper"} className={dataTablesSearchWrapperClassName}>
					<Input
						id={tableId + "-table-search"}
						type="search"
						value={searchInput}
						label="Search:"
						onChange={handleSearch}
						labelClassName={dataTablesSearchLabelClassName}
						inputClassName={dataTablesSearchInputClassName}
						wrapperClassName=""
						addErrorElement={false}
						aria-controls={tableId + "-table"}
					/>
				</div>
			)}
			<table id={tableId + "-table"} className={dataTableClassName} role="grid" aria-describedby="employee-table-info">
				<thead className={dataTableHeaderClassName}>
					<tr role="row" className={dataTableHeaderTrClassName}>
						{columns.map((column) => (
							<th
								key={column.id}
								// If the column is sortable, then it will add the sortable class. If the column is sorted, then it will add the sorted class.
								className={
									dataTableHeaderThClassName + (column.sortable && column.id !== sortColumn ? " " + dataTableHeaderSortedClassName : "") + (column.id === sortColumn ? " sorting-" + sortOrder : "")
								}
								tabIndex="0"
								onClick={column.sortable ? () => handleSortChange(column.id) : null}
								rowSpan="1"
								colSpan={column.headColSpan ? column.headColSpan : 1}
							>
								{column.name}
							</th>
						))}
					</tr>
				</thead>
				<tbody className={dataTableBodyClassName}>
					{paginatedData.length === 0 && (
						<tr className={dataTableBodyTrClassName + " " + dataTableBodyOddRowClassName}>
							<td colSpan={columns.length} className={dataTableBodyTdClassName + dataTableBodyTdEmptyClassName} valign="top">
								No data available in table
							</td>
						</tr>
					)}

					{paginatedData.length > 0 &&
						paginatedData.map((row, index) => (
							<tr
								key={index}
								// If the row is odd, add the odd row class name, otherwise add the even row class name
								className={dataTableBodyTrClassName + (index % 2 ? " " + dataTableBodyEvenRowClassName : " " + dataTableBodyOddRowClassName)}
								role="row"
							>
								{columns.map((column) => (
									<td
										key={column.id}
										// If the column is sorted, add the sorted class name
										className={dataTableBodyTdClassName + " " + (column.id + (column.id === sortColumn ? " " + dataTableBodyTdSortedClassName : ""))}
										colSpan={column.bodyColSpan ? column.bodyColSpan : 1}
									>
										{row[column.id]}
									</td>
								))}
							</tr>
						))}
				</tbody>
			</table>

			{tableInfoEnabled && (
				<div id={tableId + "-table-info"} className={dataTablesInfoClassName} role="status" aria-live="polite">
					{`Showing ${paginatedData.length === 0 ? 0 : firstItemOnPage} to ${lastItemOnPage} of ${totalFilteredItemsCount} entries`}
					{totalItemsCount !== totalFilteredItemsCount && " (filtered from " + totalItemsCount + " total entries)"}
				</div>
			)}
			{paginationEnabled && (
				<div id={tableId + "-table-paginate"} className={dataTablesPaginateClassName}>
					<Pagination totalCount={totalFilteredItemsCount} pageSize={itemsPerPage} siblingCount={1} currentPage={currentPage} onPageChange={setCurrentPage} />
				</div>
			)}
		</div>
	);
}

DataTable.propTypes = {
	// data array of object (required): The data to be displayed in the table.
	data: PropTypes.arrayOf(PropTypes.object).isRequired,

	// columns array of object (required): The columns to be displayed in the table.
	columns: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired, sortable: PropTypes.bool, headColSpan: PropTypes.number, bodyColSpan: PropTypes.number })).isRequired,

	// tableId string (required): The id of the table.
	tableId: PropTypes.string.isRequired,

	// sortId string: The id of the column to be sorted.
	sortId: PropTypes.string,

	// itemsPerPageOptions array: The options for the items per page dropdown.
	itemsPerPageOptions: PropTypes.array,

	// itemsPerPageSelectEnabled boolean: Whether the items per page dropdown should be enabled.
	itemsPerPageSelectionEnabled: PropTypes.bool,

	// searchEnabled boolean: Whether the search input should be enabled.
	searchEnabled: PropTypes.bool,

	// tableInfoEnabled boolean: Whether the table info should be enabled.
	tableInfoEnabled: PropTypes.bool,

	// paginationEnabled boolean: Whether the pagination should be enabled.
	paginationEnabled: PropTypes.bool,

	// dataTablesWrapperClassName string: The class name of the wrapper div.
	dataTablesWrapperClassName: PropTypes.string,

	// dataTablesLengthClassName string: The class name of the length div.
	dataTablesLengthClassName: PropTypes.string,

	// dataTablesLengthLabelClassName string: The class name of the length label.
	dataTablesLengthLabelClassName: PropTypes.string,

	// dataTablesLengthSelectClassName string: The class name of the length select.
	dataTablesLengthSelectClassName: PropTypes.string,

	// dataTablesLengthOptionsClassName string: The class name of the length options.
	dataTablesLengthOptionClassName: PropTypes.string,

	// dataTablesSearchWrapperClassName string: The class name of the search wrapper div.
	dataTablesSearchWrapperClassName: PropTypes.string,

	// dataTablesSearchLabelClassName string: The class name of the search label.
	dataTablesSearchLabelClassName: PropTypes.string,

	// dataTablesSearchInputClassName string: The class name of the search input.
	dataTablesSearchInputClassName: PropTypes.string,

	// dataTablesInfoClassName string: The class name of the info div.
	dataTablesInfoClassName: PropTypes.string,

	// dataTablesPaginateClassName string: The class name of the paginate div.
	dataTablesPaginateClassName: PropTypes.string,

	// dataTableClassName string: The class name of the table.
	dataTableClassName: PropTypes.string,

	// dataTableHeaderClassName string: The class name of the table header.
	dataTableHeaderClassName: PropTypes.string,

	// dataTableHeaderTrClassName string: The class name of the table header tr.
	dataTableHeaderTrClassName: PropTypes.string,

	// dataTableHeaderThClassName string: The class name of the table header th.
	dataTableHeaderThClassName: PropTypes.string,

	// dataTableHeaderSortedClassName string: The class name of the table header th sorted.
	dataTableHeaderSortedClassName: PropTypes.string,

	// dataTableBodyClassName string: The class name of the table body.
	dataTableBodyClassName: PropTypes.string,

	// dataTableBodyTrClassName string: The class name of the table body tr.
	dataTableBodyTrClassName: PropTypes.string,

	// dataTableBodyTdClassName string: The class name of the table body td.
	dataTableBodyTdClassName: PropTypes.string,

	// dataTableBodyTdSortedClassName string: The class name of the table body td sorted.
	dataTableBodyTdSortedClassName: PropTypes.string,

	// dataTableBodyTdEmptyClassName string: The class name of the table body td empty.
	dataTableBodyTdEmptyClassName: PropTypes.string,

	// dataTableBodyOddRowClassName string: The class name of the table body tr odd.
	dataTableBodyOddRowClassName: PropTypes.string,

	// dataTableBodyEvenRowClassName string: The class name of the table body tr even.
	dataTableBodyEvenRowClassName: PropTypes.string,
};

export default DataTable;

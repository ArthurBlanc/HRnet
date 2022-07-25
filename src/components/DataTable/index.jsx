/* React component to render a table with data and columns props, row are sortable, searchable and have pagination */
import "./styles.scss";

function DataTable({ data, columns, tableId }) {
	return (
		<div id={tableId + "-table_wrapper"} className="dataTables_wrapper">
			<table id={tableId + "-table"} className="dataTable" role="grid" aria-describedby="employee-table_info">
				<thead>
					<tr role="row">
						{columns.map((column) => (
							<th key={column.id} className="sorting" tabIndex="0" rowSpan="1" colSpan="1">
								{column.name}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.length === 0 && (
						<tr className="odd">
							<td colSpan="9" className="dataTables_empty" valign="top">
								No data available in table
							</td>
						</tr>
					)}

					{data &&
						data.map((row, index) => (
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

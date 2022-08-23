import { useMemo } from "react";
import PropTypes from "prop-types";

import "./styles.scss";

/**
 * A pagination component that can be used to navigate through a list of items.
 *
 * @returns {React.Component} - The pagination component.
 */
function Pagination({
	totalCount,
	pageSize,
	siblingCount = 1,
	currentPage,
	onPageChange,
	DOTS = "...",
	DOTSClassName = "ellipsis",
	previousButtonClassName = "paginate-button previous",
	nextButtonClassName = "paginate-button next",
	pageButtonClassName = "paginate-button",
	currentPageClassName = "current-page",
	disabledClassName = "disabled",
	...props
}) {
	/**
	 * Function to generate a range of pages to display
	 * @returns An array of numbers.
	 */
	const range = (start, end) => {
		let length = end - start + 1;
		return Array.from({ length }, (_, index) => index + start);
	};

	// Function called when the component is rendered. It is used to generate a range of pages to display.
	const paginationRange = useMemo(() => {
		// Calculating the total number of pages.
		const totalPageCount = Math.ceil(totalCount / pageSize);

		// Calculating the total number of pages to show in the pagination component.
		const totalPageToShow = siblingCount + 5;

		// If the number of pages to show is less than the total of pages, return the range from 1 to the total number of pages.
		if (totalPageToShow >= totalPageCount) {
			return range(1, totalPageCount);
		}

		/* Calculating the sibling index. */
		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

		// Don't show DOTS if there is only one position left after/before.
		const showLeftDots = leftSiblingIndex > 2;
		const showRightDots = rightSiblingIndex < totalPageCount - 2;

		const firstPageIndex = 1;
		const lastPageIndex = totalPageCount;

		// Check if there are more pages to show on the right side of the pagination component.
		// If there are more pages to show on the right side of the pagination component,
		// Then return the range from the first page to the right sibling index.
		if (!showLeftDots && showRightDots) {
			let leftItemCount = 3 + 2;
			let leftRange = range(1, leftItemCount);

			return [...leftRange, DOTS, totalPageCount];
		}

		// Check if there are more pages to show on the left side of the pagination component.
		// If there are more pages to show on the left side of the pagination component,
		// Then return the range from the left sibling index to the last page.
		if (showLeftDots && !showRightDots) {
			let rightItemCount = 3 + 2;
			let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
			return [firstPageIndex, DOTS, ...rightRange];
		}

		// Check if there are more pages to show on both sides of the pagination component.
		// If there are more pages to show on both sides of the pagination component,
		// Then return the range from the first page to the left sibling index,
		if (showLeftDots && showRightDots) {
			let middleRange = range(leftSiblingIndex, rightSiblingIndex);
			return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
		}
	}, [totalCount, pageSize, siblingCount, currentPage, DOTS]);

	// Check to see if the current page is 0 or if the pagination range is less than 2.
	//If true, then the pagination component will not be rendered.
	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	// Go to the next page.
	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	// Go to the previous page.
	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	let lastPage = paginationRange[paginationRange.length - 1];

	return (
		<>
			<button
				// Check to see if the current page is 1. If true, add disabled class.
				className={previousButtonClassName + (currentPage === 1 ? " " + disabledClassName : "")}
				// If the current page is 1, then disable the previous button.
				disabled={currentPage === 1}
				tabIndex={currentPage === 1 ? -1 : 0}
				onClick={onPrevious}
				{...props}
			>
				Previous
			</button>
			<span>
				{paginationRange.map((pageNumber, index) => {
					if (pageNumber === DOTS) {
						return (
							<span key={index} className={DOTSClassName}>
								{DOTS}
							</span>
						);
					}

					return (
						<button
							key={index}
							// Check to see if the current page is the same as the page number. If true, add current class.
							className={pageButtonClassName + (currentPage === pageNumber ? " " + currentPageClassName : "")}
							onClick={() => onPageChange(pageNumber)}
							{...props}
						>
							{pageNumber}
						</button>
					);
				})}
			</span>

			<button
				// Check to see if the current page is the same as the last page. If true, add disabled class.
				className={nextButtonClassName + (currentPage >= lastPage ? " " + disabledClassName : "")}
				// If the current page is the same as the last page, then disable the next button.
				disabled={currentPage === lastPage}
				tabIndex={currentPage === lastPage ? -1 : 0}
				onClick={onNext}
				{...props}
			>
				Next
			</button>
		</>
	);
}

Pagination.propTypes = {
	// totalCount number (required): The total number of items in the list
	totalCount: PropTypes.number.isRequired,

	// pageSize number (required): The number of items to show per page
	pageSize: PropTypes.number.isRequired,

	// siblingCount number: The number of pages to show before and after the current page
	siblingCount: PropTypes.number,

	// currentPage number (required): The current page number
	currentPage: PropTypes.number.isRequired,

	// onPageChange function (required): The function to call when a page is clicked
	onPageChange: PropTypes.func.isRequired,

	// DOTS string: The string to show in the pagination component when there are more pages than can be shown
	DOTS: PropTypes.string,

	// DOTSClassName string: The class name to add to the pagination component when there are more pages than can be shown
	DOTSClassName: PropTypes.string,

	// pageButtonClassName string: The class name to add to the page buttons
	pageButtonClassName: PropTypes.string,

	// currentPageClassName string: The class name to add to the current page button
	currentPageClassName: PropTypes.string,

	// previousButtonClassName string: The class name to add to the previous button
	previousButtonClassName: PropTypes.string,

	// nextButtonClassName string: The class name to add to the next button
	nextButtonClassName: PropTypes.string,

	// disabledClassName string: The class name to add to the disabled buttons
	disabledClassName: PropTypes.string,
};

export default Pagination;

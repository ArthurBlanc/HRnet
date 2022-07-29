import { useMemo } from "react";

import "./styles.scss";

function Pagination({ totalCount, pageSize, siblingCount = 1, currentPage, onPageChange, className, DOTS = "..." }) {
	const range = (start, end) => {
		let length = end - start + 1;
		return Array.from({ length }, (_, index) => index + start);
	};

	const paginationRange = useMemo(() => {
		const totalPageCount = Math.ceil(totalCount / pageSize);
		const totalPageNumbers = siblingCount + 5;

		if (totalPageNumbers >= totalPageCount) {
			return range(1, totalPageCount);
		}

		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

		const firstPageIndex = 1;
		const lastPageIndex = totalPageCount;

		if (!shouldShowLeftDots && shouldShowRightDots) {
			let leftItemCount = 3 + 2;
			let leftRange = range(1, leftItemCount);

			return [...leftRange, DOTS, totalPageCount];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			let rightItemCount = 3 + 2;
			let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount);
			return [firstPageIndex, DOTS, ...rightRange];
		}

		if (shouldShowLeftDots && shouldShowRightDots) {
			let middleRange = range(leftSiblingIndex, rightSiblingIndex);
			return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
		}
	}, [totalCount, pageSize, siblingCount, currentPage, DOTS]);

	if (currentPage === 0 || paginationRange.length < 2) {
		return null;
	}

	const onNext = () => {
		onPageChange(currentPage + 1);
	};

	const onPrevious = () => {
		onPageChange(currentPage - 1);
	};

	let lastPage = paginationRange[paginationRange.length - 1];
	let idxCount = 0;

	return (
		<>
			<button
				className={"paginate_button previous" + (className ? " " + className : "") + (currentPage === 1 ? " disabled" : "")}
				disabled={currentPage === 1}
				data-dt-idx={idxCount}
				tabIndex={currentPage === 1 ? -1 : 0}
				onClick={onPrevious}
			>
				Previous
			</button>
			<span>
				{paginationRange.map((pageNumber, index) => {
					idxCount = idxCount + 1;
					if (pageNumber === DOTS) {
						idxCount = idxCount - 1;
						return (
							<span key={index} className={"ellipsis" + (className ? " " + className : "")}>
								{DOTS}
							</span>
						);
					}
					return (
						<button
							key={index}
							className={"paginate_button" + (className ? " " + className : "") + (currentPage === pageNumber ? " current" : "")}
							data-dt-idx={idxCount}
							onClick={() => onPageChange(pageNumber)}
						>
							{pageNumber}
						</button>
					);
				})}
			</span>
			<button
				className={"paginate_button next" + (currentPage >= lastPage ? " disabled" : "")}
				disabled={currentPage === lastPage}
				tabIndex={currentPage === lastPage ? -1 : 0}
				data-dt-idx={idxCount + 1}
				onClick={onNext}
			>
				Next
			</button>
		</>
	);
}

export default Pagination;

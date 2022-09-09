import { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";

import { useClickOutside } from "../../hooks/useClickOutside";
import { useKeypress } from "../../hooks/useKeypress";
import { useTrapFocus } from "../../hooks/useTrapFocus";

import Dropdown from "../Dropdown";
import Input from "../Input";

import "./styles.scss";

/**
 * A date picker that allows the user to select a date. The date picker is a modal that contains a calendar.
 * The calendar is open if the input is focused and closed if the user clicks outside of the date picker.
 * The user can select a date by clicking on a day of the calendar or by typing in the input.
 * If the user enters something that is not a valid date, the today's date will be selected.
 * The calendar can start a Sunday or Monday, and can be in MMDDYYYY or DDMMYYYY format.
 * The separator can be customized, by default it is a "/".
 * The year and month shown in the calendar can be selected with dropdowns.
 * There are also arrow buttons to navigate through the months.
 * A range of years can be customized, by default it is from 120 years back and 50 years forward to current year.
 *
 *
 * @category Components
 * @component
 * @returns {React.Component} - The date picker component.
 */
function DatePicker({
	id,
	label,
	value = "",
	onChange,
	onFocus,
	onBlurFunction,
	yearsBackNumber = 120,
	yearsForwardNumber = 50,
	separator = "/",
	dateFormat = "MMDDYYYY",
	firstDayOfTheWeek = "Sunday",
	previousButtonText = "",
	nextButtonText = "",
	todayButtonText = "Today",
	// Class names for the component.
	labelClassName = "form-label",
	formatDateClassName = "date-format",
	dateClassName = "date",
	headerClassName = "header-day",
	datePickerInputWrapperClassName = "date-picker-input-wrapper",
	datePickerWrapperClassName = "date-picker-wrapper",
	datePickerClassName = "date-picker",
	datePickerNavWrapperClassName = "date-picker-nav-wrapper",
	datePickerPreviousButtonClassName = "prev",
	datePickerTodayButtonClassName = "today",
	datePickerNextButtonClassName = "next",
	datePickerMonthDropdownWrapperClassName = "label month-picker",
	datePickerYearDropdownWrapperClassName = "label year-picker",
	calendarWrapperClassName = "calendar",
	calendarTableClassName = "",
	calendarHeaderClassName = "",
	calendarHeaderTrClassName = "",
	calendarHeaderThClassName = "header-day-wrapper",
	calendarBodyClassName = "",
	calendarBodyTrClassName = "",
	calendarBodyTdClassName = "date-wrapper",
	calendarForbiddenClassName = "forbidden-date",
	calendarOtherMonthClassName = "other-month",
	calendarTodayClassName = "calendar-today",
	calendarSelectedClassName = "current-selection",
	// Month dropdown props.
	monthDropdownLabel = "Chose the month",
	monthListLabel = "Choose your month",
	monthShowListLabel = false,
	// Month dropdown classnames.
	monthDropdownLabelClassName = "sr-only",
	monthDropdownWrapperClassName = "dropdown-wrapper",
	monthDropdownButtonClassName = "dropdown-button",
	monthDropdownIconClassName = "dropdown-icon",
	monthDropdownListWrapperClassName = "dropdown-list-wrapper",
	monthDropdownOptionClassName = "dropdown-option",
	monthDropdownOptionSelectedClassName = "current-selection",
	monthDropdownListClassName = "dropdown-list",
	monthDropdownListLabelClassName = "label",
	monthDropdownInputClassName = "dropdown-text",
	// Year dropdown props.
	yearDropdownLabel = "Chose the year",
	yearListLabel = "Choose your year",
	yearShowListLabel = false,
	// Year dropdown classnames.
	yearDropdownLabelClassName = "sr-only",
	yearDropdownWrapperClassName = "dropdown-wrapper",
	yearDropdownButtonClassName = "dropdown-button",
	yearDropdownIconClassName = "dropdown-icon",
	yearDropdownListWrapperClassName = "dropdown-list-wrapper",
	yearDropdownOptionClassName = "dropdown-option",
	yearDropdownOptionSelectedClassName = "current-selection",
	yearDropdownListClassName = "dropdown-list",
	yearDropdownListLabelClassName = "label",
	yearDropdownInputClassName = "dropdown-text",
	// Input props.
	error,
	maxLength = 10,
	required = false,
	requiredFeedbackEnabled = false,
	requiredFeedback = "*",
	inputClassName = "form-control form-input",
	// Input classnames.
	inputWrapperClassName = "form-group",
	activeClassName = "active",
	invalidClassName = "invalid",
	errorClassName = "error",
	requiredFeedbackClassName = "required",
	...props
}) {
	// State to track if the datepicker is open or not
	const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);

	// State to have the current date
	const [currentDate] = useState(new Date());
	// State to have the current day
	const [currentDay] = useState(currentDate.getDate());
	// State to have the current month
	const [currentMonth] = useState(currentDate.getMonth() + 1);
	// State to have the current year
	const [currentYear] = useState(currentDate.getFullYear());

	// State to track the selected day by the user
	const [selectedDay, setSelectedDay] = useState("");
	// State to track the selected ymonth by the user
	const [selectedMonth, setSelectedMonth] = useState("");
	// State to track the selected year by the user
	const [selectedYear, setSelectedYear] = useState("");
	// State to track the selected date by the user
	const [selectedDate, setSelectedDate] = useState(value);

	// State to track the month shown in the datepicker
	const [showedMonth, setShowedMonth] = useState(currentMonth);
	// State to track the year shown in the datepicker
	const [showedYear, setShowedYear] = useState(currentYear);

	// State to get the days of the shown month
	const [calendarData, setCalendarData] = useState([]);

	// Cache the daysOfWeek value.
	const daysOfWeek = useMemo(() => {
		let week = [
			{ full: "Sunday", abbr: "Sun" },
			{ full: "Monday", abbr: "Mon" },
			{ full: "Tuesday", abbr: "Tue" },
			{ full: "Wednesday", abbr: "Wed" },
			{ full: "Thursday", abbr: "Thu" },
			{ full: "Friday", abbr: "Fri" },
			{ full: "Saturday", abbr: "Sat" },
		];
		if (firstDayOfTheWeek === "Monday") {
			week = [
				{ full: "Monday", abbr: "Mon" },
				{ full: "Tuesday", abbr: "Tue" },
				{ full: "Wednesday", abbr: "Wed" },
				{ full: "Thursday", abbr: "Thu" },
				{ full: "Friday", abbr: "Fri" },
				{ full: "Saturday", abbr: "Sat" },
				{ full: "Sunday", abbr: "Sun" },
			];
		}
		return week;
	}, [firstDayOfTheWeek]);
	// Cache the years array.
	const years = useMemo(() => {
		const array = [...Array(yearsForwardNumber + yearsBackNumber + 1).keys()].map((i) => currentYear - yearsBackNumber + i);
		return array;
	}, [currentYear, yearsBackNumber, yearsForwardNumber]);
	// Cache the minYear value.
	const minYear = useMemo(() => {
		const year = currentYear - yearsBackNumber;
		return year;
	}, [currentYear, yearsBackNumber]);
	// Cache the maxYear value.
	const maxYear = useMemo(() => {
		const year = currentYear + yearsForwardNumber;
		return year;
	}, [currentYear, yearsForwardNumber]);

	// Array of months to be used in the dropdown.
	const months = [
		{ label: "January", value: 1 },
		{ label: "February", value: 2 },
		{ label: "March", value: 3 },
		{ label: "April", value: 4 },
		{ label: "May", value: 5 },
		{ label: "June", value: 6 },
		{ label: "July", value: 7 },
		{ label: "August", value: 8 },
		{ label: "September", value: 9 },
		{ label: "October", value: 10 },
		{ label: "November", value: 11 },
		{ label: "December", value: 12 },
	];

	const closeDatePicker = () => {
		setDatePickerIsOpen(false);

		if (onBlurFunction) {
			onBlurFunction(value, id);
			document.activeElement.blur();
		}
	};

	// UseRef hook to create a ref for the modal.
	// The useEffect hook is then used to add an event listener to the document.
	const ref = useRef();
	useClickOutside(ref, datePickerIsOpen, closeDatePicker);
	useKeypress("Escape", datePickerIsOpen, closeDatePicker);
	useTrapFocus(ref, datePickerIsOpen);

	useEffect(() => {
		if (datePickerIsOpen) {
			/**
			 * Calculates the number of days in a month.
			 * @returns Number - The number of days in the month.
			 */
			const getDaysInMonth = (month, year) => {
				return new Date(year, month, 0).getDate();
			};

			/**
			 * Returns the first day of the month, in the form of a number.
			 * @returns Number - The first day of the month.
			 * If Sunday is the first day of the week: 0 is Sunday, 1 is Monday, etc
			 * If Monday is the first day of the week: 0 is Monday, 1 is Tuesday, etc
			 */
			const firstDayOfMonth = (month, year) => {
				let day = 0;
				if (firstDayOfTheWeek === "Monday") {
					day = 1;
				}
				return new Date(year, month - 1, 1).getDay() - day;
			};

			let calendarData = [];

			// Get the number of days in the showed month.
			const numberOfDaysInShowedMonth = getDaysInMonth(showedMonth, showedYear);
			// Get the number of days in the previous month.
			const numberOfDaysInPreviousMonth = getDaysInMonth(showedMonth - 1, showedYear);
			// Get the first day of the showed month.
			const firstDayOfShowedMonth = firstDayOfMonth(showedMonth, showedYear);
			// Calculate the number of weeks in the showed month.
			const numberOfWeeksInShowedMonth = Math.ceil((numberOfDaysInShowedMonth + firstDayOfShowedMonth) / 7);

			// Loop for generating the week data.
			for (let i = 0; i < numberOfWeeksInShowedMonth; i++) {
				let weekData = {};

				// Loop for generating the day data.
				daysOfWeek.forEach((dayOfWeek, j) => {
					// Calculating the day value
					const dayValue = i * 7 + j + 1 - firstDayOfShowedMonth;

					// Checking if the previous year is the first year of the calendarData.
					const isFirstYearOfTheCalendar = showedYear - 1 < minYear;
					// Checking if the shown month is the first month of the year.
					const isFirstMonthOfTheYear = showedMonth === 1;
					// Checking if the shown month is the first month of the calendarData.
					const isFirstMonthOfTheCalendar = isFirstYearOfTheCalendar && isFirstMonthOfTheYear;

					// Checking if the next year is the last year of the calendarData.
					const isLastYearOfTheCalendar = showedYear + 1 > maxYear;
					// Checking if the shown month is the last month of the year.
					const isLastMonthOfTheYear = showedMonth === 12;
					// Checking if the shown month is the last month of the calendarData.
					const isLastMonthOfTheCalendar = isLastYearOfTheCalendar && isLastMonthOfTheYear;

					// ClassName for the day.
					let className = dateClassName;
					// Number of the day.
					let day = dayValue;
					// Number of the month of the day.
					let month = showedMonth;
					// Number of the year of the day.
					let year = showedYear;

					const forbiddenDate = (variable) => {
						if (variable) {
							className += " " + calendarForbiddenClassName;
							day = null;
							month = null;
							year = null;
						} else if (!variable) {
							className += " " + calendarOtherMonthClassName;
						}
					};

					// If dayValue is less than 1, it is the previous month.
					if (dayValue <= 0) {
						day = dayValue + numberOfDaysInPreviousMonth;
						month = showedMonth - 1;

						forbiddenDate(isFirstMonthOfTheCalendar);

						if (isFirstMonthOfTheYear && !isFirstMonthOfTheCalendar) {
							month = 12;
							year = showedYear - 1;
						}
					}
					// If dayValue is greater than the number of days in the month, it is the next month.
					if (dayValue > numberOfDaysInShowedMonth) {
						day = dayValue - numberOfDaysInShowedMonth;
						month = showedMonth + 1;

						forbiddenDate(isLastMonthOfTheCalendar);

						if (isLastMonthOfTheYear && !isLastMonthOfTheCalendar) {
							month = 1;
							year = showedYear + 1;
						}
					}

					// If the day is today, add the className for the today className.
					if (day === currentDay && month === currentMonth && year === currentYear) {
						className += " " + calendarTodayClassName;
					}

					// If the day is selected, add the className for the selected className.
					if (day === selectedDay && month === selectedMonth && year === selectedYear) {
						className += " " + calendarSelectedClassName;
					}

					const dayData = {
						day: day,
						month: month,
						year: year,
						className: className,
						isFirstMonthOfTheCalendar: isFirstMonthOfTheCalendar,
						isLastMonthOfTheCalendar: isLastMonthOfTheCalendar,
					};
					// Adding the day to the to the week.
					weekData[dayOfWeek.abbr] = dayData;
				});
				// Adding the week to the month.
				calendarData.push(weekData);
			}
			// Adding the monthData to the calendar state.
			setCalendarData(calendarData);
		}
	}, [
		datePickerIsOpen,
		currentDay,
		currentMonth,
		currentYear,
		daysOfWeek,
		maxYear,
		minYear,
		selectedDay,
		selectedMonth,
		selectedYear,
		showedMonth,
		showedYear,
		firstDayOfTheWeek,
		dateClassName,
		calendarForbiddenClassName,
		calendarOtherMonthClassName,
		calendarTodayClassName,
		calendarSelectedClassName,
	]);

	/**
	 * If the onFocus prop is defined, call it with the event.
	 * Then open the date picker.
	 */
	const handleFocus = (event) => {
		if (onFocus) {
			onFocus(event);
		}
		setDatePickerIsOpen(true);
	};

	/**
	 * It takes a number, if it is less than 10, it adds a 0 to the front of it.
	 * @returns a string of two digits.
	 */
	const twoDigit = (num) => {
		return ("0" + num).slice(-2);
	};

	/**
	 * Checks if the date is valid and in the correct format
	 * Also the year must be  within the min and max year
	 * @returns A boolean value.
	 */
	const isDateValid = (date) => {
		// Regex to validate the date format, MMDDYYYY
		let regexDate = new RegExp(`^(0[1-9]|1[0-2])${separator}(0[1-9]|[1-2][0-9]|3[0-1])${separator}(19|20)\\d{2}$`);

		if (dateFormat === "DDMMYYYY") {
			// Regex to validate the date format, DDMMYYYY
			regexDate = new RegExp(`^(0[1-9]|[1-2][0-9]|3[0-1])${separator}(0[1-9]|1[0-2])${separator}(19|20)\\d{2}$`);
		}

		if (regexDate.test(date)) {
			const year = date.split(separator)[2];
			if (year >= minYear && year <= maxYear) {
				return true;
			}
		}
		return false;
	};

	/**
	 * When user manually enters a something in input, check if it is valid date
	 * If true, update the states.
	 */
	const handleChangeInput = (event, length) => {
		const insertSeparator = (thisValue, separator) => {
			if ((thisValue.length === 2 && length === 1) || (thisValue.length === 5 && length === 4)) {
				thisValue += separator;
				return thisValue;
			}
			return thisValue;
		};
		let date = insertSeparator(event.target ? event.target.value : event, separator);

		if (isDateValid(date)) {
			let day, month, year;

			if (dateFormat === "MMDDYYYY") {
				[month, day, year] = date.split(separator);
			} else if (dateFormat === "DDMMYYYY") {
				[day, month, year] = date.split(separator);
			}

			setSelectedDay(+day);
			setSelectedMonth(+month);
			setSelectedYear(+year);
			setShowedMonth(+month);
			setShowedYear(+year);
			setDatePickerIsOpen(false);
			setSelectedDate(date);
		}
		if (onChange) {
			onChange(date);
		}
	};

	/** When user blur the input, check if the date is valid
	 * If not valid, reset the date to the today date.
	 * If the onBlur prop is defined, call it with the date and id of the datePicker.
	 */
	const handleOnBlur = (event) => {
		const date = event.target ? event.target.value : event;

		if (!isDateValid(date) && date !== "") {
			let formattedDate = twoDigit(currentMonth) + separator + twoDigit(currentDay) + separator + currentYear;
			if (dateFormat === "DDMMYYYY") {
				formattedDate = twoDigit(currentDay) + separator + twoDigit(currentMonth) + separator + currentYear;
			}

			setSelectedDay(currentDay);
			setSelectedMonth(currentMonth);
			setSelectedYear(currentYear);
			setShowedMonth(currentMonth);
			setShowedYear(currentYear);
			setSelectedDate(formattedDate);
			if (onChange) {
				onChange(formattedDate);
			}
		}
	};

	/**
	 * It increments the month by one, unless the month is December,
	 * in which case it increments the year by one and sets the month to January
	 */
	const handleNextMonth = (event) => {
		if (event) {
			event.preventDefault();
		}
		if (showedMonth === 12) {
			if (showedYear < maxYear) {
				setShowedMonth(1);
				setShowedYear(showedYear + 1);
			}
		} else {
			setShowedMonth(showedMonth + 1);
		}
	};

	/**
	 * It decrements the month by one, unless the month is January
	 * in which case it decrements the year by one and sets the month to January
	 */
	const handlePreviousMonth = (event) => {
		if (event) {
			event.preventDefault();
		}
		if (showedMonth === 1) {
			if (showedYear > minYear) {
				setShowedMonth(12);
				setShowedYear(showedYear - 1);
			}
		} else {
			setShowedMonth(showedMonth - 1);
		}
	};

	/**
	 * When a day in calendar is clicked, the selected/showed date, day, month, and year states are set.
	 * Also the date picker is closed
	 */
	const handleDayClick = (event) => {
		event.preventDefault();
		const day = +event.target.dataset.date;
		const month = +event.target.dataset.month;
		const year = +event.target.dataset.year;
		if (day !== null && month !== null && year !== null) {
			let formattedDate = twoDigit(month) + separator + twoDigit(day) + separator + year;
			if (dateFormat === "DDMMYYYY") {
				formattedDate = twoDigit(day) + separator + twoDigit(month) + separator + year;
			}

			setSelectedDay(day);
			setSelectedMonth(month);
			setSelectedYear(year);

			setShowedMonth(month);
			setShowedYear(year);
			setSelectedDate(formattedDate);
			if (onChange) {
				onChange(formattedDate);
			}

			const input = document.getElementById(id + "-input");
			if (input) {
				input.focus();
			}
			setDatePickerIsOpen(false);
			if (onBlurFunction) {
				onBlurFunction(formattedDate, id);
			}
		}
	};

	/**
	 * It takes a month number and returns the month name
	 * @returns The name of the month.
	 */
	const getMonthName = (monthNumber) => {
		const date = new Date();
		date.setMonth(monthNumber - 1);

		return date.toLocaleString("en-US", { month: "long" });
	};

	return (
		<div ref={ref} className={datePickerInputWrapperClassName} onFocus={handleFocus}>
			<Input
				id={id}
				label={label}
				labelClassName={labelClassName + (datePickerIsOpen ? " active" : "") + (isDateValid(selectedDate) ? " valid" : "")}
				className={inputClassName + (isDateValid(selectedDate) ? " valid" : "")}
				error={error}
				readOnly={false}
				value={selectedDate}
				wrapperClassName={inputWrapperClassName}
				addErrorElement={!datePickerIsOpen}
				maxLength={maxLength}
				required={required}
				requiredFeedbackEnabled={requiredFeedbackEnabled}
				requiredFeedback={requiredFeedback}
				activeClassName={activeClassName}
				invalidClassName={invalidClassName}
				errorClassName={errorClassName}
				requiredFeedbackClassName={requiredFeedbackClassName}
				onChange={(event) => handleChangeInput(event, selectedDate.length)}
				onClick={setDatePickerIsOpen}
				onBlur={handleOnBlur}
				aria-label={
					"Enter " +
					label +
					" in the format " +
					(dateFormat === "MMDDYYYY" ? "MM" + separator + "DD" + separator + "YYYY" : "DD" + separator + "MM" + separator + "YYYY") +
					" or use the calendar to select a date"
				}
				aria-controls={id + "-date-picker"}
				role={"combobox"}
				aria-expanded={datePickerIsOpen ? true : false}
				{...props}
			/>

			<span className={formatDateClassName + (datePickerIsOpen || selectedDate.length > 1 ? " active" : "")}>
				{dateFormat === "MMDDYYYY" ? "MM" + separator + "DD" + separator + "YYYY" : "DD" + separator + "MM" + separator + "YYYY"}
			</span>

			{datePickerIsOpen && (
				<div id={id + "-date-picker"} className={datePickerWrapperClassName} aria-modal="true">
					<div className={datePickerClassName}>
						<div className={datePickerNavWrapperClassName}>
							<button
								className={datePickerPreviousButtonClassName}
								tabIndex="-1"
								onClick={handlePreviousMonth}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										handlePreviousMonth();
									}
								}}
								aria-label={"Previous Month (" + getMonthName(showedMonth - 1) + ")"}
							>
								{previousButtonText}
							</button>
							<button
								className={datePickerTodayButtonClassName}
								data-date={currentDay}
								data-month={currentMonth}
								data-year={currentYear}
								onClick={handleDayClick}
								aria-label={"Select Today's Date"}
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										handleDayClick(event);
									}
								}}
							>
								{todayButtonText}
							</button>
							<div className={datePickerMonthDropdownWrapperClassName}>
								<Dropdown
									id="month"
									label={monthDropdownLabel}
									aria-label={"month"}
									options={months}
									value={showedMonth}
									listLabel={monthListLabel}
									showListLabel={yearShowListLabel}
									onChange={setShowedMonth}
									labelClassName={monthDropdownLabelClassName}
									dropdownWrapperClassName={monthDropdownWrapperClassName}
									dropdownButtonClassName={monthDropdownButtonClassName}
									dropdownIconClassName={monthDropdownIconClassName}
									dropdownListWrapperClassName={monthDropdownListWrapperClassName}
									dropdownOptionClassName={monthDropdownOptionClassName}
									dropdownOptionSelectedClassName={monthDropdownOptionSelectedClassName}
									dropdownListClassName={monthDropdownListClassName}
									dropdownListLabelClassName={monthDropdownListLabelClassName}
									dropdownInputClassName={monthDropdownInputClassName}
								/>
							</div>
							<div className={datePickerYearDropdownWrapperClassName}>
								<Dropdown
									id="year"
									label={yearDropdownLabel}
									aria-label={"year"}
									options={years}
									value={showedYear}
									listLabel={yearListLabel}
									showListLabel={yearShowListLabel}
									onChange={setShowedYear}
									labelClassName={yearDropdownLabelClassName}
									dropdownWrapperClassName={yearDropdownWrapperClassName}
									dropdownButtonClassName={yearDropdownButtonClassName}
									dropdownIconClassName={yearDropdownIconClassName}
									dropdownListWrapperClassName={yearDropdownListWrapperClassName}
									dropdownOptionClassName={yearDropdownOptionClassName}
									dropdownOptionSelectedClassName={yearDropdownOptionSelectedClassName}
									dropdownListClassName={yearDropdownListClassName}
									dropdownListLabelClassName={yearDropdownListLabelClassName}
									dropdownInputClassName={yearDropdownInputClassName}
								/>
							</div>
							<button
								className={datePickerNextButtonClassName}
								onClick={handleNextMonth}
								tabIndex="-1"
								onKeyDown={(event) => {
									if (event.key === "Enter" || event.key === " ") {
										handleNextMonth();
									}
								}}
								aria-label={"Next Month (" + getMonthName(showedMonth + 1) + ")"}
							>
								{nextButtonText}
							</button>
						</div>

						<div className={calendarWrapperClassName}>
							<table id={id + "-calendar"} className={calendarTableClassName}>
								<thead className={calendarHeaderClassName}>
									<tr className={calendarHeaderTrClassName}>
										{daysOfWeek.map((day) => (
											<th key={day.full} className={calendarHeaderThClassName} scope="col" abbr={day.full}>
												<div className={headerClassName}>{day.abbr}</div>
											</th>
										))}
									</tr>
								</thead>
								<tbody className={calendarBodyClassName}>
									{calendarData.map((week, i) => (
										<tr key={i} className={calendarBodyTrClassName}>
											{Object.keys(week).map((day, j) => (
												<td key={j} className={calendarBodyTdClassName}>
													<button
														className={week[day].className}
														data-date={week[day].day}
														data-month={week[day].month}
														data-year={week[day].year}
														tabIndex={week[day].className.includes(calendarOtherMonthClassName) ? -1 : "0"}
														onKeyDown={(event) => {
															if (event.key === "Enter" || event.key === " ") {
																handleDayClick(event);
															}
														}}
														aria-label={daysOfWeek[j].full + " " + week[day].day + " " + getMonthName(week[day].month) + " " + week[day].year}
														aria-current={week[day].className.includes(calendarTodayClassName) ? "date" : null}
														onMouseDown={week[day].className.includes(calendarForbiddenClassName) ? null : handleDayClick}
													>
														{week[day].day}
													</button>
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

DatePicker.propTypes = {
	/** The id of the date picker */
	id: PropTypes.string.isRequired,

	/** The label of the date picker */
	label: PropTypes.string,

	/** The value of the date picker */
	value: PropTypes.node,

	/** The callback function that is called when the date picker is changed */
	onChange: PropTypes.func,

	/** The callback function that is called when the date picker input is focused */
	onFocus: PropTypes.func,

	/** The callback function that is called when the date picker input is blurred */
	onBlurFunction: PropTypes.func,

	/** The number of years to go back from the current year */
	yearsBackNumber: PropTypes.number,

	/** The number of years to go forward from the current year */
	yearsForwardNumber: PropTypes.number,

	/** The separator between the day, month and year */
	separator: PropTypes.string,

	/** The format of the date ("MMDDYYYY" or "DDMMYYYY") */
	dateFormat: PropTypes.string,

	/** The date to be shown in the date picker ("Monday" or "Sunday") */
	firstDayOfTheWeek: PropTypes.string,

	/** The text of the previous button */
	previousButtonText: PropTypes.string,

	/** The text of the next button */
	nextButtonText: PropTypes.string,

	/** The text of the today button */
	todayButtonText: PropTypes.string,

	/** The class name of the label */
	labelClassName: PropTypes.string,

	/** The class name of formatDate helper */
	formatDateClassName: PropTypes.string,

	/** The class name of the date */
	dateClassName: PropTypes.string,

	/** The class name of the header table */
	headerClassName: PropTypes.string,

	/** The class name of the date picker input wrapper */
	datePickerInputWrapperClassName: PropTypes.string,

	/** The class name of the date picker wrapper */
	datePickerWrapperClassName: PropTypes.string,

	/** The class name of the date picker */
	datePickerClassName: PropTypes.string,

	/** The class name of the nav wrapper */
	datePickerNavWrapperClassName: PropTypes.string,

	/** The class name of the previous button */
	datePickerPreviousButtonClassName: PropTypes.string,

	/** The class name of the today button */
	datePickerTodayButtonClassName: PropTypes.string,

	/** The class name of the next button */
	datePickerNextButtonClassName: PropTypes.string,

	/** The class name of the month dropdown wrapper */
	datePickerMonthDropdownWrapperClassName: PropTypes.string,

	/** The class name of the year dropdown wrapper */
	datePickerYearDropdownWrapperClassName: PropTypes.string,

	/** The class name of the calendar wrapper */
	calendarWrapperClassName: PropTypes.string,

	/** The class name of the calendar table */
	calendarTableClassName: PropTypes.string,

	/** The class name of the calendar header */
	calendarHeaderClassName: PropTypes.string,

	/** The class name of the calendar header tr */
	calendarHeaderTrClassName: PropTypes.string,

	/** The class name of the calendar header th */
	calendarHeaderThClassName: PropTypes.string,

	/** The class name of the calendar body */
	calendarBodyClassName: PropTypes.string,

	/** The class name of the calendar body tr */
	calendarBodyTrClassName: PropTypes.string,

	/** The class name of the calendar body td */
	calendarBodyTdClassName: PropTypes.string,

	/** The class name of the forbidden days */
	calendarForbiddenClassName: PropTypes.string,

	/** The class name of the other month days */
	calendarOtherMonthClassName: PropTypes.string,

	/** The class name of the today days */
	calendarTodayClassName: PropTypes.string,

	/** The class name of the selected days */
	calendarSelectedClassName: PropTypes.string,

	/** the label of the month dropdown */
	monthDropdownLabel: PropTypes.string,

	/** The label of the month list */
	monthListLabel: PropTypes.string,

	/** The label of the short month list */
	monthShowListLabel: PropTypes.bool,

	/** The class name of the month dropdown label */
	monthDropdownLabelClassName: PropTypes.string,

	/** The class name of the month dropdown wrapper */
	monthDropdownWrapperClassName: PropTypes.string,

	/** The class name of the month dropdown button */
	monthDropdownButtonClassName: PropTypes.string,

	/** The class name of the month dropdown icon */
	monthDropdownIconClassName: PropTypes.string,

	/** The class name of the month dropdown list wrapper */
	monthDropdownListWrapperClassName: PropTypes.string,

	/** The class name of the month dropdown option */
	monthDropdownOptionClassName: PropTypes.string,

	/** The class name of the month dropdown option selected */
	monthDropdownOptionSelectedClassName: PropTypes.string,

	/** The class name of the month dropdown list */
	monthDropdownListClassName: PropTypes.string,

	/** The class name of the month dropdown list li */
	monthDropdownListLabelClassName: PropTypes.string,

	/** The class name of the month dropdown input */
	monthDropdownInputClassName: PropTypes.string,

	/** The label of the year dropdown */
	yearDropdownLabel: PropTypes.string,

	/** The label of the year list */
	yearListLabel: PropTypes.string,

	/** The label of the short year list */
	yearShowListLabel: PropTypes.bool,

	/** The class name of the year dropdown label */
	yearDropdownLabelClassName: PropTypes.string,

	/** The class name of the year dropdown wrapper */
	yearDropdownWrapperClassName: PropTypes.string,

	/** The class name of the year dropdown button */
	yearDropdownButtonClassName: PropTypes.string,

	/** The class name of the year dropdown icon */
	yearDropdownIconClassName: PropTypes.string,

	/** The class name of the year dropdown list wrapper */
	yearDropdownListWrapperClassName: PropTypes.string,

	/** The class name of the year dropdown option */
	yearDropdownOptionClassName: PropTypes.string,

	/** The class name of the year dropdown option selected */
	yearDropdownOptionSelectedClassName: PropTypes.string,

	/** The class name of the year dropdown list */
	yearDropdownListClassName: PropTypes.string,

	/** The class name of the year dropdown list li */
	yearDropdownListLabelClassName: PropTypes.string,

	/** The class name of the year dropdown input */
	yearDropdownInputClassName: PropTypes.string,

	/** The error message */
	error: PropTypes.string,

	/** The max length of the input */
	maxLength: PropTypes.number,

	/** Whether the input is required */
	required: PropTypes.bool,

	/** Whether the required feedback is enabled */
	requiredFeedbackEnabled: PropTypes.bool,

	/** The required feedback message */
	requiredFeedback: PropTypes.string,

	/** The class name of the dropdown input */
	inputClassName: PropTypes.string,

	/** The class name of the input wrapper */
	inputWrapperClassName: PropTypes.string,

	/** The class name of the active state */
	activeClassName: PropTypes.string,

	/** The class name of the invalid state */
	invalidClassName: PropTypes.string,

	/** The class name of the error state */
	errorClassName: PropTypes.string,

	/** The class name of the required feedback */
	requiredFeedbackClassName: PropTypes.string,
};

export default DatePicker;

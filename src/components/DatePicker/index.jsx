import { useState, useEffect } from "react";

import Dropdown from "../Dropdown";

import "./styles.scss";

function DatePicker({
	id,
	label,
	onChange,
	yearsBackNumber = 120,
	yearsForwardNumber = 50,
	separator = "/",
	dateFormat = "MMDDYYYY",
	firstDayOfTheWeek = "Sunday",
	labelClassName,
	placeholder,
	onFocus,
	onBlur,
	errorMessage,
}) {
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

	const [currentDate] = useState(new Date());
	const [currentDay] = useState(currentDate.getDate());
	const [currentMonth] = useState(currentDate.getMonth() + 1);
	const [currentYear] = useState(currentDate.getFullYear());

	const [showDatePicker, setShowDatePicker] = useState(false);

	const [selectedDate, setSelectedDate] = useState("");
	const [selectedDay, setSelectedDay] = useState("");
	const [selectedMonth, setSelectedMonth] = useState("");
	const [selectedYear, setSelectedYear] = useState("");

	const [showedMonth, setShowedMonth] = useState(currentMonth);
	const [showedYear, setShowedYear] = useState(currentYear);
	const [firstDayOfShowedMonth, setFirstDayOfShowedMonth] = useState(0);
	const [numberOfDaysInShowedMonth, setNumberOfDaysInShowedMonth] = useState(0);
	const [numberOfDaysInPreviousMonth, setNumberOfDaysInPreviousMonth] = useState(0);
	const [numberOfWeeksInShowedMonth, setNumberOfWeeksInShowedMonth] = useState(0);

	const [daysOfWeek, setDaysOfWeek] = useState(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
	const [calendarWeeksInShowedMonth, setCalendarWeeksInShowedMonth] = useState([]);
	const [years] = useState([...Array(yearsForwardNumber + yearsBackNumber + 1).keys()].map((i) => currentYear - yearsBackNumber + i));
	const [minYear] = useState(currentYear - yearsBackNumber);
	const [maxYear] = useState(currentYear + yearsForwardNumber);

	useEffect(() => {
		if (firstDayOfTheWeek === "Monday") {
			setDaysOfWeek(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
		}
	}, [firstDayOfTheWeek]);

	useEffect(() => {
		if (onChange) {
			onChange(selectedDate);
		}
	}, [selectedDate, onChange]);

	useEffect(() => {
		if (showDatePicker) {
			const firstDayOfShowedMonth = (month, year) => {
				if (firstDayOfTheWeek === "Monday") {
					return new Date(year, month - 1, 1).getDay() - 1;
				}
				return new Date(year, month - 1, 1).getDay();
			};
			setFirstDayOfShowedMonth(firstDayOfShowedMonth(showedMonth, showedYear));
		}
	}, [showDatePicker, showedYear, showedMonth, firstDayOfTheWeek]);

	useEffect(() => {
		if (showDatePicker) {
			const getDaysInMonth = (month, year) => {
				return new Date(year, month, 0).getDate();
			};
			setNumberOfDaysInShowedMonth(getDaysInMonth(showedMonth, showedYear));
			setNumberOfDaysInPreviousMonth(getDaysInMonth(showedMonth - 1, showedYear));
		}
	}, [showDatePicker, showedYear, showedMonth]);

	useEffect(() => {
		if (showDatePicker) {
			setNumberOfWeeksInShowedMonth(Math.ceil((numberOfDaysInShowedMonth + firstDayOfShowedMonth) / 7));
		}
	}, [showDatePicker, numberOfDaysInShowedMonth, firstDayOfShowedMonth]);

	useEffect(() => {
		if (showDatePicker) {
			let calendarWeeksInShowedMonth = [];
			for (let i = 0; i < numberOfWeeksInShowedMonth; i++) {
				let daysInCalendarWeeks = {};

				daysOfWeek.forEach((daysOfWeek, j) => {
					const dayValue = i * 7 + j + 1 - firstDayOfShowedMonth;

					const isFirstYearOfTheCalendar = showedYear - 1 < minYear;
					const isFirstMonthOfTheYear = showedMonth === 1;
					const isFirstMonthOfTheCalendar = isFirstYearOfTheCalendar && isFirstMonthOfTheYear;

					const isLastYearOfTheCalendar = showedYear + 1 > maxYear;
					const isLastMonthOfTheYear = showedMonth === 12;
					const isLastMonthOfTheCalendar = isLastYearOfTheCalendar && isLastMonthOfTheYear;

					let className = "date";
					let day = dayValue;
					let month = showedMonth;
					let year = showedYear;

					if (dayValue <= 0) {
						day = dayValue + numberOfDaysInPreviousMonth;
						month = showedMonth - 1;

						if (isFirstMonthOfTheCalendar) {
							className = "empty-date";
							day = null;
							month = null;
							year = null;
						} else if (!isFirstMonthOfTheCalendar) {
							className = className + " other-month";
						}

						if (isFirstMonthOfTheYear & !isFirstMonthOfTheCalendar) {
							month = 12;
							year = showedYear - 1;
						}
					} else if (dayValue > numberOfDaysInShowedMonth) {
						day = dayValue - numberOfDaysInShowedMonth;
						month = showedMonth + 1;

						if (isLastMonthOfTheCalendar) {
							className = "empty-date";
							day = null;
							month = null;
							year = null;
						} else if (!isLastMonthOfTheCalendar) {
							className = className + " other-month";
						}

						if (isLastMonthOfTheYear & !isLastMonthOfTheCalendar) {
							month = 1;
							year = showedYear + 1;
						}
					}

					if (day === currentDay && month === currentMonth && year === currentYear) {
						className += " calendar-today";
					}

					if (day === selectedDay && month === selectedMonth && year === selectedYear) {
						className += " current";
					}

					const days = {
						day: day,
						month: month,
						year: year,
						className: className,
						isFirstMonthOfTheCalendar: isFirstMonthOfTheCalendar,
						isLastMonthOfTheCalendar: isLastMonthOfTheCalendar,
					};

					daysInCalendarWeeks[daysOfWeek] = days;
				});

				calendarWeeksInShowedMonth.push(daysInCalendarWeeks);
			}

			setCalendarWeeksInShowedMonth(calendarWeeksInShowedMonth);
		}
	}, [
		showDatePicker,
		currentDay,
		currentMonth,
		currentYear,
		daysOfWeek,
		firstDayOfShowedMonth,
		maxYear,
		minYear,
		numberOfDaysInPreviousMonth,
		numberOfDaysInShowedMonth,
		numberOfWeeksInShowedMonth,
		selectedDay,
		selectedMonth,
		selectedYear,
		showedMonth,
		showedYear,
	]);

	useEffect(() => {
		if (showDatePicker) {
			const handleClickOutside = (e) => {
				if (e.target.id === id || e.target.closest("#" + id + "-date-picker") || e.target.closest("#month-content") || e.target.closest("#year-content")) {
					return;
				}
				setShowDatePicker(false);
			};
			document.addEventListener("click", handleClickOutside);
			return () => {
				document.removeEventListener("click", handleClickOutside);
				onBlur(selectedDate);
			};
		}
	}, [showDatePicker, id, selectedDate, onBlur]);

	const handleFocus = (e) => {
		setShowDatePicker(true);
		onFocus(e);
	};

	const twoDigit = (num) => {
		return ("0" + num).slice(-2);
	};

	const handleChangeSelectedDate = (e) => {
		const day = parseInt(e.target.dataset.date);
		const month = parseInt(e.target.dataset.month);
		const year = parseInt(e.target.dataset.year);

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
		setShowDatePicker(false);
	};

	const isDateValid = (date) => {
		let regexDate = new RegExp(`^(0[1-9]|1[0-2])${separator}(0[1-9]|[1-2][0-9]|3[0-1])${separator}(19|20)\\d{2}$`);
		if (dateFormat === "DDMMYYYY") {
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

	const handleChangeSelectedDateInput = (e) => {
		let date = e.target.value;

		if (isDateValid(date)) {
			let day, month, year;

			if (dateFormat === "MMDDYYYY") {
				[month, day, year] = date.split(separator);
			} else if (dateFormat === "DDMMYYYY") {
				[day, month, year] = date.split(separator);
			}

			setSelectedDay(parseInt(day));
			setSelectedMonth(parseInt(month));
			setSelectedYear(parseInt(year));
			setShowedMonth(parseInt(month));
			setShowedYear(parseInt(year));
		}

		setSelectedDate(date);
	};

	const handleOnBlur = (e) => {
		const date = e.target.value;
		if (!isDateValid(date) && date !== "") {
			if (dateFormat === "MMDDYYYY") {
				setSelectedDate(twoDigit(currentMonth) + separator + twoDigit(currentDay) + separator + currentYear);
			} else if (dateFormat === "DDMMYYYY") {
				setSelectedDate(twoDigit(currentDay) + separator + twoDigit(currentMonth) + separator + currentYear);
			}

			setSelectedDay(currentDay);
			setSelectedMonth(currentMonth);
			setSelectedYear(currentYear);
			setShowedMonth(currentMonth);
			setShowedYear(currentYear);
		}
	};

	const handleNextMonth = (e) => {
		if (e) {
			e.preventDefault();
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

	const handlePreviousMonth = (e) => {
		if (e) {
			e.preventDefault();
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

	const handleShowedMonthChange = (value) => {
		setShowedMonth(value);
	};

	const handleShowedYearChange = (value) => {
		setShowedYear(value);
	};

	const handleDayClick = (e) => {
		const day = e.target.attributes.getNamedItem("data-date");
		const month = e.target.attributes.getNamedItem("data-month");
		const year = e.target.attributes.getNamedItem("data-year");
		if (day !== null && month !== null && year !== null) {
			handleChangeSelectedDate(e);
		}
	};

	return (
		<div>
			<div className="form-group">
				<label htmlFor={id} className={labelClassName}>
					{label}
				</label>
				<input
					type="text"
					id={id}
					name={id}
					className="form-control form-input"
					value={selectedDate}
					placeholder={placeholder}
					onChange={handleChangeSelectedDateInput}
					onFocus={handleFocus}
					onBlur={handleOnBlur}
				/>
				<div className="error">{errorMessage}</div>
			</div>

			{showDatePicker && (
				<>
					<div className="date-picker-wrapper" id={id + "-date-picker"}>
						<div className="date-picker">
							<div className="month-picker-wrapper">
								<button className="prev" onClick={handlePreviousMonth}></button>
								<button
									className="today"
									data-date={currentDay}
									data-month={currentMonth}
									data-year={currentYear}
									onClick={(e) => {
										handleChangeSelectedDate(e);
									}}
								>
									Today
								</button>
								<div className="label month-picker">
									<Dropdown options={months} selectedOptionNumber={showedMonth - 1} onChange={handleShowedMonthChange} id="month" />
								</div>
								<div className="label year-picker">
									<Dropdown options={years} selectedOptionNumber={years.findIndex((item) => item === showedYear)} onChange={handleShowedYearChange} id="year" />
								</div>
								<button className="next" onClick={handleNextMonth}></button>
							</div>

							<div className="calendar">
								<table id="dt-able">
									<thead>
										<tr>
											{daysOfWeek.map((day) => (
												<th key={day}>{day}</th>
											))}
										</tr>
									</thead>
									<tbody>
										{calendarWeeksInShowedMonth.map((week, i) => (
											<tr key={i}>
												{Object.keys(week).map((day, j) => (
													<td key={j} className={week[day].className} data-date={week[day].day} data-month={week[day].month} data-year={week[day].year} onClick={handleDayClick}>
														{week[day].day}
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default DatePicker;

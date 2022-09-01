import { createAction, createReducer } from "@reduxjs/toolkit";

const initialState = {
	list: [],
};

export const addEmployeeAction = createAction("employee/add");

// Create employee reducer.
export default createReducer(initialState, (builder) =>
	builder.addCase(addEmployeeAction, (draft, action) => {
		draft.list = [...draft.list, action.payload];
		return;
	})
);

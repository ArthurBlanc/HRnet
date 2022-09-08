import React from "react";
import ReactDOM from "react-dom/client";

import Router from "./Router";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";

import "./main.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
// Rendering the Provider component with the store and the Router component. */
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Router />
			</PersistGate>
		</Provider>
	</React.StrictMode>
);

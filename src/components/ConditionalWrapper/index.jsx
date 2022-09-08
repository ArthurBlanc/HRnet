import PropTypes from "prop-types";

/**
 * If className is true, return the children in a div, otherwise return just the children.
 *
 * @category Components
 * @component
 * @returns {React.Component} - Just the children or a div containing the children.
 */
function ConditionalWrapper({ children, className }) {
	if (className) {
		return <div className={className}>{children}</div>;
	}
	return <>{children}</>;
}

ConditionalWrapper.propTypes = {
	/** The children to render */
	children: PropTypes.node.isRequired,

	/** The class name to add to the wrapper */
	className: PropTypes.string,
};

export default ConditionalWrapper;

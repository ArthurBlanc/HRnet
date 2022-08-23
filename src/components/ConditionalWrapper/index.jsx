import PropTypes from "prop-types";

/**
 * If className is true, return the children in a div, otherwise return just the children.
 * @returns {React.Component} - Just the children or a div containing the children.
 */
function ConditionalWrapper({ children, className }) {
	if (className) {
		return <div className={className}>{children}</div>;
	}
	return <>{children}</>;
}

ConditionalWrapper.propTypes = {
	// children node (require): The children to render.
	children: PropTypes.node.isRequired,

	//  className: The class name to add to the wrapper.
	className: PropTypes.string,
};

export default ConditionalWrapper;

import "./styles.scss";

function Button({ text, type, className = "button", onClick }) {
	return (
		<button className={className} type={type} onClick={onClick}>
			{text}
		</button>
	);
}

export default Button;

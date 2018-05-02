import React from 'react';
import Select from './Select.js';

const Calculator = ({currencies, cryptoCurrencies, callback, result}) => {
	return (
		<div className="container">
			<span>Calculator</span>

			<form className="calculator flex" onSubmit={(e) => {
				e.preventDefault();
				callback(e);
			}}>
				<input name="count" defaultValue="0" />
				<Select currency={cryptoCurrencies} />
				<Select currency={currencies} />
				<input type="submit" value="Convert" />
			</form>

			<span className="result">
				{ result }
			</span>

		</div>
	);
}

export default Calculator;
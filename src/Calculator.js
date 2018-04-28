import React from 'react';
import Select from './Select.js';

const Calculator = ({currencies, cryptoCurrencies, callback, result}) => {
	return (
		<div>
			<span>Calculator</span>

			<form onSubmit={(e) => {
				e.preventDefault();
				callback(e);
			}}>
				<input name="count" defaultValue="0" />
				<Select currency={cryptoCurrencies} />
				<Select currency={currencies} />
				<input type="submit" value="Submit" />
			</form>

			<span>
				{ result }
			</span>

		</div>
	);
}

export default Calculator;
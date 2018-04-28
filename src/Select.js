import React from 'react';

const Select = ({activeCurrency, currency, callback}) => {
		let name = (activeCurrency) ? activeCurrency.name : undefined;
		let handleChange = (callback)
			? (event) => callback(event.target.value)
			: null;

		return (
				<select value={name} onChange={handleChange}>
					{
						currency.map(({name}) => 
							<option key={name} value={name}>{name}</option>
						)
					}
				</select>
		);
}

export default Select;
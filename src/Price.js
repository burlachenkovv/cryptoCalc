import React from 'react';

const Price = ({crypto, activeCurrency}) => {
	return (
		<div className="content">
			<div className="header flex">
				<span>Cryptocurrency</span>
				<span>Price</span>
				<span>Abbreviation</span>
			</div>

			{
				crypto.map((item, i) => 

					<div key={i} className="entry flex">
						<span>{item.fullName}</span>
						<span>{`${item.price ? item.price[activeCurrency.name] : null} ${activeCurrency.symbol}`}</span>
						<span>{item.name}</span>
					</div>
				)
			}
		</div>
	);
}

export default Price;
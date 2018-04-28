import React, { Component } from 'react';

import Select from './Select.js';
import Price from './Price.js';
import Calculator from './Calculator.js';
import Graph from './Graph.js';

import './styles/App.css';

class App extends Component {
	state = {
		cryptoCurrencies: [{
			name: "BTC",
			fullName: "Bitcoin",
			price: null,
		}, {
			name: "LTC",
			fullName: "LiteCoin",
			price: null,
		}, {
			name: "XRP",
			fullName: "Ripple",
			price: null,
		}, {
			name: "BCH",
			fullName: "Bitcoin Cash",
			price: null,
		}, {
			name: "ETH",
			fullName: "Ethereum",
			price: null,
		}, {
			name: "ADA",
			fullName: "Cardano",
			price: null,
		}],

		currencies: [{
			name: "USD",
			symbol: "$",
			isActive: true
		}, {
			name: "UAH",
			symbol: "₴",
			isActive: false
		}, {
			name: "EUR",
			symbol: "€",
			isActive: false
		}],

		calcResult: null,
	}

	componentWillMount() {
		this.calculateExchange();
	}

	calculateExchange() {
		let cryptoCurrencies = [...this.state.cryptoCurrencies];
		let { name } = [...this.state.currencies].filter((item) => item.isActive)[0];

		let names = [...this.state.currencies].map((item) => item.name);

		async function getData() {
			const data = Promise.all(
				cryptoCurrencies.map(async (item) =>
					await (
						await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${item.name}&tsyms=${names}`)
					).json()
				)
			)
			return data;
		}

		getData()
		.then(data => {
			//console.log(data);
			this.setState((prev) => {
				let newPrices = prev.cryptoCurrencies.map((item, i) => {
					item.price = data[i];
					return item;
				})

				return ({
				 cryptoCurrencies: newPrices
				})
			})
		})
	}

	changeCurrency(name) {		
		this.setState((prev) => {
			let selecCurrency = prev.currencies.map((item) => {
				item.isActive = (item.name === name) ? true : false;

				return item;
			});

			return ({
				currencies: selecCurrency
			});
		}, this.calculateExchange.bind(this));
	}

	handlerCalculator(e) {
		let data = Array.from(e.target.children).map((item) => item.value);

		let res = [...this.state.cryptoCurrencies].filter((item) => item.name === data[1])[0];
		let price = res.price[data[2]];

		this.setState({
			calcResult: `${data[0]} ${data[1]} = ${(price * data[0]).toFixed(2)} ${data[2]}`
		});
	}

	render() {
		let activeCurrency = [...this.state.currencies].filter((item) => item.isActive)[0];

		return (
			<div className="flex">
				<div className="sidebar">
					<span>Select currency</span>
					<Select
						activeCurrency={activeCurrency}
						currency={this.state.currencies}
						callback={this.changeCurrency.bind(this)}
					/>

					<Calculator
						currencies={this.state.currencies}
						cryptoCurrencies={this.state.cryptoCurrencies}
						callback={this.handlerCalculator.bind(this)}
						result={this.state.calcResult}
					/>
				</div>

				<Price
					crypto={this.state.cryptoCurrencies}
					activeCurrency={activeCurrency}
				/>

				<Graph />
			</div>
		);
	}
}

export default App;

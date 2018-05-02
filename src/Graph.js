import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

import './styles/Graph.css';

class Graph extends Component {
	state = {
		label: "1 BTC to USD",
		labels: [],
		data: [],
		pointRadius: 2,
	}

	componentWillMount() {
		this.selectRange(0);
	}

	selectRange(days) {
		let fromDate = (new Date().setDate(new Date().getDate()-days) / 1000).toFixed(0);
		let options = {
						year: "numeric",
						month: "2-digit",
						day: "numeric"
				};
		let radius = (days === "365") ? 1 : 2;
		let url = (+days)
			? `https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=${days}&aggregate=1&fTs=${fromDate}`
			: `https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=24`;

		fetch(url)
		.then(response => response.json())
		.then(({Data}) => {
			this.setState(() => {
				let res = Data.reduce((current, item) => {
					current.labels.push(new Date(item.time * 1000).toLocaleString("en", options));
					current.data.push(item.close);

					return current;
				}, {
					labels: [],
					data: [],
				})

				return ({
					labels: res.labels,
					data: res.data,
					pointRadius: radius
				})
			})
		});
	}

	render() {
		let data = {
			labels: this.state.labels,
			datasets: [
				{
					label: this.state.label,
					fill: false,
					lineTension: 0.1,
					backgroundColor: 'rgba(75,192,192,0.4)',
					borderColor: 'rgba(75,192,192,1)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(75,192,192,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: this.state.pointRadius,
					pointHitRadius: 10,
					data: this.state.data
				}
			]
		};

		let options ={
				legend: {
						display: false,
				},
		};

		return (
			<div className="graph">
			<h2>Bitcoin Price Changes</h2>
				<select onChange={(e) => this.selectRange(e.target.value)}>
					<option value="0">Day</option>
					<option value="7">Week</option>
					<option value="30">Month</option>
					<option value="365">Year</option>
				</select>

				<Line data={data} options={options} />
			</div>	
		);
	}
};

export default Graph;
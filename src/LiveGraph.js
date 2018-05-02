import React, { Component } from 'react';
import {Line} from 'react-chartjs-2';

import './styles/Graph.css';

import Sockette from 'sockette';

class LiveGraph extends Component {
	state = {
		label: "1 BTC to USD",
		labels: new Array(20),
		data: [],
	}

	componentWillMount() {
		let timestamp = 1;

		if(!this.state.data.length) {
			this.setState({
				data: new Array(20).fill(this.props.price)
			});
		} 

		const ws = new Sockette('wss://api.gemini.com/v1/marketdata/btcusd', {
		  timeout: 5000,
		  maxAttempts: 10,
		  onmessage: e => {
				this.setState((prev) => {
					let result = JSON.parse(e.data);

					if(result.events[0].reason !== "initial") {
						if(result.timestamp >= timestamp + 1) {
							prev.data.shift();
							prev.data.push(+result.events[0].price);
							timestamp = result.timestamp;

							return({
								data: prev.data
							})
						}
					}
				});
		  },
		  onmaximum: e => console.log('Stop Attempting!', e),
		  onclose: e => {
		  	ws.close();
		  },
		  onerror: e => console.log('Error:', e)
		});
	}

	render() {
		let min = (Math.min.apply(null, this.state.data) / 1000).toFixed(1) * 1000 - 100;
		let max = (Math.max.apply(null, this.state.data) / 1000).toFixed(1) * 1000 + 100;

		let data = {
			labels: this.state.labels,
			datasets: [
				{
					label: this.state.label,
					fill: false,
					lineTension: 0.4,
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
					pointRadius: 2,
					pointHitRadius: 10,
					data: this.state.data,
				}
			]
		};

		let options ={
			responsive: true, 
			maintainAspectRatio: false,

				legend: {
						display: false,
				},
				scales: {
       	 yAxes: [{
       	 	type: 'linear',
       	 	position: 'left',
       	 	ticks: {
       	 		beginAtZero:false,
       	 		min: min,
       	 		max: max
       	 	}}]
     		},
     		animation: {
     			duration: 0,
     		}
		};

		return (
			<div className="livegraph">
			<h2>Current Bitcoin Dynamic</h2>
				<Line data={data} options={options} redraw={true} height={1} width={5} />
			</div>	
		);
	}
};

export default LiveGraph;
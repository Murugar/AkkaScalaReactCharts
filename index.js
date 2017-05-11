import 'polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { observeProps, createEventHandler } from 'rx-recompose'
import { Observable } from 'rx'
import Websocket from 'react-websocket'
import RTChart from 'react-rt-chart'
import _ from 'lodash'
import ReconnectingWebSocket from 'reconnecting-websocket'

const AppDisplay = (props) => {
  const rows = _.mapValues(props.data, (v, k) => {
    return <tr className="danger text-primary" key={v}><td>{k}</td><td>{v}</td></tr>
  })
  
  var data = {
    date: new Date(),
    random1: props.data.random1,
    random2: props.data.random2,
    counter: props.data.counter,
    type: 'bar'
  }
  
  var chart1 = {
	  color: {
	        pattern: ['#ff0000']
	    },
	    
        point: {
            show: false
        }
  }
  
  var chart2 = {
	 
	  color: {
	        pattern: ['#00ff00']
	    },
	    
        point: {
            show: false
        }
  }
  
  var chart3 = {
		 
	  color: {
	        pattern: ['#0000ff']
	    },
	    
        point: {
            show: false
        }
  }
  
  var bar1 = {
	  width:  {
          ratio: 0.5 // this makes bar width 50% of length between ticks
      }
	}
  
  
  const r = _.values(rows)
  return <div>
	    <br/>
	    <div className="container"><div className="panel panel-danger"> <div className="panel-heading">React Akka Charts</div>
        <div className="panel-body">
		<div className="panel panel-success"> <div className="panel-heading">Exported Variables</div>
	    <div className="panel-body">
		<table className="table table-bordered">
		<thead>
		<tr className="info text-danger"><td>Key</td><td>Value</td></tr>
		</thead>
		<tbody >
		{r}
		</tbody>
		</table>
		</div>
		</div>
		<div className="panel panel-primary"> <div className="panel-heading">Chart</div>
	    <div className="panel-body">
	    <div className="row">
	    <div className="col-md-offset-1 col-md-10">
		<RTChart fields={['random1']} data={data} chart={chart1} 
		/>
		</div>
		</div>
		<br/>
		<div className="row">
		<div className="col-md-offset-1 col-md-10">
		<RTChart fields={['random2']} data={data} chart={chart2} />
		</div>
		</div>
		<br/>
		<div className="row">
		<div className="col-md-offset-1 col-md-10">
		<RTChart fields={['counter']} data={data} chart={chart3}/>
		</div>
		</div>
		<br/>
		</div>
		</div>
	</div>
	</div>	
	</div>	
	</div>
}

const App = observeProps(props$ => {
  const dataEvent = createEventHandler()
  const connect = () => {
    const socket = new WebSocket("ws://localhost:3001/time")
    socket.onopen = e => console.log(e)
    socket.onclose = () => setTimeout(() => connect(), 5000)
    socket.onmessage = event => dataEvent(JSON.parse(event.data))
  }
  connect()
  const data$ = dataEvent.startWith({
    random1: 0,
    random2: 0
  })

  return Observable.combineLatest(props$, data$, (props, data) => _.extend({}, props, {
    data
  }))
})(AppDisplay)
ReactDOM.render(
  <App />
  ,
  document.getElementById('root'))



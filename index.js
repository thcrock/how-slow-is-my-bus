import React, { Component }  from 'react'
import { render } from 'react-dom'
import { Map, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import { map } from 'ramda'

function colorMap(traffic) {
  if(traffic >= 15) {
    return 'green'
  } else if(traffic >= 10) {
    return 'yellow' 
  } else {
    return 'red'
  }
}

class Segment extends Component {
  render() {
    return (
      <Polyline
        color={colorMap(parseInt(this.props.data._traffic))}
        positions={[
          [this.props.data._lif_lat, this.props.data.start_lon],
          [this.props.data._lit_lat, this.props.data._lit_lon]
        ]} />
    )
  }

}
class SlowBusMap extends Component {
  constructor() {
    super()
    this.state = {
      lat: 41.8781,
      lng: -87.6298,
      zoom: 13,
      segments: []
    }
  }

  componentDidMount() {
    fetch('https://data.cityofchicago.org/resource/8v9j-bter.json')
      .then((resp) => resp.json())
      .then((data) => this.setState({segments: data}))
  }

  renderSegment(segment) {
      return <Segment data={segment} />
  }
  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {map(this.renderSegment, this.state.segments)}
      </Map>
    );
  }
}

render(<SlowBusMap />, document.getElementById('container'))

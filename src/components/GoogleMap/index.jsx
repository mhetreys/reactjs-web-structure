import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      center: {
        lat: parseFloat(props.latitude),
        lng: parseFloat(props.longitude),
      },
      zoom: 16,
    };
  }

  render() {
    const { center, zoom } = this.state;

    console.log(center, zoom);

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '40vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyCy_uR_SVnzgxCQTw1TS6CYbBTQEbf6jOY' }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <AnyReactComponent lat={center.lat} lng={center.lng} text="H" />
        </GoogleMapReact>
      </div>
    );
  }
}

export default GoogleMap;

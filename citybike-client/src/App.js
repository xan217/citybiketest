/**
 * App.js
 * version: 1.0 by Renne Castellanos
 * 
 * Last version of the modified file to fetch the dara from the local server and
 *    display it in the map generated by Leaflet
 */

// Basic imports
import React, { Component,  Fragment } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

// Data type of the marker. 
//    Based in the Leaflet Documentation
type MarkerData = {| ...Props, key: string |}

// Marker structure, edited to accomplish the request of the technical test.
//    Based in the Leaflet Documentation
const MyPopupMarker = ({ content, position, name, empty_slots, free_bikes }: Props) => (
  <Marker position={position}>
    <Popup>
      {name}
      <br/>
      <span>Bikes: <code>{free_bikes}</code></span> 
      <br/>
      <span>Slots: <code>{empty_slots}</code></span> 
    </Popup>
  </Marker>
)

// List of the markers to be rendered in the map view.
//    Based in the Leaflet Documentation
var MyMarkersList = ({ markers }: { markers: Array<MarkerData> }) => {
  const items = markers.map(({ key, ...props }) => (
    <MyPopupMarker key={key} {...props} />
  ))
  return <Fragment>{items}</Fragment>
}

/**
 * App: Basic structure of the app that generates the final response to the client.
 *    This class contains the respective functions to handle the request to the local client
 *    and transform the data fetched into a usable data for the map of the application.
 */
class App extends Component {
  constructor() {
    super();

    // Definition of the state of the component. Added the marker array.
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.7723312,
      lng: -80.1813103,
      zoom: 7,
      markers: []
    };
  }

  // Auto triggered function. Adapted to make the request to the local server.
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);

    socket.on('FromAPI', this.handleResponse);
  }

  // Response handler of the request. 
  handleResponse = (data) => {

    // Auxiliar array to temporal storage of the markers
    let markersArray = [];

    // Transform the data fetched from the server into an usable array
    data.forEach(element => {
      markersArray.push({
        key: element.id,
        name: element.name,
        position: [element.latitude, element.longitude],
        content: element.extra.address,
        empty_slots: element.empty_slots,
        free_bikes: element.free_bikes
      });
    });

    // Storage the data in the local state
    this.setState({ markers: markersArray });
  }

  // Auto triggered function to render the data for the client.
  render() {

    // Default definitions
    const { response } = this.state; // NOT used
    const position = [this.state.lat, this.state.lng];

    // Response structure for the client
    return (
      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MyMarkersList markers={this.state.markers} />
        </Map>
        <span className="developerInfo">Developed by <b>Renne Castellanos</b> (xan217@hotmail.com)</span>
      </div>
    );
  }
}
export default App;
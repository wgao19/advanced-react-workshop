////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Refactor App by creating a new component named `<GeoPosition>`
// - <GeoPosition> should use a render prop callback that passes
//   the coords and error
// - When you're done, <App> should no longer have anything but
//   a render method
// - Now create a <GeoAddress> component that also uses a render
//   prop callback with the current address. You will use
//   `getAddressFromCoords(latitude, longitude)` to get the
//   address. It returns a promise.
// - You should be able to compose <GeoPosition> and <GeoAddress>
//   beneath it to naturally compose both the UI and the state
//   needed to render
// - Make sure <GeoAddress> supports the user moving positions
import "./index.css";
import React from "react";
import LoadingDots from "./LoadingDots";
import Map from "./Map";
import getAddressFromCoords from "./getAddressFromCoords";

class Geolocation extends React.Component {
  state = {
    coords: null,
    error: null
  };

  componentDidMount() {
    this.geoId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
      },
      error => {
        this.setState({ error });
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.geoId);
  }
  render() {
    return this.props.children(this.state);
  }
}

class GeoAddress extends React.Component {
  state = {
    address: null
  };

  componentDidMount() {
    const { lat, lng } = this.props;
    lat && lng && this.setAddress(lat, lng);
  }

  componentDidUpdate(prevProps) {
    const { lat: prevLat, lng: prevLng } = prevProps,
      { lat, lng } = this.props;
    (prevLat !== lat || prevLng !== lng) && this.setAddress(lat, lng);
  }

  setAddress = (lat, lng) => {
    getAddressFromCoords(lat, lng).then(address => {
      this.setState({ address });
    });
  };

  render() {
    return this.props.children(this.state);
  }
}

class App extends React.Component {
  render() {
    return (
      <Geolocation>
        {state => (
          <div className="app">
            {state.error ? (
              <div>Error: {state.error.message}</div>
            ) : state.coords ? (
              <GeoAddress lat={state.coords.lat} lng={state.coords.lng}>
                {({ address }) => (
                  <Map
                    lat={state.coords.lat}
                    lng={state.coords.lng}
                    info={address}
                  />
                )}
              </GeoAddress>
            ) : (
              <LoadingDots />
            )}
          </div>
        )}
      </Geolocation>
    );
  }
}

export default App;

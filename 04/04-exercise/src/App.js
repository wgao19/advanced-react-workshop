/*
Create a `withStorage` higher order component that manages saving and retrieving
the `sidebarIsOpen` state to local storage
*/

import "./index.css";
import React from "react";
import MenuIcon from "react-icons/lib/md/menu";
import { set, get, subscribe } from "./local-storage";

const withStorage = (name, defaultValue) => WrappedComponent =>
  class ComponentWithStorage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        [name]: get(name, defaultValue),
        setNewValue: newValue => set(name, newValue)
      };
    }

    componentDidMount() {
      this.unsubscribe = subscribe(() => {
        this.setState({
          sidebarIsOpen: get("sidebarIsOpen")
        });
      });
    }

    componentWillUnmount() {
      this.unsubscribe();
    }
    render() {
      return <WrappedComponent {...this.state} />;
    }
  };

class App extends React.Component {
  render() {
    const { sidebarIsOpen, setNewValue } = this.props;
    return (
      <div className="app">
        <header>
          <button
            className="sidebar-toggle"
            title="Toggle menu"
            onClick={() => {
              setNewValue(!sidebarIsOpen);
            }}
          >
            <MenuIcon />
          </button>
        </header>

        <div className="container">
          <aside className={sidebarIsOpen ? "open" : "closed"} />
          <main />
        </div>
      </div>
    );
  }
}

export default withStorage("sidebarIsOpen", true)(App);

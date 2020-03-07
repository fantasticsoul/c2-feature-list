import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {clearContextIfHot} from "concent";

clearContextIfHot();
console.log('render app')
const rootElement = document.getElementById("root");
// ReactDOM.render(<React.StrictMode><App /></React.StrictMode>, rootElement);
ReactDOM.render(<App />, rootElement);

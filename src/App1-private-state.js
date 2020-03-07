/**
 * Copy this file concent or other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show private state
 */
import React, { Component } from "react";
import { register, run, useConcent } from "concent";
import "./styles.css";

// just run concent
run();

// define a class component, belong to '$$default' module by default
@register()
class Counter extends Component {
  state = { count: 1 };
  add = () => this.setState({ count: this.state.count + 1 });
  render() {
    return (
      <div style={{ border: "1px solid silver", margin: "12px" }}>
        {this.state.count}
        <button onClick={this.add}>add</button>
      </div>
    );
  }
}

// define a function component, belong to '$$default' module by default
function FnCounter() {
  const ctx = useConcent({ state: { count: 100 } });
  const add = () => ctx.setState({ count: ctx.state.count + 1 });
  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      {ctx.state.count}
      <button onClick={add}>add</button>
    </div>
  );
}

const iState = () => {
  console.log("only call one time");
  return { count: 666 };
};
// define a function component, belong to '$$default' module by default
function FnCounter2() {
  const ctx = useConcent({ state: iState });
  const add = () => ctx.setState({ count: ctx.state.count + 1 });
  return (
    <div>
      {ctx.state.count}
      <button onClick={add}>add</button>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>class component and fn component hold their own private state</h3>
      <Counter />
      <FnCounter />
      <FnCounter2 />
      <FnCounter2 />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

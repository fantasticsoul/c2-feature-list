/**
 * Copy this file concent or other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how function component and class component share module state
 * and hold their own private state at the same time
 */
import React, { Component } from "react";
import { register, run, useConcent } from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter: {
    state: { count: 1 }
  }
});

// define a class component that belong to 'counter' module
@register("counter")
class Counter extends Component {
  state = { msg: "class priv state" };
  add = () => this.setState({ count: this.state.count + 1 });
  changePrivState = () => this.setState({ msg: "count changed " + Date.now() });
  render() {
    const state = this.state;
    return (
      <div style={{ border: "1px solid silver", margin: "12px" }}>
        module state:{state.count}
        <br />
        prive state:{state.msg}
        <br />
        <button onClick={this.add}>add</button>
        <button onClick={this.changePrivState}>change msg</button>
      </div>
    );
  }
}

const fnPrivState = () => ({ msg: "fn priv state" });

// define a function component that belong to 'counter' module
function FnCounter() {
  const ctx = useConcent({ module: "counter", state: fnPrivState });
  const add = () => ctx.setState({ count: ctx.state.count + 1 });
  const changePrivState = () =>
    ctx.setState({ msg: "count changed " + Date.now() });
  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      module state:{ctx.state.count}
      <br />
      prive state:{ctx.state.msg}
      <br />
      <button onClick={add}>add</button>
      <button onClick={changePrivState}>change msg</button>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>
        class component and fn component share the module state, and hold their
        own private state at the same time
      </h3>
      <Counter />
      <FnCounter />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

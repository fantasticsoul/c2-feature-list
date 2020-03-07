/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how change staete with invoke api
 */
import React, { Component } from "react";
import { register, run, useConcent } from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter: {
    state: { greeting: "hello concent", sex: "1" }
  }
});

const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

function changeGreeting(e) {
  const greeting = e.target.value;
  return { greeting };
}

function changeSex(e) {
  const sex = e.target.value;
  return { sex };
}

async function asyncChangeSex(e, moduleState, actionCtx) {
  const sex = e.target.value;
  await actionCtx.setState({ loading: true });
  await delay(6000);
  return { sex, loading: false };
}

// define a class component that belong to 'counter' module
@register("counter")
class Counter extends Component {
  state = { privCheckedVal: "", loading: false };
  changeGreeting = e => this.ctx.invoke(changeGreeting, e);
  changeSex = e => this.ctx.invoke(changeSex, e);
  asyncChangeSex = e => this.ctx.invoke(asyncChangeSex, e);
  render() {
    console.log("%cCounter", "color:green");
    const { state } = this.ctx; // or this.state
    if (state.loading) return <div style={{ color: "red" }}>loading</div>;

    return (
      <div style={{ border: "1px solid silver", margin: "12px" }}>
        shared greeting:
        <input value={state.greeting} onChange={this.changeGreeting} />
        <br />
        shared sex:
        <select value={state.sex} onChange={this.changeSex}>
          <option value="1">男</option>
          <option value="0">女</option>
        </select>
        <br />
        shared sex:
        <select value={state.sex} onChange={this.asyncChangeSex}>
          <option value="1">男</option>
          <option value="0">女</option>
        </select>
        <span style={{ color: "red" }}>async change</span>
        <br />
      </div>
    );
  }
}

// const iState = { privCheckedVal: "1" };
const iState = () => ({ privCheckedVal: "" });

// define a function component that belong to 'counter' module
function FnCounter() {
  console.log("%cFnCounter", "color:green");
  const ctx = useConcent({ module: "counter", state: iState });
  const { state, invoke } = ctx;
  // see App3-setup.js, the method below can be put into setup block
  // and get them from ctx.settings, so there will be no temporary closure fns anymore
  const _changeGreeting = e => invoke(changeGreeting, e);
  const _changeSex = e => invoke(changeSex, e);
  const _asyncChangeSex = e => invoke(asyncChangeSex, e);

  if (state.loading) return <div style={{ color: "red" }}>loading</div>;

  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      shared greeting:
      <input value={state.greeting} onChange={_changeGreeting} />
      <br />
      shared sex:
      <select value={state.sex} onChange={_changeSex}>
        <option value="1">男</option>
        <option value="0">女</option>
      </select>
      <br />
      shared sex:
      <select value={state.sex} onChange={_asyncChangeSex}>
        <option value="1">男</option>
        <option value="0">女</option>
      </select>
      <span style={{ color: "red" }}>async change</span>
      <br />
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>change state with invoke api to call user customize fn</h3>
      <Counter />
      <FnCounter />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

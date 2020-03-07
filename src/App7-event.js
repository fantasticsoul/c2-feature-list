/**
 * Copy this file concent or other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how concent surppot emit&on
 */
import React, { Component } from "react";
import cc, { register, run, useConcent } from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter: {
    state: { count: 1 }
  }
});

// about setup you can see App4-setup.js file
const setup = ctx => {
  ctx.on("ev", msg => {
    const pivMsg = `${ctx.props.tag} receive ${msg}`;
    ctx.setState({ pivMsg });
  });

  return {
    resetMsg: () => ctx.setState({ pivMsg: "" }),
    emitEv2: () => ctx.emit("ev2", "" + Date.now())
  };
};

// define a class component that belong to 'counter' module
@register({ module: "counter", setup })
class Counter extends Component {
  state = { pivMsg: "" };
  render() {
    const { state, settings } = this.ctx;
    return (
      <div style={{ border: "1px solid silver", margin: "12px" }}>
        {state.count}
        <br />
        msg: {state.pivMsg}
        <br />
        <button onClick={settings.resetMsg}>reset msg</button>
        <button onClick={settings.emitEv2}>emit ev2</button>
      </div>
    );
  }
}

function FnCounter(props) {
  const ctx = useConcent({
    module: "counter",
    setup,
    props,
    state: { pivMsg: "" }
  });
  const { state, settings } = ctx;
  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      {state.count}
      <br />
      msg: {state.pivMsg}
      <br />
      <button onClick={settings.resetMsg}>reset msg</button>
    </div>
  );
}

const setup2 = ctx => {
  ctx.on("ev2", msg => {
    const pivMsg = `${ctx.props.tag} receive ${msg}`;
    ctx.setState({ pivMsg });
  });
};
const iState = () => ({
  pivMsg: "I am on event ev2, try click bnt [emit ev2]"
});
function FnCounter2(props) {
  const ctx = useConcent({
    module: "counter",
    setup: setup2,
    props,
    state: iState
  });
  const { state, settings } = ctx;
  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      {state.count}
      <br />
      msg: {state.pivMsg}
      <br />
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>event emit & on</h3>
      <Counter tag="classCounter" />
      <FnCounter tag="fnCounter1" />
      <FnCounter2 tag="fnCounter2" />
      <hr />
      <button onClick={() => cc.emit("ev", Date.now())}>emit ev</button>
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

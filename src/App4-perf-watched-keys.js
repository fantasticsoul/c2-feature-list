/**
 * Copy this file concent or other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how concent drive component re-render by key level watch
 */
import React, { Component } from "react";
import cc, { register, run, useConcent, getState } from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter: {
    state: { count: 1, count2th: 10, count3th: 100 }
  },
  monitor: {
    state: { rlist: [], len: 0 }
  }
});

// see App4-setup.js file to know more about setup
const setup = ctx => {
  ctx.effect(() => {
    const { rlist, len } = getState("monitor");
    // const toPush = `${ctx.ccUniqueKey} rendered`;
    const toPush = `${ctx.props.tag} rendered`;
    if (rlist.length > 8) rlist.splice(0, 1);
    rlist.push(toPush);
    ctx.setModuleState("monitor", { rlist, len: len + 1 });
  });
};

// define a class component that belong to 'counter' module
// but its instance only care about 'count' key changing
@register({ module: "counter", watchedKeys: ["count"], setup })
class Counter extends Component {
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

// define a function component that belong to 'counter' module
// but its instance only care about 'count2th' key changing
function FnCounter(props) {
  const ctx = useConcent({
    module: "counter",
    watchedKeys: ["count2th"],
    setup,
    props
  });
  const add = () => ctx.setState({ count2th: ctx.state.count2th + 1 });
  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      {ctx.state.count2th}
      <button onClick={add}>add</button>
    </div>
  );
}

function FnCounter2(props) {
  //no watchedKeys pass, that means care about module all state key changing
  const ctx = useConcent({ module: "counter", setup, props });
  const {
    state: { count, count2th, count3th }
  } = ctx;
  return (
    <div>
      {count} | {count2th} | {count3th}
    </div>
  );
}

function Monitor() {
  const {
    state: { rlist, len }
  } = useConcent({ module: "monitor" });
  const startIdx = len - rlist.length;
  return (
    <>
      {rlist.map((label, idx) => {
        return (
          <div key={idx}>
            {startIdx + idx}:{label}
          </div>
        );
      })}
    </>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>exact update with watchedKeys strategy</h3>
      <Counter tag="classCounter" />
      <FnCounter tag="fnCounter1" />
      <FnCounter2 tag="fnCounter2" />
      <Monitor />
      <button onClick={() => cc.setState("monitor", { rlist: [] })}>
        clear
      </button>
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

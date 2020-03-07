/**
 * Copy this file concent or other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how concent drive component re-render by multi module's key level watch
 */
import React, { Component } from "react";
import cc, { register, run, useConcent, getState } from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter1: {
    state: { count: 1, count2th: 10, count3th: 100 }
  },
  counter2: {
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

// define a class component that connect to 'counter1' and 'counter2' module
// but its instance only care about counter1's ['count', 'count2th'] keys changing
// and care about counter2's all keys changing
@register({
  connect: { counter1: ["count", "count2th"], counter2: "*" },
  setup
})
class Counter extends Component {
  add = () => {
    const {
      counter2: { count2th, count3th }
    } = this.ctx.connectedState;
    this.ctx.setModuleState("counter2", {
      count2th: count2th + 1,
      count3th: count3th + 1
    });
  };
  render() {
    const { counter1, counter2 } = this.ctx.connectedState;
    return (
      <div style={{ border: "1px solid silver", margin: "12px" }}>
        counter1 state: {counter1.count} {counter1.count2th}
        {/** here you can not read counter3.count3th value*/}
        {/** because connect.counter1 no watch count3th value chagne*/}
        {/** it will always be old value*/}
        <br />
        counter2 state: {counter2.count} {counter2.count2th} {counter2.count3th}
        <br />
        <button onClick={this.add}>add counter2 state</button>
      </div>
    );
  }
}

// define a function component that connect to 'counter1' and 'counter2' module
// but its instance only care about counter1's all keys changing
// and care about counter2's ['count3th'] keys changing
function FnCounter(props) {
  const ctx = useConcent({
    connect: { counter1: "*", counter2: ["count3th"] },
    setup,
    props
  });
  const { counter1, counter2 } = ctx.connectedState;
  const add = () =>
    ctx.setModuleState("counter1", { count3th: counter1.count3th + 1 });
  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      counter1 state: {counter1.count} {counter1.count2th} {counter1.count3th}
      <br />
      counter2 state: {counter2.count3th}
      <br />
      <button onClick={add}>add counter1 state</button>
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
      <h3>exact update with multi module's watchedKeys strategy</h3>
      <Counter tag="classCounter1" />
      <Counter tag="classCounter2" />
      <FnCounter tag="fnCounter1" />
      <FnCounter tag="fnCounter2" />
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

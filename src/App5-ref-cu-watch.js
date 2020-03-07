/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how class component and function component
 * define ref computed&watch
 */
import React, { Component, createContext } from "react";
import { register, run, useConcent, cst } from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter: {
    state: { count: 12 },
    reducer: {
      inc(payload, moduleState, actionCtx) {
        const curCount = payload !== undefined ? payload : moduleState.count;
        return { count: curCount + 1 };
      }
    }
  }
});

const setup = ctx => {
  ctx.computed("count", (n, o, f) => {
    // every instance will trigger this fn,
    // so you should think about module computed first for better performance
    return ctx.type === cst.CC_CLASS ? n.count * 10 : n.count * 100;
  });

  ctx.watch(
    "countChange",
    (n, o, f) => {
      // commit can only change private state when called in ref watch
      if (ctx.type === cst.CC_HOOK)
        f.commit({ msg: "count changed " + Date.now() });
    },
    ["count"]
  );

  return {
    add: () => ctx.dispatch("inc")
  };
};

// define a class component that belong to 'counter' module
@register({ module: "counter", setup })
class Counter extends Component {
  render() {
    console.log("%c Counter", "color:green");
    const {
      settings: { add },
      refComputed
    } = this.ctx;
    return (
      <div>
        {this.state.count}
        <button onClick={add}>add</button>
        <br />
        10*count: {refComputed.count}
      </div>
    );
  }
}

const privState = () => ({ msg: "---" });

// define a function component that belong to 'counter' module
function FnCounter() {
  console.log("%c FnCounter", "color:green");
  const ctx = useConcent({ module: "counter", setup, state: privState });
  const {
    settings: { add },
    refComputed,
    state
  } = ctx;

  return (
    <div>
      {state.count}
      <button onClick={add}>add</button>
      <br />
      100*count: {refComputed.count}
      <br />
      msg: {state.msg}
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>ref computed&watch supported</h3>
      <Counter />
      <FnCounter />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

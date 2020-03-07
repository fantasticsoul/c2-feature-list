/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how class component and function component
 * cpature ref with extra
 */
import React, { Component } from "react";
import { register, run, useConcent } from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter: {
    state: { count: 12, msg: "--" },
    reducer: {
      inc(payload, moduleState, actionCtx) {
        const curCount = payload !== undefined ? payload : moduleState.count;
        return { count: curCount + 1 };
      }
    }
  }
});

const setup = ctx => {
  // ctx.staticExtra is {} by default
  ctx.staticExtra = { ref1: null, ref2: null }; //init staticExtra

  ctx.effect((_, isFirstCall) => {
    console.log("%cdidMount & didUpdate (every render period)", "color:blue");
    console.log(ctx.type, ctx.staticExtra, isFirstCall);
  });

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
      staticExtra
    } = this.ctx;
    return (
      <div ref={ref => (staticExtra.ref1 = { current: ref })}>
        {this.state.count}
        <button
          ref={ref => (staticExtra.ref2 = { current: ref })}
          onClick={add}
        >
          add
        </button>
      </div>
    );
  }
}

// define a function component that belong to 'counter' module
function FnCounter() {
  console.log("%c FnCounter", "color:green");
  const ctx = useConcent({ module: "counter", setup });
  const {
    settings: { add },
    staticExtra
  } = ctx;
  staticExtra.ref1 = React.useRef();
  staticExtra.ref2 = React.useRef();

  return (
    <div ref={staticExtra.ref1}>
      {ctx.state.count}
      <button ref={staticExtra.ref2} onClick={add}>
        add
      </button>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>
        {" "}
        capture ref with extra, but demo App6-domref-with-useRef is better
      </h3>
      <h3> pay attention to open the console to see log</h3>
      <Counter />
      <FnCounter />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

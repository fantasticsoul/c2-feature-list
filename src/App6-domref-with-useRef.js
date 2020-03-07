/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how class component and function component
 * cpature ref with buil-in api ctx.useRef
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
  ctx.effect((_, isFirstCall) => {
    console.log("%cdidMount & didUpdate (every render period)", "color:blue");
    console.log(ctx.type, ctx.refs, isFirstCall);
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
      useRef
    } = this.ctx;
    return (
      <div ref={useRef("ref1")}>
        {this.state.count}
        <button ref={useRef("ref2")} onClick={add}>
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
    useRef
  } = ctx;

  return (
    <div ref={useRef("ref1")}>
      {ctx.state.count}
      <button ref={useRef("ref2")} onClick={add}>
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
        capture ref with ctx.useRef in fn component and class component both
      </h3>
      <Counter />
      <FnCounter />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

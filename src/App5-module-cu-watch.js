/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how module computed & watch works
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
      },
      // this will trigger 2 times render when call dispatch by instance
      // and trigger 1 time render when call lazyDispatch by instance
      async incTwice(payload, moduleState, actionCtx) {
        const { count } = await actionCtx.dispatch("inc", moduleState.count);
        await actionCtx.dispatch("inc", count);
      }
    },
    computed: {
      count(n, o, f) {
        return n.count * 10;
      }
    },
    watch: {
      countChange: {
        fn: (n, o, f) => {
          f.commit({ msg: "count changed " + Date.now() });
        },
        depKeys: ["count"]
      }
    }
  }
});

// define a class component that belong to 'counter' module
@register("counter")
class Counter extends Component {
  add = () => this.ctx.dispatch("inc");
  add2 = () => this.ctx.dispatch("incTwice");
  render() {
    return (
      <div>
        {this.state.count}
        <button onClick={this.add}>add</button>
        <button onClick={this.add2}>add 2 times</button>
      </div>
    );
  }
}

// define a function component that belong to 'counter' module
function FnCounter() {
  const ctx = useConcent("counter");
  const add = () => ctx.dispatch("inc");
  const add2 = () => ctx.dispatch("incTwice");
  return (
    <div>
      {ctx.state.count}
      <button onClick={add}>add</button>
      <button onClick={add2}>add 2 times</button>
      <br />
      msg: {ctx.state.msg}
      <br />
      ten*count: {ctx.moduleComputed.count}
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>module computed&watch supported</h3>
      <Counter />
      <FnCounter />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

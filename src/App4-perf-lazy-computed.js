/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how different between computed and lazy compuated
 */
import React, { Component } from "react";
import { register, run, useConcent, defLazyComputed } from "concent";
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
    },
    computed: {
      // when count changed trigger will this fn execute
      count(n, o, f) {
        return n.count * 10;
      },
      // when count changed and read heavyCount will trigger this fn execute
      heavyCount:defLazyComputed((n)=>{
        return n.count * 1000000;
      }, ['count'])
    }
  }
});

// define a class component that belong to 'counter' module
@register("counter")
class Counter extends Component {
  add = () => this.ctx.dispatch("inc");
  render() {
    const { moduleComputed } = this.ctx;
    return (
      <div>
        count: {this.state.count}<br/>
        heavy count: {moduleComputed.heavyCount}<br/>
        ten*count: {moduleComputed.count}  <br />
        <button onClick={this.add}>add</button>
      </div>
    );
  }
}

// define a function component that belong to 'counter' module
function FnCounter() {
  const ctx = useConcent("counter");
  const add = () => ctx.dispatch("inc");
  const {state, moduleComputed} = ctx;
  return (
    <div>
      count: {state.count}<br/>
      heavy count: {moduleComputed.heavyCount}<br/>
      ten*count: {moduleComputed.count}  <br />
      <button onClick={add}>add</button><br/>
      msg: {ctx.state.msg}
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


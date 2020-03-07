/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how multi reduer fns works in one reducer fn
 */
import React, { Component } from "react";
import { register, run, useConcent } from "concent";
import "./styles.css";

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms));

// run concent with a module named counter
run({
  counter: {
    state: { count: 1, msg: "11", name: "", age: "", addr: "" },
    reducer: {
      inc(payload, moduleState, actionCtx) {
        const curCount = payload !== undefined ? payload : moduleState.count;
        return { count: curCount + 1 };
      },
      // this will trigger 3 times render when call dispatch by instance
      // and trigger 1 time render when call lazyDispatch by instance
      async incTwice(payload, moduleState, actionCtx) {
        const { count } = await actionCtx.dispatch("inc", moduleState.count);
        await actionCtx.dispatch("inc", count);
        return { msg: "done " + Date.now() };
      },
      updateAge(age) {
        // some process logic
        return { age };
      },
      async updateName(name) {
        await delay();
        // some process logic
        return { name };
      },
      async updateAddr(addr) {
        await delay();
        // some process logic
        return { addr };
      },
      //if called by lazyDispatch, it will only trigger one time re-render
      async updatForm(payload, moduleState, actionCtx) {
        const { age, name, addr } = payload;
        // return {age, name, addr}; // below code split logic into 3 reducer fns.
        await actionCtx.dispatch("updateAge", age);
        await actionCtx.dispatch("updateName", name);
        await actionCtx.dispatch("updateAddr", addr);
      }
    }
  }
});

// define a class component that belong to 'counter' module
@register("counter")
class Counter extends Component {
  add = () => this.ctx.dispatch("inc");
  //add = ()=>this.ctx.moduleReducer.inf() // or write like thiswrite like this

  add2 = () => this.ctx.dispatch("incTwice");
  //add2 = ()=>this.ctx.moduleReducer.incTwice() // or write like this

  add2OneRender = () => this.ctx.lazyDispatch("incTwice");
  // add2OneRender = ()=>this.ctx.moduleReducer.incTwice(null, {lazy:true}) // or write like this

  render() {
    console.log("%cCounter", "color:green");
    return (
      <div style={{ border: "1px solid silver", margin: "12px" }}>
        {this.state.count}
        <button onClick={this.add}>add</button>
        <button onClick={this.add2}>add trigger 3 render</button>
        <button onClick={this.add2OneRender}>add trigger 1 render</button>
        <br />
        msg:{this.state.msg}
        <br />
        renderCount:{this.ctx.renderCount}
      </div>
    );
  }
}

// define a function component that belong to 'counter' module
function FnCounter() {
  console.log("%cFnCounter", "color:green");
  // about wathedKeys see AP4-perf-watched-keys.js
  const ctx = useConcent({module:"counter", watchedKeys:['counter', 'msg']});
  const add = () => ctx.dispatch("inc");
  const add2 = () => ctx.dispatch("incTwice");
  const add2OneRender = () => ctx.lazyDispatch("incTwice");
  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      {ctx.state.count}
      <button onClick={add}>add</button>
      <button onClick={add2}>add trigger 3 render</button>
      <button onClick={add2OneRender}>add trigger 1 render</button>
      <br />
      msg:{ctx.state.msg}
      <br />
      renderCount:{ctx.renderCount}
    </div>
  );
}

const iState = () => ({ name: "", age: "", addr: "", loading:false });
// about more detail of setup see AP3-setup.js
const setup = ctx => {
  return {
    updatForm: () => {
      ctx.setState({loading:true}, ()=>{
        ctx.lazyDispatch("counter/updatForm", ctx.state).then(()=>{
          ctx.setState({loading:false});
        })
      })
    }
  };
};

function Form() {
  const ctx = useConcent({ connect: ["counter"], setup, state: iState });
  const {
    sync, state,
    connectedState: { counter: { name, age, addr }}, 
    settings, renderCount
  } = ctx;
  return (
    <div>
      {
        state.loading ? <span style={{color:'red'}}> waiting update ... <br/></span>:
        <>
          name :<input value={state.name} onChange={sync("name")} />
          <br />
          age :<input value={state.age} onChange={sync("age")} />
          <br />
          addr :<input value={state.addr} onChange={sync("addr")} />
          <br />
          <button onClick={settings.updatForm}>updatForm</button>
          <br />
        </>
      }
      renderCount: {renderCount}
      <div style={{color:'green'}}>
        name:{name} age:{age} addr:{addr}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>
        use dispatch, lazyDispatch to trigger reducer fn to change state (open
        the console to see render log)
      </h3>
      <Counter />
      <FnCounter />
      <Form />
      <Form />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

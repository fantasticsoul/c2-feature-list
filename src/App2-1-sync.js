/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how change staete with sync api
 */
import React, { Component } from "react";
import { register, run, useConcent } from "concent";
import "./styles.css";

// run concent with a module named counter
run(
  {
    counter: {
      state: { greeting: "hello concent", sex: "1" }
    },
    login: {
      state: {
        user: { name: "zzk", age: 19 },
        list: [{ id: "1", color: "red" }, { id: "2", color: "blue" }]
      }
    }
  },
  {
    middlewares: [
      (stateInfo, next) => {
        console.log("-->", stateInfo);
        next();
      }
    ]
  }
);

// define a class component that belong to 'counter' module
@register("counter")
class Counter extends Component {
  state = { privCheckedVal: "" };
  render() {
    console.log("%cCounter", "color:green");
    const { sync, state } = this.ctx;
    console.log(state.privCheckedVal === "1");
    return (
      <div style={{ border: "1px solid silver", margin: "12px" }}>
        shared greeting:
        <input value={state.greeting} onChange={sync("greeting")} />
        <br />
        shared sex:
        <select value={state.sex} onChange={sync("sex")}>
          <option value="1">男</option>
          <option value="0">女</option>
        </select>
        <br />
        private privCheckedVal:
        <input
          name="ck1"
          type="radio"
          value="1"
          checked={state.privCheckedVal === "1"}
          onChange={sync("privCheckedVal")}
        />
        good
        <input
          name="ck1"
          type="radio"
          value="0"
          checked={state.privCheckedVal === "0"}
          onChange={sync("privCheckedVal")}
        />
        bad
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
  const { sync, state } = ctx;
  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      shared greeting:
      <input value={state.greeting} onChange={sync("greeting")} />
      <br />
      shared sex:
      <select value={state.sex} onChange={sync("sex")}>
        <option value="1">男</option>
        <option value="0">女</option>
      </select>
      <br />
      private privCheckedVal:
      <input
        name="ck2"
        type="radio"
        value="1"
        checked={state.privCheckedVal === "1"}
        onChange={sync("privCheckedVal")}
      />
      good
      <input
        name="ck2"
        type="radio"
        value="0"
        checked={state.privCheckedVal === "0"}
        onChange={sync("privCheckedVal")}
      />
      bad
    </div>
  );
}

const syncCb = (value, keyPath, syncCtx) => {
  console.log(syncCtx);
  // keyPath: user.name
  const user = syncCtx.moduleState.user;
  user.name = value;
  if (value === "666") {
    user.name = "great";
  }
  return { user };
};

const iState2 = () => ({ privColor: "---", privChecked: true });

// define a function component that belong to 'counter' module
// and connect to 'login' module
function FnCounterConnect() {
  console.log("%cFnCounter", "color:green");
  const ctx = useConcent({
    module: "counter",
    connect: ["login"],
    state: iState2
  });
  const { sync, syncInt, syncBool, state, connectedState } = ctx;
  const {
    login: { user, list }
  } = connectedState;

  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      shared greeting:
      <input value={state.greeting} onChange={sync("greeting")} />
      <br />
      privColor: {state.privColor}
      <button onClick={sync("privColor", "red")}>to red</button>
      <button onClick={sync("privColor", "blue")}>to blue</button>
      <br />
      privChecked: {state.privChecked + ""}
      <button onClick={syncBool("privChecked")}>toggle privChecked</button>
      <br />
      user.name:{" "}
      <input value={user.name} onChange={sync("login/user.name", syncCb)} />
      <span style={{ color: "grey" }}>try input 666</span>
      <br />
      user.age: <input
        value={user.age}
        onChange={syncInt("login/user.age")}
      />{" "}
      <br />
      list[0].color:{" "}
      <input value={list[0].color} onChange={sync("login/list.0.color")} />{" "}
      <br />
      list[1].color:{" "}
      <input value={list[1].color} onChange={sync("login/list.1.color")} />{" "}
      <br />
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>change state with sync api</h3>
      <Counter />
      <FnCounter />
      <FnCounterConnect />
      <FnCounterConnect />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

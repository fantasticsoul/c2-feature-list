/**
 * Copy this file concent or other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how function component and class component share module state
 * and 4 ways to create component
 */
import React, { Component } from "react";
import {
  register,
  run,
  useConcent,
  registerDumb,
  CcFragment,
  registerHookComp
} from "concent";
import "./styles.css";

// run concent with a module named counter
run({
  counter: {
    state: { count: 666 }
  }
});

const View = ({ tag, count, add }) => (
  <div style={{ border: "1px solid silver", margin: "12px" }}>
    <span style={{ color: "blue" }}>{tag}: </span>
    <br /> {count}
    <button onClick={add}>add</button>
  </div>
);

// define a class component that belong to 'counter' module
@register("counter")
class Counter extends Component {
  add = () => this.setState({ count: this.state.count + 1 });
  render() {
    return (
      <View
        tag="class comp with register"
        add={this.add}
        count={this.state.count}
      />
    );
  }
}

// define a function component that belong to 'counter' module
// note that do not click the FnCounter dom tag in ReactDevTool,
// it will cause a bug currently
function FnCounter() {
  const ctx = useConcent("counter");
  const add = () => ctx.setState({ count: ctx.state.count + 1 });
  return (
    <View tag="fn comp with useConcent" add={add} count={ctx.state.count} />
  );
}

// ====== About more detail of setup see AP3-setup.js.======
// Setup can be used in class and function both, let the 2 kinds of component enjoy the 100%
// same api call including life-cycle method!
// Here We declare add in setup return result, user can get it from ctx.settings,
// so there is no need to make add method in every render period
const setup = ctx => {
  console.log(
    ctx.ccUniqueKey +
      " setup method will been called before first render period"
  );
  return { add: () => ctx.setState({ count: ctx.state.count + 1 }) };
};

function SetupFnCounter() {
  const ctx = useConcent({ module: "counter", setup });
  return (
    <View
      tag="fn comp with useConcent&setup"
      add={ctx.settings.add}
      count={ctx.state.count}
    />
  );
}

@register({ module: "counter", setup })
class SetupClassCounter extends Component {
  render() {
    return (
      <View
        tag="class comp with register&setup"
        add={this.ctx.settings.add}
        count={this.ctx.state.count}
      />
    );
  }
}

// registerHookComp works based on useConcent
const SetupMemoedFnCounter = registerHookComp({
  module: "counter",
  setup,
  render: ctx => (
    <View
      tag="registerHookComp(based on uesConcent)"
      add={ctx.settings.add}
      count={ctx.state.count}
    />
  )
});

const RenderPropsCounter = registerDumb({ module: "counter", setup })(ctx => {
  return (
    <View
      tag="registerDumb(based on CcFragment)"
      add={ctx.settings.add}
      count={ctx.state.count}
    />
  );
});
/** RenderPropsCounter works based on CcFragment
   <CcFragment
    register={{module:'counter', setup}}
    render={ctx => (
      <View add={ctx.settings.add} count={ctx.state.count} />
    )}
  />
*/

export default function App() {
  return (
    <div className="App">
      <h3>
        class component and fn component share the module state, 4 ways to
        create component
      </h3>
      <h3 style={{ color: "red" }}>
        try click the ReactDevTools to see the dom hierarchy
      </h3>
      <Counter />
      <FnCounter />
      <CcFragment
        register={{ module: "counter", setup }}
        render={ctx => {
          return (
            <View
              tag="CcFragment"
              add={ctx.settings.add}
              count={ctx.state.count}
            />
          );
        }}
      />
      <SetupClassCounter />
      <SetupFnCounter />
      <RenderPropsCounter />
      <SetupMemoedFnCounter />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

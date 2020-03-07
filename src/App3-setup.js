/**
 * Copy this file concent other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how class component and function component
 * share life-cycle method and logic with setup
 */
import React, { useState, Component } from "react";
import { register, run, useConcent, emit } from "concent";
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
      async incTwice(payload, moduleState, actionCtx) {
        const { count } = await actionCtx.dispatch("inc", moduleState.count);
        await actionCtx.dispatch("inc", count);
      }
    },
    computed: {
      count(n, o, f) {
        // newState, oldState, fnCtx
        return n.count * 10;
      }
    },
    watch: {
      countChange: {
        fn: (n, o, f) => {
          // you can also move this code to computed.count funciont block
          // and delete this watch 'countChange'
          f.commit({ msg: "count changed " + Date.now() });
        },
        depKeys: ["count"]
      }
    }
  }
});

const setup = ctx => {
  console.log("setup will only been triggered before first render period!");

  ctx.on('ev', (msg)=>{
    alert(`component ins ${ctx.ccUniqueKey} receive ${msg}`);
  })

  // define a comptued fn for privKey1, it will been triggered when privKey1 value changed
  // user can get the result from ctx.refComputed.privKey1
  ctx.computed('privKey1', (newState, oldState)=>{
    return newState.privKey1 + '_' + Date.now();
  })

  //define a watch fn for privKey1, it will been triggered when privKey1 value changed
  ctx.watch('privKey1', (newState, oldState)=>{
    console.log('do some async task');
  })

  ctx.effect((_, isFirstCall) => {
    console.log("%cdidMount & didUpdate (every render period)", "color:blue");
    console.log(ctx.type, isFirstCall);
  });

  //mock didUpdate
  ctx.effect(
    (_, isFirstCall) => {
      console.log(
        "%cdidUpdate (every render period except for first)",
        "color:blue"
      );
      console.log(ctx.type, isFirstCall);
    },
    null,
    false
  );

  //mock didMount
  ctx.effect(() => {
    console.log("%cdidMount", "color:blue");
    console.log(ctx.type);
    // return () => alert("clear up");
  }, []);

  // effectProps is just as same as effect, and the difference is depKeys item means props's key
  ctx.effectProps(() => {
    console.log(
      ctx.type,
      `immediate=true, tag change from ${ctx.prevProps.tag} to ${ctx.props.tag}`
    );
  }, ["tag"]);
  ctx.effectProps(
    () => {
      console.log(
        ctx.type,
        `immediate=false, tag change from ${ctx.prevProps.tag} to ${
          ctx.props.tag
        }`
      );
    },
    ["tag"],
    false
  );
  // set third param immediate as false, in first render period, this effect fn will not been triggered

  return {
    add: () => ctx.dispatch("inc"),
    add2: () => ctx.dispatch("incTwice"),
    // see APP4-perf-lazy-dispatch.js about lazyDispatch
    add2Lazy: () => ctx.lazyDispatch("incTwice")
  };
};

const iState = ()=> ({privKey1:'key1', privKey2:'key2'});

// define a class component that belong to 'counter' module
@register({ module: "counter", setup, state:iState })
class Counter extends Component {
  render() {
    console.log("%c Counter", "color:green");
    const {
      settings: { add, add2, add2Lazy },
      renderCount, refComputed,
    } = this.ctx;
    const { privKey1, privKey2, count } = this.state;//or this.ctx.state
    return (
      <div style={{ border: "1px solid silver", margin: "12px" }}>
        count: {count} privKey1:{privKey1} privKey2:{privKey2}<br/>
        refComputed.privKey1: {refComputed.privKey1} <br/>
        <button onClick={()=>this.setState({privKey1:Date.now()})}>change privKey1</button>
        <button onClick={add}>add</button>
        <button onClick={add2}>add 2 times</button>
        <button onClick={add2Lazy}>add 2 times trigger one render</button>
        <br/>renderCount: {renderCount}
      </div>
    );
  }
}

// define a function component that belong to 'counter' module
function FnCounter(props) {
  console.log("%c FnCounter", "color:green");
  const ctx = useConcent({ module: "counter", setup, props, state:iState });
  const {
    settings: { add, add2, add2Lazy },
    state: { count, privKey1, privKey2 },
    renderCount, refComputed,
  } = ctx;

  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      count: {count} privKey1:{privKey1} privKey2:{privKey2}<br/>
      refComputed.privKey1: {refComputed.privKey1} <br/>
      <button onClick={()=>ctx.setState({privKey1:Date.now()})}>change privKey1</button>
      <button onClick={add}>add</button>
      <button onClick={add2}>add 2 times</button>
      <button onClick={add2Lazy}>add 2 times trigger one render</button>
      <br />
      msg: {ctx.state.msg}
      <br />
      ten*count: {ctx.moduleComputed.count}
      <br/>renderCount: {renderCount}
    </div>
  );
}

export default function App() {
  const [tag, setTag] = useState("---");
  return (
    <div className="App">
      <h2>with setup</h2>
      <h3>unify life-cycle method writing way</h3>
      <h3>share logic between fn and class elegantly</h3>
      <h3>no temporary closure method in render block any more</h3>
      <Counter tag={tag} />
      <FnCounter tag={tag} />
      <button
        style={{ color: "red", fontWeight: 800, padding: "6px" }}
        onClick={() => setTag(Date.now())}
      >
        change tag to see ctx.effectProps's effect
      </button>
      <button
        style={{ color: "red", fontWeight: 800, padding: "6px" }}
        onClick={() => emit('ev', Date.now())}
      >
        emit event 
      </button>
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

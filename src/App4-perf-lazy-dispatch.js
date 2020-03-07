/**
 * Copy this file concent or other APP*.js file content to App.js!
 * standard js project see: https://codesandbox.io/s/concent-guide-xvcej
 * standard ts project see: https://codesandbox.io/s/concent-guide-ts-zrxd5
 * ------------------------------------------------------------------------
 * this demo show how different between dispatch and lazyDispatch
 * as lazyDispatch can let concent merge multi reducer fns's committed state automatically,
 * you can seperate your reducer function in more dimensions
 * different reducer fn update different partical state
 */
import React from "react";
import { run, useConcent } from "concent";
import "./styles.css";

const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

const randomNum = (min = 10, max = 100) => {
  const diff = max - min;
  return Math.ceil(min + Math.random() * diff);
};

const counterModel = {
  state: {
    count: 10,
    count2th: 10,
    count3th: 30,
    tip: "Pay attention to observe tips tip when click btn"
  },
  reducer: {
    updateCount(count) {
      return { count };
    },
    async updateCount2(count2th) {
      await delay();
      return { count2th };
    },
    updateCount3(count3th) {
      return { count3th };
    },
    async update123Serial(paylaod, moduleState, actionCtx) {
      await actionCtx.dispatch("updateCount", randomNum());
      await actionCtx.dispatch("updateCount2", randomNum());
      await actionCtx.dispatch("updateCount3", randomNum());
      return { tip: "done in serial" };
    },
    async update123Parallel(paylaod, moduleState, actionCtx) {
      await Promise.all([
        actionCtx.dispatch("updateCount", randomNum(900, 1000)),
        actionCtx.dispatch("updateCount2", randomNum(900, 1000)),
        actionCtx.dispatch("updateCount3", randomNum(900, 1000))
      ]);
      return { tip: "done in parallel" };
    },
    async update123LazySerial(paylaod, moduleState, actionCtx) {
      await actionCtx.lazyDispatch("update123Serial");
      return { tip: "done in serial with lazy inside" };
    },
    async update123LazyParallel(paylaod, moduleState, actionCtx) {
      await actionCtx.lazyDispatch("update123Parallel");
      return { tip: "done in parallel with lazy inside" };
    }
  }
};

/**@typedef {import('concent').StateType<typeof counterModel.state>} CounterState*/
/**@typedef {import('concent').ReducerType<typeof counterModel.reducer>} CounterRd*/

// run concent with a module named counter
run({ counter: counterModel });

/**@typedef {import('concent').IRefCtx<{}, {}, CounterState, CounterRd>} CtxPre*/
// see App4-setup.js file to know more about setup
const setup = (/**@type {CtxPre}*/ ctx) => {
  console.log("setup will only been triggered before first render period!");
  ctx.staticExtra.renderCount = -1;

  return {
    /** trigger 4 times re-render, and the update fns ending sequence is ordered */
    // normalUpdate123Serial: () => ctx.dispatch("update123Serial"),
    normalUpdate123Serial: () => ctx.moduleReducer.update123Serial(), // equivalent writing

    /** trigger 4 times re-render, and the update fns ending sequence is not guaranteed */
    // normalUpdate123Parallel: () => ctx.dispatch("update123Parallel"),
    normalUpdate123Parallel: () => ctx.moduleReducer.update123Parallel(), // equivalent writing

    /** trigger 1 times re-render */
    // lazyUpdate123Serial: () => ctx.lazyDispatch("update123Serial"),
    lazyUpdate123Serial: () =>
      ctx.moduleReducer.update123Serial(null, { lazy: true }), // equivalent writing

    /** trigger 1 times re-render */
    // lazyUpdate123Parallel: () => ctx.lazyDispatch("update123Parallel"),
    lazyUpdate123Parallel: () =>
      ctx.moduleReducer.update123Parallel(null, { lazy: true }), // equivalent writing

    /** trigger 2 times re-render and call lazy in reducer inside block */
    lazyUpdate123InsideSerial: () => ctx.dispatch("update123LazySerial"),

    /** trigger 2 times re-render and call lazy in reducer inside block */
    lazyUpdate123InsideParallel: () => ctx.dispatch("update123LazyParallel"),

    clearRenderCount: () => {
      ctx.staticExtra.renderCount = -1;
      // only trigger self re-render
      // here if call ctx.forceUpdate will lead to other counter's ins re-render
      ctx.reactForceUpdate();
    }
  };
};

/**@typedef {import('concent').IRefCtx<{}, {}, CounterState, CounterRd, {}, ReturnType<typeof setup>>} Ctx*/
// define a function component that belong to 'counter' module
function FnCounter() {
  /**@type {Ctx} */
  const ctx = useConcent({ module: "counter", setup });
  const {
    state: { count, count2th, count3th, tip },
    settings: {
      normalUpdate123Serial,
      normalUpdate123Parallel,
      lazyUpdate123Serial,
      lazyUpdate123Parallel,
      lazyUpdate123InsideSerial,
      lazyUpdate123InsideParallel,
      clearRenderCount
    },
    staticExtra
  } = ctx;
  staticExtra.renderCount++;

  return (
    <div style={{ border: "1px solid silver", margin: "12px" }}>
      <div>render count: {staticExtra.renderCount}</div>
      count:{count} count2th:{count2th} count:{count3th}
      <br />
      tip:<span style={{ color: "red" }}>{tip}</span> <br />
      <button onClick={normalUpdate123Serial}>normalUpdate123Serial</button>
      <button onClick={normalUpdate123Parallel}>normalUpdate123Parallel</button>
      <br />
      <button onClick={lazyUpdate123Serial}>lazyUpdate123Serial</button>
      <button onClick={lazyUpdate123Parallel}>lazyUpdate123Parallel</button>
      <br />
      <button onClick={lazyUpdate123InsideSerial}>
        lazyUpdate123InsideSerial
      </button>
      <button onClick={lazyUpdate123InsideParallel}>
        lazyUpdate123InsideParallel
      </button>
      <br />
      <button onClick={clearRenderCount}>clear render count</button>
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <h3>
        lazyDispatch can let concent merge multi reducer fns's committed state
        automatically and reduce re-render count
      </h3>
      <FnCounter />
      <hr />
      <FnCounter />
      <div style={{ border: "1px solid silver", color: "green" }}>
        copy other file's content to App.js to see more funny features.
      </div>
    </div>
  );
}

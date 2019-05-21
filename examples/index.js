import React from "react";
import ReactDOM from "react-dom";

import { BehaviorSubject, fromEvent } from "rxjs";
import {
  map,
  takeUntil,
  concatAll,
  pairwise,
  switchMapTo,
  scan,
  distinctUntilChanged
} from "rxjs/operators";

import {
  useSink$,
  useSource$,
  useInput$,
  useSubject$,
  useNamed$,
  useNamedSink$,
  useNamedSource$,
  useNamedInput$,
  NamedObservableProvider
} from "..";

const App = () => {
  return (
    <div>
      <BasicDemo />
      <NamedDemo />
      <DragDemo />
      <RxduxDemo />
    </div>
  );
};

const BasicDemo = () => {
  const opacity$ = useSubject$(0.5);
  const input = useInput$(opacity$);
  return (
    <div>
      <input type="number" min={0} max={1} step={0.01} {...input} />
      <input type="range" min={0} max={1} step={0.01} {...input} />
      <OpacityThing
        opacity$={opacity$}
        onClick={() => opacity$.next(Math.random())}
      />
    </div>
  );
};
const OpacityThing = ({ opacity$, onClick }) => {
  const opacity = useSink$(opacity$);
  return (
    <span
      style={{ opacity: opacity, border: "1px solid black" }}
      onClick={onClick}
    >
      Hello World: {opacity}
    </span>
  );
};

const NamedDemo = () => {
  return (
    <div>
      <input defaultValue={useSink$(useNamed$("foo"))} />
      <input defaultValue={useNamedSink$("foo", map(v => v * 2))} />
      <input type="range" {...useNamedInput$("foo")} />
      <input
        type="range"
        onChange={useNamedSource$("foo", map(e => e.target.value))}
      />
    </div>
  );
};

// PSEUDO-REDUX IMPLEMENTATION

const RxduxProvider = ({ reducer, initialState, children }) => {
  const dispatch = new BehaviorSubject(initialState);
  const state = dispatch.pipe(scan(reducer));
  return (
    <NamedObservableProvider observables={{ dispatch, state }}>
      {children}
    </NamedObservableProvider>
  );
};
function useDispatch() {
  return useNamedSource$("dispatch");
}
function useSelector(selector, deps) {
  return useNamedSink$(
    "state",
    observable => observable.pipe(map(selector)).pipe(distinctUntilChanged()),
    deps
  );
}

// PSEUDO-REDUX EXMAPLE

const Counter = () => {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  return (
    <div>
      count={count}
      <button onClick={() => dispatch({ type: "inc" })}>+</button>
      <button onClick={() => dispatch({ type: "dec" })}>-</button>
    </div>
  );
};

const RxduxDemo = () => {
  return (
    <RxduxProvider reducer={reducer} initialState={{ count: 0 }}>
      <Counter />
    </RxduxProvider>
  );
};

function reducer(state, action) {
  switch (action.type) {
    case "inc":
      return { ...state, count: state.count + 1 };
    case "dec":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// DRAG DEMO

const mousemove$ = fromEvent(window, "mousemove");
const mouseup$ = fromEvent(window, "mouseup");

const DragDemo = () => {
  const mousedown$ = useSubject$();
  const drags$ = React.useMemo(() => {
    return drag(mousedown$, mousemove$, mouseup$);
  }, [mousedown$]);
  const { x, y } = useSink$(drags$) || { x: 0, y: 0 };
  return (
    <div style={CONTAINER_STYLE}>
      <div
        style={{ ...OBJECT_STYLE, left: x, top: y }}
        onMouseDown={e => mousedown$.next(e)}
      >
        Drag me
      </div>
    </div>
  );
};

const CONTAINER_STYLE = {
  position: "relative",
  width: 200,
  height: 200,
  backgroundColor: "red"
};
const OBJECT_STYLE = {
  position: "absolute",
  width: 150,
  backgroundColor: "blue",
  color: "white"
};

function drag(mousedown$, mousemove$, mouseup$) {
  return mousedown$.pipe(
    switchMapTo(
      mousemove$.pipe(
        pairwise(),
        map(([e1, e2]) => ({
          x: e1.clientX - e2.clientX,
          y: e1.clientY - e2.clientY
        })),
        takeUntil(mouseup$)
      )
    ),
    scan((p1, p2) => ({ x: p1.x - p2.x, y: p1.y - p2.y }))
  );
  // return mousedown$
  //   .pipe(map(e => mousemove$.pipe(takeUntil(mouseup$))))
  //   .pipe(concatAll())
  //   .pipe(map(e => ({ x: e.clientX, y: e.clientY })));
}

ReactDOM.render(
  <NamedObservableProvider initialValues={{ foo: 1 }}>
    <App />
  </NamedObservableProvider>,
  document.getElementById("root")
);

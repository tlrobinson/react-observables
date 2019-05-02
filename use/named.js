const React = require("react");
const Rx = require("rxjs");

const ObservablesContext = React.createContext(null);

const { useSource$, useSink$, useInput$ } = require(".");

function useNamed$(name) {
  const observables = React.useContext(ObservablesContext);
  if (!(name in observables)) {
    observables[name] = new Rx.Subject();
  }
  return observables[name];
}

function useNamedSource$(name, ...args) {
  return useSource$(useNamed$(name), ...args);
}
function useNamedSink$(name, ...args) {
  return useSink$(useNamed$(name), ...args);
}
function useNamedInput$(name, ...args) {
  return useInput$(useNamed$(name), ...args);
}

function NamedObservableProvider({ initialValues = {}, children }) {
  const initialState = React.useMemo(() => {
    const subjects = {};
    for (const [name, value] of Object.entries(initialValues)) {
      subjects[name] = new Rx.BehaviorSubject(value);
    }
    return subjects;
  }, []);
  const [value] = React.useState(initialState);
  return (
    <ObservablesContext.Provider value={value}>
      {children}
    </ObservablesContext.Provider>
  );
}

exports.useNamed$ = useNamed$;
exports.NamedObservableProvider = NamedObservableProvider;

exports.useNamedSource$ = useNamedSource$;
exports.useNamedSink$ = useNamedSink$;
exports.useNamedInput$ = useNamedInput$;

const React = require("react");
const Rx = require("rxjs");
const { map } = require("rxjs/operators");
const { isObservable, isObserver } = require("../util");

function useSink$(observable, transform) {
  const [value, setValue] = React.useState();
  React.useEffect(() => {
    if (isObservable(observable)) {
      let finalObservable = observable;
      if (transform) {
        finalObservable = observable.pipe(transform);
      }
      const subscription = finalObservable.subscribe(setValue);
      return () => subscription.unsubscribe();
    }
  }, [observable]);
  return value;
}

function useSource$(observer, transform) {
  return React.useMemo(() => {
    if (isObserver(observer)) {
      let finalObserver = observer;
      if (transform) {
        // NOTE: is there a better way to do this?
        const subject = new Rx.Subject();
        subject.pipe(transform).subscribe(observer);
        finalObserver = subject;
      }
      return value => finalObserver.next(value);
    }
  }, [observer]);
}

const DEFAULT_INPUT_SOURCE_TRANSFORM = map(e => e.target.value);
const DEFAULT_INPUT_SINK_TRANSFORM = null;

function useInput$(
  observableOrSubject,
  sourceTransform = DEFAULT_INPUT_SOURCE_TRANSFORM,
  sinkTransform = DEFAULT_INPUT_SINK_TRANSFORM
) {
  const value = useSink$(observableOrSubject, sinkTransform);
  const onChange = useSource$(observableOrSubject, sourceTransform);
  return onChange ? { value, onChange } : { value };
}

exports.useSink$ = useSink$;
exports.useSource$ = useSource$;
exports.useInput$ = useInput$;

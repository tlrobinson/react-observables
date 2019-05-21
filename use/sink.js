const React = require("react");
const { isObservable, isBehaviorSubject } = require("../util");

function useSink$(observable, transform = null, deps = []) {
  const finalObservable = React.useMemo(() => {
    if (isObservable(observable)) {
      return transform ? observable.pipe(transform) : observable;
    }
  }, [observable, ...deps]);
  const [value, setValue] = React.useState(
    isBehaviorSubject(finalObservable) ? finalObservable.getValue() : undefined
  );
  React.useEffect(() => {
    const subscription = finalObservable.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [finalObservable]);
  return value;
}

exports.useSink$ = useSink$;

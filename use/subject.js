const React = require("react");
const Rx = require("rxjs");

function useSubject$(initialValue) {
  return React.useMemo(() => {
    const subject =
      initialValue !== undefined
        ? new Rx.BehaviorSubject(initialValue)
        : new Rx.Subject();
    const pair = [subject.asObservable(), subject];
    subject[Symbol.iterator] = pair[Symbol.iterator].bind(pair);
    return subject;
  }, []);
}

exports.useSubject$ = useSubject$;

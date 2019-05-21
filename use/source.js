const React = require("react");
const Rx = require("rxjs");
const { isObserver } = require("../util");

function useSource$(observer, transform = null, deps = []) {
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
  }, [observer, ...deps]);
}

exports.useSource$ = useSource$;

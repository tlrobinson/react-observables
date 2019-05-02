const isObservable = o => o && typeof o.subscribe === "function";
const isObserver = o => o && typeof o.next === "function";
const isSubject = o => isObservable(o) && isObserver(o);

exports.isObservable = isObservable;
exports.isObserver = isObserver;
exports.isSubject = isSubject;

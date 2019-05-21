const isObservable = o => o && typeof o.subscribe === "function";
const isObserver = o => o && typeof o.next === "function";
const isSubject = o => isObservable(o) && isObserver(o);
const isBehaviorSubject = o => isSubject(o) && typeof o.getValue === "function";

exports.isObservable = isObservable;
exports.isObserver = isObserver;
exports.isSubject = isSubject;
exports.isBehaviorSubject = isBehaviorSubject;

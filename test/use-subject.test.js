const React = require("react");
const renderer = require("react-test-renderer");

const { useSubject$ } = require("../use/subject");
const { isObservable, isObserver, isSubject } = require("../util");

describe("useSubject$", () => {
  it("should return a subject", () => {
    function Component() {
      const subject = useSubject$();
      expect(isSubject(subject)).toBe(true);
      return null;
    }
    const component = renderer.create(React.createElement(Component));
  });
  it("should return an object that destructures to an observable and observer", () => {
    function Component() {
      const [observable, observer] = useSubject$();
      expect(isObservable(observable)).toBe(true);
      expect(isObserver(observable)).toBe(false);
      expect(isObserver(observer)).toBe(true);
      return null;
    }
    const component = renderer.create(React.createElement(Component));
  });
});

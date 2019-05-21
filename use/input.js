const { map } = require("rxjs/operators");

const { useSink$ } = require("./sink");
const { useSource$ } = require("./source");

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

exports.useInput$ = useInput$;

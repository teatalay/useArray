export default function useArray(defaultValue) {
    const [value, setValue] = useState(defaultValue || []);
    function push(value, index) {
      setValue((prevValue) => [
        ...prevValue.slice(0, index || prevValue.length),
        value,
        ...prevValue.slice((index || prevValue.length) + 1, prevValue.length),
      ]);
    }
    function remove({ indexes, values, predicate }) {
      let fn = predicate;
      if (!predicate) {
        if (indexes) fn = (el, index) => indexes.indexOf(index) === -1;
        else if (values) fn = (el) => values.indexOf(el) === -1;
      }
      setValue((prevValue) => prevValue.filter(fn));
    }
    function changeValue({ index = 0, value, valueFunction }) {
      setValue((prevValue) => [
        ...prevValue.slice(0, index),
        value !== undefined ? value : valueFunction?.(prevValue[index]),
        ...prevValue.slice(index + 1, prevValue.length),
      ]);
    }
    function moveValues({
      dragIndex = 0,
      hoverIndex = 0,
      draggerPredicate,
      hoverPredicate,
    }) {
      setValue((prevValue) => {
        dragIndex = draggerPredicate?.(prevValue) || dragIndex;
        hoverIndex = hoverPredicate?.(prevValue) || hoverIndex;
        let nextValue = [...prevValue];
        let tempItem = { ...nextValue[dragIndex] };
        nextValue[dragIndex] = { ...nextValue[hoverIndex] };
        nextValue[hoverIndex] = { ...tempItem };
        return nextValue;
      });
    }
    function sort(sortFunction) {
      setValue((prevValue) => prevValue.sort(sortFunction));
    }
    function reverse() {
      setValue((prevValue) => prevValue.reverse());
    }
    function set({ predicate, value = [] }) {
      setValue((prevValue) => predicate?.(prevValue) || value);
    }
    function clear() {
      setValue([]);
    }
    function concat({ values = [], toBegin }) {
      setValue((prevValue) =>
        toBegin ? [...values, ...prevValue] : [...prevValue, ...values]
      );
    }
    return [
      value,
      {
        changeValue,
        clear,
        concat,
        moveValues,
        push,
        remove,
        reverse,
        set,
        sort,
      },
    ];
  }
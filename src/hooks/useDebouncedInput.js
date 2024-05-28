import React from "react";
import { debounce } from "lodash";

export default function useDebouncedInput(timeout = 300) {
  const [inputValue, setInputValue] = React.useState("");
  const [debouncedValue, setDebouncedValue] = React.useState("");

  React.useEffect(() => {
    const debounced = debounce(
      (nextValue) => setDebouncedValue(nextValue),
      timeout
    );
    debounced(inputValue);
    return () => debounced.cancel();
  }, [inputValue, timeout]);

  return { inputValue, setInputValue, debouncedValue };
}

import { debounce } from 'lodash';
import { useState, useCallback, useEffect } from 'react'


const eventToValue = (ev: any) => ev.target.value;
export const useDebouncedChange = (handleChange: (path: string[], value: any) => void, defaultValue: any, data: any, path: string[], eventToValueFunction: (ev: any) => any = eventToValue, timeout = 300): [any, React.ChangeEventHandler, () => void] => {
  const [input, setInput] = useState(data ?? defaultValue);
  useEffect(() => {
    setInput(data ?? defaultValue);
  }, [data]);
  const debouncedUpdate = useCallback(debounce((newValue: string) => handleChange(path, newValue), timeout), [handleChange, path, timeout]);
  const onChange = useCallback((ev: any) => {
    const newValue = eventToValueFunction(ev);
    setInput(newValue ?? defaultValue);
    debouncedUpdate(newValue);
  }, [debouncedUpdate, eventToValueFunction]);
  const onClear = useCallback(() => { setInput(defaultValue); handleChange(path, undefined) }, [defaultValue, handleChange, path]);
  return [input, onChange, onClear];
};
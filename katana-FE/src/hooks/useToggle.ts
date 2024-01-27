import { useCallback, useEffect, useState } from 'react';

type VoidFunc = () => void;

export type UseModalType = [
  boolean,
  VoidFunc,
  { onVisible: VoidFunc; onHidden: VoidFunc; onSetToggle(value: boolean): void }
];

export default function useToggle(
  initialState = false,
  persistKey = ''
): UseModalType {
  // State
  const [visible, setVisible] = useState<boolean>(() => {
    if (persistKey && typeof window !== 'undefined') {
      const value = localStorage.getItem(persistKey);
      if (value) {
        return value === 'true';
      }
    }
    return initialState;
  });

  // Handlers
  const onVisible = useCallback(() => {
    setVisible(true);
    if (persistKey) {
      localStorage.setItem(persistKey, 'true');
    }
  }, [persistKey]);

  const onHidden = useCallback(() => {
    setVisible(false);
    if (persistKey) {
      localStorage.setItem(persistKey, 'false');
    }
  }, [persistKey]);

  const onToggle = useCallback(() => {
    setVisible((prev) => {
      const newState = !prev;
      if (persistKey) {
        localStorage.setItem(persistKey, `${newState}`);
      }
      return newState;
    });
  }, [persistKey]);

  const onSetToggle = useCallback((value: boolean) => {
    setVisible(value);
  }, []);

  useEffect(() => {
    if (initialState) {
      const persistedValue = localStorage.getItem(persistKey);
      if (persistedValue === 'true') {
        setVisible(true);
      }
      if (persistedValue === 'false') {
        setVisible(false);
      } else {
        setVisible(initialState);
      }
    }
  }, [initialState, persistKey]);

  return [visible, onToggle, { onVisible, onHidden, onSetToggle }];
}

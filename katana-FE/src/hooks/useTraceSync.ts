import { useCallback, useEffect, useState } from 'react';

type VoidFunc = () => void;

export type UseModalType = [
  boolean,
  (cb: () => Promise<any>) => Promise<any>,
  { onToggle: VoidFunc; onVisible: VoidFunc; onHidden: VoidFunc }
];

export default function useTraceSync(initialState = false): UseModalType {
  // State
  const [visible, setVisible] = useState<boolean>(initialState);

  // Handlers
  const onVisible = useCallback(() => {
    setVisible(true);
  }, []);

  const onHidden = useCallback(() => {
    setVisible(false);
  }, []);

  const onToggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  const onTracing = useCallback(async (callback: () => Promise<void>) => {
    setVisible(true);
    let response: any;
    try {
      response = await callback();
    } catch (e) {
      throw e;
    } finally {
      setVisible(false);
    }
    return response;
  }, []);

  useEffect(() => {
    if (initialState) setVisible(initialState);
  }, [initialState]);

  return [visible, onTracing, { onToggle, onVisible, onHidden }];
}

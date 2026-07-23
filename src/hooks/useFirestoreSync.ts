import { useState, useEffect, DependencyList, Dispatch, SetStateAction, useRef } from 'react';

export function useFirestoreSync<T>(
  syncFn: (onData: (data: T[]) => void) => () => void,
  initialData: T[],
  deps: DependencyList = [],
  enabled: boolean = true
): [T[], Dispatch<SetStateAction<T[]>>, boolean] {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const syncFnRef = useRef(syncFn);

  useEffect(() => {
    syncFnRef.current = syncFn;
  }, [syncFn]);

  useEffect(() => {
    if (!enabled) {
      setIsLoaded(false);
      return;
    }

    let isMounted = true;
    const unsubscribe = syncFnRef.current((newData) => {
      if (!isMounted) return;
      
      // Ensure state updates happen outside the render phase
      setTimeout(() => {
        if (!isMounted) return;
        if (newData && Array.isArray(newData)) {
          if (newData.length === 0 && initialData && initialData.length > 0) {
            setData(initialData);
          } else if (initialData && initialData.length > 0) {
            const existingIds = new Set(newData.map((d: any) => d.id));
            const missingMocks = initialData.filter((d: any) => !existingIds.has(d.id));
            if (missingMocks.length > 0) {
              setData([...newData, ...missingMocks]);
            } else {
              setTimeout(() => setData(newData), 0);
            }
          } else {
            setTimeout(() => setData(newData), 0);
          }
        } else if (newData && !Array.isArray(newData)) {
          const potentialArray = (newData as any).value || (newData as any).data;
          if (Array.isArray(potentialArray)) {
            setData(potentialArray);
          }
        }
        setTimeout(() => setIsLoaded(true), 0);
      }, 0);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [...deps, enabled]);

  return [data, setData, isLoaded];
}

export function useFirestoreSetting<T>(
  syncFn: (key: string, onData: (data: T | null) => void) => () => void,
  settingKey: string,
  initialData: T,
  deps: DependencyList = [],
  enabled: boolean = true
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [data, setData] = useState<T>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const syncFnRef = useRef(syncFn);

  useEffect(() => {
    syncFnRef.current = syncFn;
  }, [syncFn]);

  useEffect(() => {
    if (!enabled) {
      setIsLoaded(false);
      return;
    }

    let isMounted = true;
    const unsubscribe = syncFnRef.current(settingKey, (newData) => {
      if (!isMounted) return;
      if (newData !== null && newData !== undefined) {
        setTimeout(() => setData(newData), 0);
      }
      setTimeout(() => setIsLoaded(true), 0);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [...deps, enabled, settingKey]);

  return [data, setData, isLoaded];
}

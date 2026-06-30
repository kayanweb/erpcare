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
    const unsubscribe = syncFnRef.current((newData) => {
      console.log("DEBUG useFirestoreSync newData:", newData?.length, "initialData:", initialData?.length);
      // If newData is somehow strictly empty, we MUST fallback to initialData to avoid breaking the app.
      // Additionally, we merge missing initialData items by ID to guarantee mock fallbacks are always present.
      if (newData && Array.isArray(newData)) {
        if (newData.length === 0 && initialData && initialData.length > 0) {
          console.log("DEBUG useFirestoreSync: using initialData because newData is empty");
          setData(initialData);
        } else if (initialData && initialData.length > 0) {
          // Merge missing mock items to ensure essential records (like admin user) are never lost
          const existingIds = new Set(newData.map((d: any) => d.id));
          const missingMocks = initialData.filter((d: any) => !existingIds.has(d.id));
          if (missingMocks.length > 0) {
            setData([...newData, ...missingMocks]);
          } else {
            setData(newData);
          }
        } else {
          setData(newData);
        }
      } else {
        setData(newData);
      }
      setIsLoaded(true);
    });
    return () => unsubscribe();
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
    const unsubscribe = syncFnRef.current(settingKey, (newData) => {
      if (newData !== null && newData !== undefined) {
        setData(newData);
      }
      setIsLoaded(true);
    });
    return () => unsubscribe();
  }, [...deps, enabled]);

  return [data, setData, isLoaded];
}
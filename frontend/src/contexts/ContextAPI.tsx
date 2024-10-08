import { createContext, ReactNode, useContext } from "react";
import useMeasurements from "../hooks/useMeasurements";
import { IContextAPI } from "../interfaces/context";

const ContextAPI = createContext<IContextAPI | undefined>(undefined);

export function useApi(): IContextAPI {
  const context = useContext(ContextAPI);

  if (!context) {
    throw new Error("useApi must be used within a ContextAPIProvider");
  }

  return context;
}

interface ContextAPIProviderProps {
  children: ReactNode;
}

function ContextAPIProvider({ children }: ContextAPIProviderProps) {
  const {
    measurements,
    setMeasurements,
    loading,
    error,
    getMeasurements,
    postMeasurement,
    postResponse,
    setPostResponse,
    patchMeasurement,
    cancelRequest,
  } = useMeasurements();

  return (
    <ContextAPI.Provider
      value={{
        measurements,
        setMeasurements,
        loading,
        error,
        getMeasurements,
        postMeasurement,
        postResponse,
        setPostResponse,
        patchMeasurement,
        cancelRequest,
      }}
    >
      {children}
    </ContextAPI.Provider>
  );
}

export default ContextAPIProvider;

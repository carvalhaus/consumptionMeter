import { IMeasurementsParams, IMeasurementsResponse } from "./measurements";

export interface IContextAPI {
  measurements: IMeasurementsResponse | null;
  loading: boolean;
  error: string | null;
  getMeasurements: (params: IMeasurementsParams) => Promise<void>;
  setMeasurements: (measurements: IMeasurementsResponse | null) => void;
}

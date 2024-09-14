import {
  IMeasurementPostResponse,
  IMeasurementRequest,
  IMeasurementsParams,
  IMeasurementsResponse,
} from "./measurements";

export interface IContextAPI {
  measurements: IMeasurementsResponse | null;
  loading: boolean;
  error: string | null;
  getMeasurements: (params: IMeasurementsParams) => Promise<void>;
  setMeasurements: (measurements: IMeasurementsResponse | null) => void;
  postMeasurement: (measurement: IMeasurementRequest) => void;
  postResponse: IMeasurementPostResponse | null;
  setPostResponse: (data: IMeasurementPostResponse | null) => void;
}

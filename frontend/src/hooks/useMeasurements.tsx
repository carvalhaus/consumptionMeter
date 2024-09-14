import { useState } from "react";
import {
  IMeasurementsParams,
  IMeasurementsResponse,
} from "../interfaces/measurements";

function useMeasurements() {
  const [measurements, setMeasurements] =
    useState<IMeasurementsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getMeasurements = async ({
    customer_code,
    measure_type,
  }: IMeasurementsParams) => {
    try {
      setLoading(true);

      let url = `${import.meta.env.VITE_BASE_URL}/${customer_code}/list`;

      if (measure_type) {
        url += `?measure_type=${measure_type}`;
      }

      const response = await fetch(url);

      const data: IMeasurementsResponse = await response.json();

      if (data.error_description) {
        setError(data.error_description);
        setMeasurements(null);
      } else {
        setMeasurements(data);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setMeasurements(null);
    } finally {
      setLoading(false);
    }
  };

  return { measurements, setMeasurements, loading, error, getMeasurements };
}

export default useMeasurements;

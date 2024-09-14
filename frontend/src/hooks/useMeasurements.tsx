import { useState } from "react";
import {
  IMeasurementRequest,
  IMeasurementsParams,
  IMeasurementsResponse,
} from "../interfaces/measurements";

function useMeasurements() {
  const [measurements, setMeasurements] =
    useState<IMeasurementsResponse | null>(null);
  const [uploadMeasurement, setUploadMeasurement] =
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

  const postMeasurement = async (measurementRequest: IMeasurementRequest) => {
    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(measurementRequest),
      });

      const data = await response.json();

      if (data.error_description) {
        setError(data.error_description);
        setUploadMeasurement(null);
      } else {
        setUploadMeasurement(data);
        setError(null);
      }

      return console.log(data);
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

  return {
    measurements,
    setMeasurements,
    loading,
    error,
    getMeasurements,
    uploadMeasurement,
    setUploadMeasurement,
    postMeasurement,
  };
}

export default useMeasurements;

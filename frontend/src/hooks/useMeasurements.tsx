import { useState } from "react";
import {
  IMeasurementPostResponse,
  IMeasurementRequest,
  IMeasurementsParams,
  IMeasurementsResponse,
} from "../interfaces/measurements";

function useMeasurements() {
  const [measurements, setMeasurements] =
    useState<IMeasurementsResponse | null>(null);
  const [postResponse, setPostResponse] =
    useState<IMeasurementPostResponse | null>(null);
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
        setPostResponse(null);
      } else {
        setPostResponse(data);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setPostResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const patchMeasurement = async (
    measure_uuid: string,
    measure_value: number
  ) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/confirm`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          measure_uuid: measure_uuid,
          confirmed_value: measure_value,
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();

      if (data.error_description) {
        setError(data.error_description);
      } else {
        console.log(data);
        setError(null);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setPostResponse(null);
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
    postResponse,
    setPostResponse,
    postMeasurement,
    patchMeasurement,
  };
}

export default useMeasurements;

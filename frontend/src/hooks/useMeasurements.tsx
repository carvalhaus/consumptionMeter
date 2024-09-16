import { useRef, useState } from "react";
import {
  IMeasurementPostResponse,
  IMeasurementRequest,
  IMeasurementsParams,
  IMeasurementsResponse,
} from "../interfaces/measurements";
import axios, { CancelTokenSource } from "axios";

function useMeasurements() {
  const [measurements, setMeasurements] =
    useState<IMeasurementsResponse | null>(null);
  const [postResponse, setPostResponse] =
    useState<IMeasurementPostResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const getMeasurements = async ({
    customer_code,
    measure_type,
  }: IMeasurementsParams) => {
    try {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Requisição cancelada.");
      }

      cancelTokenRef.current = axios.CancelToken.source();

      setLoading(true);

      let url = `${import.meta.env.VITE_BASE_URL}/${customer_code}/list`;

      if (measure_type) {
        url += `?measure_type=${measure_type}`;
      }

      const { data } = await axios.get<IMeasurementsResponse>(url, {
        cancelToken: cancelTokenRef.current.token,
      });

      if (data.error_description) {
        setError(data.error_description);
        setMeasurements(null);
      } else {
        setMeasurements(data);
        setError(null);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled", err.message);
      } else if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error_description || err.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
      setPostResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const postMeasurement = async (measurementRequest: IMeasurementRequest) => {
    try {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Requisição cancelada pelo usuário.");
      }

      cancelTokenRef.current = axios.CancelToken.source();

      setLoading(true);

      const { data } = await axios.post<IMeasurementPostResponse>(
        `${import.meta.env.VITE_BASE_URL}/upload`,
        measurementRequest,
        { cancelToken: cancelTokenRef.current.token }
      );

      if (data.error_description) {
        setError(data.error_description);
        setPostResponse(null);
      } else {
        setPostResponse(data);
        setError(null);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled", err.message);
      } else if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error_description || err.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
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
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Requisição cancelada pelo usuário.");
      }

      cancelTokenRef.current = axios.CancelToken.source();

      const { data } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/confirm`,
        {
          measure_uuid: measure_uuid,
          confirmed_value: measure_value,
        },
        { cancelToken: cancelTokenRef.current.token }
      );

      if (data.error_description) {
        setError(data.error_description);
      } else {
        console.log(data);
        setError(null);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled", err.message);
      } else if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error_description || err.message;
        setError(message);
      } else {
        setError("An unexpected error occurred");
      }
      setPostResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = () => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel("Requisição cancelada pelo usuário.");
      cancelTokenRef.current = null;
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
    cancelRequest,
  };
}

export default useMeasurements;

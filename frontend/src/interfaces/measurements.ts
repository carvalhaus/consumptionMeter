export interface IMeasurement {
  measure_uuid: string;
  measure_datetime: string;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
  measure_value: number;
}

export interface IMeasurementsResponse {
  measures: IMeasurement[];
  error_description?: string;
}

export interface IMeasurementRequest {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: "WATER" | "GAS" | "";
}

export interface IMeasurementPostResponse {
  image_url: string;
  measure_value: number;
  measure_uuid: string;
  error_description?: string;
}

export interface IMeasurementsParams {
  customer_code: string;
  measure_type?: string;
}

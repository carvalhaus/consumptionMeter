/* eslint-disable react-hooks/exhaustive-deps */
import AddCustomerCode from "../components/AddCustomerCode";
import { useApi } from "../contexts/ContextAPI";
import { useEffect, useState } from "react";
import { IMeasurementsParams } from "../interfaces/measurements";

function MeasurementHistory() {
  const { getMeasurements, measurements, loading, error } = useApi();

  const [customerCode, setCustomerCode] = useState<string | null>(null);

  useEffect(() => {
    if (customerCode) {
      const params: IMeasurementsParams = { customer_code: customerCode };
      getMeasurements(params);
    }
  }, [customerCode]);

  console.log(measurements);

  return (
    <main>
      <h1>Histórico de medições</h1>

      <AddCustomerCode setCustomerCode={setCustomerCode} />

      {loading && <p>Loading...</p>}

      {error && <p>Error: {error}</p>}
    </main>
  );
}

export default MeasurementHistory;

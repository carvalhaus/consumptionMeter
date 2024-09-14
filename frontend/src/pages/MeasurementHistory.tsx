/* eslint-disable react-hooks/exhaustive-deps */
import AddCustomerCode from "../components/AddCustomerCode";
import { useApi } from "../contexts/ContextAPI";
import { useEffect, useState } from "react";
import { IMeasurementsParams } from "../interfaces/measurements";
import MeasurementTable from "../components/MeasurementTable";
import returnPage from "../assets/arrowback.svg";
import { Link } from "react-router-dom";

function MeasurementHistory() {
  const { getMeasurements, measurements, setMeasurements, loading, error } =
    useApi();

  const [customerCode, setCustomerCode] = useState<string | null>(null);

  useEffect(() => {
    if (customerCode) {
      const params: IMeasurementsParams = { customer_code: customerCode };
      getMeasurements(params);
    }
  }, [customerCode]);

  useEffect(() => {
    return () => {
      setMeasurements(null);
    };
  }, []);

  console.log(measurements);

  return (
    <main>
      <header>
        <Link to={"/"} className="icon">
          <img src={returnPage} alt="Ícone para retornar" />
        </Link>
        <h1>Histórico de medições</h1>
      </header>

      <AddCustomerCode setCustomerCode={setCustomerCode} />

      {loading && <h2>Loading...</h2>}

      {error && <h2>{error}</h2>}

      {measurements && <MeasurementTable measurements={measurements} />}
    </main>
  );
}

export default MeasurementHistory;

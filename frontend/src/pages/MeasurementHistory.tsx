/* eslint-disable react-hooks/exhaustive-deps */
import AddCustomerCode from "../components/AddCustomerCode";
import { useApi } from "../contexts/ContextAPI";
import { useEffect, useState } from "react";
import MeasurementTable from "../components/MeasurementTable";
import returnPage from "../assets/arrowback.svg";
import { Link } from "react-router-dom";
import FilterTypeMeasurement from "../components/FilterTypeMeasurement";
function MeasurementHistory() {
  const { getMeasurements, measurements, setMeasurements, loading, error } =
    useApi();

  const [customerCode, setCustomerCode] = useState<string | null>(null);
  const [measureType, setMeasureType] = useState<string | null>(null);

  useEffect(() => {
    if (customerCode) {
      const params = {
        customer_code: customerCode,
        measure_type: measureType || "",
      };
      getMeasurements(params);
    }
  }, [customerCode, measureType]);

  useEffect(() => {
    return () => {
      setMeasurements(null);
      setMeasureType(null);
    };
  }, []);

  return (
    <main>
      <header>
        <Link to={"/"} className="icon">
          <img src={returnPage} alt="Ícone para retornar" />
        </Link>
        <h1>Histórico de medições</h1>
      </header>

      <AddCustomerCode setCustomerCode={setCustomerCode} />

      <FilterTypeMeasurement setMeasureType={setMeasureType} />

      {loading && <h2>Loading...</h2>}

      {error && <h2>{error}</h2>}

      {measurements && !loading && !error && (
        <MeasurementTable measurements={measurements} />
      )}
    </main>
  );
}

export default MeasurementHistory;

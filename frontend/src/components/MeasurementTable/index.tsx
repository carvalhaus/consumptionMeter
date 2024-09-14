import { IMeasurementsResponse } from "../../interfaces/measurements";
import { formatDate } from "../../utils/formatDate";
import { translateMeasureType } from "../../utils/translateMeasureType";

import "./style.css";

interface MeasurementTableProps {
  measurements: IMeasurementsResponse | null;
}

function MeasurementTable({ measurements }: MeasurementTableProps) {
  return (
    <section>
      <table className="measurement-table">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Data da Medição</th>
            <th>Tipo</th>
            <th>Valor Registrado</th>
          </tr>
        </thead>
        <tbody>
          {measurements?.measures.map((measurement, index) => (
            <tr key={measurement.measure_uuid}>
              <td>{index + 1}</td>
              <td>{formatDate(measurement.measure_datetime)}</td>
              <td>{translateMeasureType(measurement.measure_type)}</td>
              <td>{measurement.measure_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default MeasurementTable;

import { IMeasurementsResponse } from "../../interfaces/measurements";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import "./style.css";

interface MeasurementTableProps {
  measurements: IMeasurementsResponse | null;
}

function MeasurementTable({ measurements }: MeasurementTableProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
  };

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
              <td>{measurement.measure_type}</td>
              <td>{measurement.measure_value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default MeasurementTable;

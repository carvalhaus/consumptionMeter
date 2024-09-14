import "./style.css";

interface FilterTypeMeasurementProps {
  setMeasureType: React.Dispatch<React.SetStateAction<string | null>>;
}

function FilterTypeMeasurement({ setMeasureType }: FilterTypeMeasurementProps) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMeasureType(e.target.value);
  };

  return (
    <label className="filter-type">
      Filtrar
      <select onChange={onChange}>
        <option value="">-</option>
        <option value="WATER">Água</option>
        <option value="GAS">Gás</option>
      </select>
    </label>
  );
}

export default FilterTypeMeasurement;

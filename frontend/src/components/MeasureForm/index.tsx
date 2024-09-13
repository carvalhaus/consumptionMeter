import { SubmitHandler, useForm } from "react-hook-form";
import "./style.css";
import Tooltip from "../Tooltip";
import CameraCapture from "../CameraCapture";

interface IMeasureForm {
  image_base64: string;
  customer_code: string;
  measure_datetime: Date;
  measure_type: string;
}

function MeasureForm() {
  const { register, handleSubmit, setValue } = useForm<IMeasureForm>();

  const onSubmit: SubmitHandler<IMeasureForm> = (data) => console.log(data);

  const handleImageCapture = (image: string) => {
    setValue("image_base64", image);
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-label">
          <p>Tipo de medição</p>
          <label className="input-label measure_type">
            <input
              type="radio"
              id="measure_type"
              value="WATER"
              {...register("measure_type")}
            />
            Água
          </label>
          <label className="input-label measure_type">
            <input
              type="radio"
              id="measure_type"
              value="GAS"
              {...register("measure_type")}
            />
            Gás
          </label>
        </div>

        <div className="input-label">
          <div>
            <label htmlFor="image_base64">Imagem</label>
            <Tooltip />
          </div>
          <CameraCapture onCapture={handleImageCapture} />
        </div>

        <label className="input-label">
          Código de cliente
          <input
            type="text"
            id="customer_code"
            placeholder="xyz"
            {...register("customer_code", { required: true })}
          />
        </label>

        <label className="input-label">
          Data da medição
          <input
            type="date"
            id="measure_datetime"
            defaultValue={new Date().toISOString().split("T")[0]}
            {...register("measure_datetime", { required: true })}
          />
        </label>

        <button type="submit">Medir</button>
      </form>
    </section>
  );
}

export default MeasureForm;

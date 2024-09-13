import { Controller, SubmitHandler, useForm } from "react-hook-form";
import "./style.css";
import Tooltip from "../Tooltip";
import CameraCapture from "../CameraCapture";

interface IMeasureForm {
  image_base64: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: string;
}

function MeasureForm() {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IMeasureForm>({
    defaultValues: {
      image_base64: "",
      customer_code: "",
      measure_datetime: new Date().toISOString().split("T")[0],
      measure_type: "",
    },
  });

  const onSubmit: SubmitHandler<IMeasureForm> = (data) => console.log(data);

  const handleImageCapture = (image: string) => {
    setValue("image_base64", image, { shouldValidate: true });
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
              {...register("measure_type", {
                required: "Tipo de medição é obrigatório",
              })}
            />
            Água
          </label>
          <label className="input-label measure_type">
            <input
              type="radio"
              id="measure_type"
              value="GAS"
              {...register("measure_type", {
                required: "Tipo de medição é obrigatório",
              })}
            />
            Gás
          </label>
          {errors.measure_type && (
            <p className="error-message">{errors.measure_type.message}</p>
          )}
        </div>

        <div className="input-label">
          <div>
            <label htmlFor="image_base64">Imagem</label>
            <Tooltip />
          </div>
          <Controller
            name="image_base64"
            control={control}
            rules={{ required: "A imagem é obrigatória" }}
            render={() => (
              <>
                <CameraCapture onCapture={handleImageCapture} />
                {errors.image_base64 && (
                  <p className="error-message">{errors.image_base64.message}</p>
                )}
              </>
            )}
          />
        </div>

        <label className="input-label">
          Código de cliente
          <input
            type="text"
            id="customer_code"
            placeholder="xyz"
            {...register("customer_code", {
              required: "Código de cliente é obrigatório",
            })}
          />
          {errors.customer_code && (
            <p className="error-message">{errors.customer_code.message}</p>
          )}
        </label>

        <label className="input-label">
          Data da medição
          <input
            type="date"
            id="measure_datetime"
            {...register("measure_datetime", {
              required: "Data da medição é obrigatória",
            })}
          />
          {errors.measure_datetime && (
            <p className="error-message">{errors.measure_datetime.message}</p>
          )}
        </label>

        <button type="submit">Medir</button>
      </form>
    </section>
  );
}

export default MeasureForm;

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import "./style.css";
import Tooltip from "../Tooltip";
import CameraCapture from "../CameraCapture";
import { useApi } from "../../contexts/ContextAPI";

import { useState } from "react";
import ConfirmForm from "../ConfirmForm";

interface IMeasureForm {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: "WATER" | "GAS" | "";
}

function MeasureForm() {
  const { postMeasurement } = useApi();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IMeasureForm>({
    defaultValues: {
      image: "",
      customer_code: "",
      measure_datetime: new Date().toISOString().split("T")[0],
      measure_type: "",
    },
  });

  const onSubmit: SubmitHandler<IMeasureForm> = async (data) => {
    const currentDate = new Date().toISOString();

    const measureDate = new Date(data.measure_datetime);
    const fullDate = new Date(
      `${measureDate.toISOString().split("T")[0]}T${currentDate.split("T")[1]}`
    ).toISOString();

    const cleanedBase64 = data.image.replace(/^data:image\/\w+;base64,/, "");

    const measurementRequest = {
      image: cleanedBase64,
      customer_code: data.customer_code,
      measure_datetime: fullDate,
      measure_type: data.measure_type,
    };

    console.log(measurementRequest);

    try {
      setIsModalOpen(true);
      await postMeasurement(measurementRequest);
      console.log("Measurement posted successfully");
    } catch (error) {
      console.error("Error posting measurement:", error);
    } finally {
      reset();
      setIsCameraOpen(false);
      setCapturedImage(null);
    }
  };

  const handleImageCapture = (image: string) => {
    setValue("image", image, { shouldValidate: true });
  };

  return (
    <>
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
              name="image"
              control={control}
              rules={{ required: "A imagem é obrigatória" }}
              render={() => (
                <>
                  <CameraCapture
                    onCapture={handleImageCapture}
                    isCameraOpen={isCameraOpen}
                    setIsCameraOpen={setIsCameraOpen}
                    capturedImage={capturedImage}
                    setCapturedImage={setCapturedImage}
                  />
                  {errors.image && (
                    <p className="error-message">{errors.image.message}</p>
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

      {isModalOpen && (
        <ConfirmForm setIsModalOpen={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export default MeasureForm;

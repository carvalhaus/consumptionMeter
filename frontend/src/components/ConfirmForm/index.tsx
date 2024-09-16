import "./style.css";
import spinning from "../../assets/spinning.svg";
import close from "../../assets/close.svg";
import { useApi } from "../../contexts/ContextAPI";
import { IMeasurementPostResponse } from "../../interfaces/measurements";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";

interface ConfirmFormProps {
  setIsModalOpen: () => void;
}

function ConfirmForm({ setIsModalOpen }: ConfirmFormProps) {
  const { loading, postResponse, patchMeasurement, cancelRequest } = useApi();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IMeasurementPostResponse>({
    defaultValues: {
      image_url: "",
      measure_uuid: "",
      measure_value: 0,
    },
  });

  useEffect(() => {
    if (postResponse) {
      setValue("image_url", postResponse.image_url || "");
      setValue("measure_uuid", postResponse.measure_uuid || "");
      setValue("measure_value", postResponse.measure_value || 0);
    }
  }, [postResponse, setValue]);

  const onSubmit: SubmitHandler<IMeasurementPostResponse> = async (data) => {
    try {
      const { measure_uuid, measure_value } = data;

      const parsedValue = parseInt(measure_value.toString());

      console.log(measure_uuid, typeof parsedValue);

      await patchMeasurement(measure_uuid, parsedValue);

      setIsModalOpen();
    } catch (error) {
      console.error("Erro na confirmação:", error);
    }
  };

  const handleCancel = () => {
    cancelRequest();
    setIsModalOpen();
  };

  return (
    <div className="modal-overlay">
      <div className="confirm-form">
        {loading ? (
          <>
            <img src={spinning} alt="Loading" className="spin-slow" />
            <p>Carregando...</p>
            <button onClick={handleCancel}>Cancelar</button>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <img
              src={close}
              alt="Fechar"
              className="close-form"
              onClick={handleCancel}
            />
            <h3>Confirme a leitura realizada</h3>
            <a href={postResponse?.image_url} target="_blank" className="link">
              Visualize a foto que você tirou
            </a>
            <label className="confirm-label">
              Valor medido
              <input
                type="number"
                id="measure_value"
                {...register("measure_value", {
                  required: "Valor medido é obrigatório",
                })}
              />
              {errors.measure_value && (
                <p className="error-message">{errors.measure_value.message}</p>
              )}
            </label>

            <button type="submit">Confirmar</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ConfirmForm;

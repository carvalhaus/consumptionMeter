import { SubmitHandler, useForm } from "react-hook-form";

interface IAddCustomerCode {
  customer_code: string;
}

interface IAddCustomerCodeProps {
  setCustomerCode: (customerCode: string) => void;
}

function AddCustomerCode({ setCustomerCode }: IAddCustomerCodeProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddCustomerCode>({
    defaultValues: {
      customer_code: "",
    },
  });

  const onSubmit: SubmitHandler<IAddCustomerCode> = (data) => {
    setCustomerCode(data.customer_code);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="input-label">
        Código de cliente
        <input
          type="text"
          id="customer_code"
          placeholder="Insira seu código de cliente"
          {...register("customer_code", {
            required: "Código de cliente é obrigatório",
          })}
        />
        {errors.customer_code && (
          <p className="error-message">{errors.customer_code.message}</p>
        )}
      </label>

      <button>Consultar</button>
    </form>
  );
}

export default AddCustomerCode;

import { Link } from "react-router-dom";
import MeasureForm from "../components/MeasureForm";

function Home() {
  return (
    <main>
      <h1>Medidor de consumo</h1>
      <h2>
        Tire uma foto do seu medidor de água ou gás e, com o auxílio da
        Inteligência Artificial, realizaremos a leitura automaticamente.
      </h2>

      <MeasureForm />

      <p>
        Visualize o seu{" "}
        <Link to={"history"} className="link">
          histórico
        </Link>{" "}
        de medições
      </p>
    </main>
  );
}

export default Home;

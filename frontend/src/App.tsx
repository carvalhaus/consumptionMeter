import MeasureForm from "./components/MeasureForm";

function App() {
  return (
    <main>
      <h1>Medidor de consumo</h1>
      <h2>
        Tire uma foto do seu medidor de água ou gás e, com o auxílio da
        Inteligência Artificial, realizaremos a leitura automaticamente.
      </h2>

      <MeasureForm />
    </main>
  );
}

export default App;

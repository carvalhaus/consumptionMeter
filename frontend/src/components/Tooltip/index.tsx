import info from "../../assets/info-square.svg";
import gasometro from "../../assets/medidor-gas.webp";
import hidrometro from "../../assets/hidrometro.webp";
import "./style.css";

function Tooltip() {
  return (
    <a href="#" className="tooltip">
      <img src={info} alt="Dica de exemplo de imagem" />
      <div className="tooltip-content">
        <p>Exemplos de medidores aceitos para a medição</p>
        <div className="tooltip-images">
          <div>
            <img src={gasometro} alt="Exemplo de Medidor de gás" />
            <p>Gás</p>
          </div>

          <div>
            <img src={hidrometro} alt="Exemplo de Medidor de água" />
            <p>Água</p>
          </div>
        </div>
        <div className="tooltip-arrow"></div>
      </div>
    </a>
  );
}

export default Tooltip;

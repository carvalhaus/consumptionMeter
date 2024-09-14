export function translateMeasureType(type: string) {
  switch (type) {
    case "WATER":
      return "Água";
    case "GAS":
      return "Gás";
    default:
      return type; // Retorna o tipo original se não houver mapeamento
  }
}

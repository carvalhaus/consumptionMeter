import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
}

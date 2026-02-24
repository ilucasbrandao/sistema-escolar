import dayjs from "dayjs";

// Exibe data no formato DD/MM/YYYY
export function formatarDataLegivel(dataISO) {
  return dayjs(dataISO).format("DD/MM/YYYY");
}

// Converte DD/MM/YYYY para ISO (para envio ao backend)
export function formatarParaISO(dataString) {
  return dayjs(dataString, "DD/MM/YYYY").toISOString();
}

// Converte ISO para input type="date" (YYYY-MM-DD)
export function formatarParaInputDate(dataISO) {
  return dayjs(dataISO).format("YYYY-MM-DD");
}

// Função utilitária para data segura
export function formatDateForInputSafe(dateISO) {
  if (!dateISO) return "";
  const [ano, mes, dia] = dateISO.split("T")[0].split("-");
  return `${ano}-${mes}-${dia}`;
}

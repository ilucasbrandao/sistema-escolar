/**
 * Formata um número para moeda brasileira (R$)
 * @param {number|string} valor
 * @returns {string}
 */
export function formatarParaBRL(valor) {
  if (valor === null || valor === undefined) return "-";

  let numero;

  if (typeof valor === "string") {
    // Se a string contém vírgula, substitui por ponto
    const limpo = valor.replace(",", ".").trim();
    numero = parseFloat(limpo);
  } else {
    numero = Number(valor);
  }

  if (isNaN(numero)) return "-";

  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

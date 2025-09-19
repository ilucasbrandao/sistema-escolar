/**
 * Formata um número para moeda brasileira (R$)
 * @param {number|string} valor
 * @returns {string}
 */
export function formatarParaBRL(valor) {
  if (!valor && valor !== 0) return "-";

  let numero;

  if (typeof valor === "string") {
    // Remove "R$", pontos de milhar e troca vírgula por ponto
    const limpo = valor
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();
    numero = parseFloat(limpo);
  } else {
    numero = Number(valor);
  }

  if (isNaN(numero)) return "-";

  return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Formata uma data no padrão DD/MM/YYYY
 * @param {string|Date} data
 * @returns {string}
 */
export function formatarParaData(data) {
  if (!data) return "-";
  const d = new Date(data);
  if (isNaN(d.getTime())) return "-";
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

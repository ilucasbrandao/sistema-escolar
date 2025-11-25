import React, { forwardRef } from "react"; // <--- 1. Importar forwardRef
import dayjs from "dayjs";

const formatarBRL = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
};

// <--- 2. Envolver o componente com forwardRef((props, ref) => { ... })
export const ReciboPagamento = forwardRef((props, ref) => {
    const { dados, escola } = props; // Desestruture aqui dentro

    if (!dados) return null;

    return (
        // <--- 3. O ref PRECISA estar na div principal
        <div ref={ref} className="p-10 font-sans text-slate-800 max-w-2xl mx-auto bg-white">

            {/* Estilos para garantir que apareça na impressão */}
            <style type="text/css" media="print">
                {`
          @page { size: auto; margin: 0mm; }
          body { -webkit-print-color-adjust: exact; }
          /* Força o background branco na impressão */
          .print-content { background-color: white !important; height: 100%; }
        `}
            </style>

            {/* --- CONTEÚDO DO RECIBO --- */}
            <div className="text-center border-b-2 border-slate-800 pb-6 mb-8 print-content">
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">Recibo de Pagamento</h1>
                <h2 className="text-xl font-semibold">{escola.nome}</h2>
                <div className="text-sm text-slate-500 mt-2 space-y-1">
                    <p>{escola.endereco}</p>
                    <p>CNPJ: {escola.cnpj} | Tel: {escola.telefone}</p>
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-xs font-bold uppercase text-slate-400">Aluno (Pagador)</p>
                        <p className="text-2xl font-medium text-slate-900">{dados.nome_aluno}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold uppercase text-slate-400">Data do Pagamento</p>
                        <p className="text-xl text-slate-900">
                            {dados.data_pagamento ? dayjs(dados.data_pagamento).format("DD/MM/YYYY") : dayjs().format("DD/MM/YYYY")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 mb-8">
                <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                    <span className="text-sm font-bold uppercase text-slate-500">Referente a</span>
                    <span className="text-lg font-medium">Mês {dados.mes_referencia}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase text-slate-500">Valor Total</span>
                    <span className="text-4xl font-bold text-slate-900">{formatarBRL(dados.valor)}</span>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-slate-300">
                <div className="flex justify-between items-center text-xs text-slate-400">
                    <div>
                        <p>Autenticação: {dados.id}-{Date.now().toString(36).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <p className="mb-8">_______________________________________</p>
                        <p>{escola.responsavel}</p>
                        <p>Responsável Financeiro</p>
                    </div>
                </div>
            </div>
        </div>
    );
});
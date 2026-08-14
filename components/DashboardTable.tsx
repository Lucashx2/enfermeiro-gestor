import { MoreVertical } from "lucide-react";

const profissionaisMock = [
  {
    id: "JM",
    nome: "Juliana Martins",
    coren: "123456",
    horas: "10 (120h)",
    bruto: "7.200,00",
    descontos: "850,00",
    acrescimos: "300,00",
    final: "6.650,00",
    cor: "bg-purple-500",
  },
  {
    id: "CE",
    nome: "Carlos Eduardo",
    coren: "234567",
    horas: "8 (96h)",
    bruto: "5.760,00",
    descontos: "620,00",
    acrescimos: "240,00",
    final: "5.380,00",
    cor: "bg-blue-500",
  },
  {
    id: "AP",
    nome: "Ana Paula Silva",
    coren: "345678",
    horas: "12 (144h)",
    bruto: "8.640,00",
    descontos: "1.050,00",
    acrescimos: "400,00",
    final: "7.990,00",
    cor: "bg-red-500",
  },
  {
    id: "BS",
    nome: "Bruno Santos",
    coren: "456789",
    horas: "6 (72h)",
    bruto: "4.320,00",
    descontos: "430,00",
    acrescimos: "200,00",
    final: "4.090,00",
    cor: "bg-teal-500",
  },
];

export default function DashboardTable() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Resumo por Profissional</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th className="p-4 font-medium">Profissional</th>
              <th className="p-4 font-medium">Horas/Plantões</th>
              <th className="p-4 font-medium">Valor Bruto</th>
              <th className="p-4 font-medium">Descontos</th>
              <th className="p-4 font-medium">Acréscimos</th>
              <th className="p-4 font-medium">Valor Final</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {profissionaisMock.map((prof, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-bold ${prof.cor}`}>
                    {prof.id}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{prof.nome}</p>
                    <p className="text-xs text-slate-500">COREN {prof.coren}</p>
                  </div>
                </td>
                <td className="p-4 text-slate-600">{prof.horas}</td>
                <td className="p-4 font-medium text-slate-800">R$ {prof.bruto}</td>
                <td className="p-4 font-medium text-red-500">R$ {prof.descontos}</td>
                <td className="p-4 font-medium text-emerald-500">R$ {prof.acrescimos}</td>
                <td className="p-4 font-bold text-blue-600">R$ {prof.final}</td>
                <td className="p-4 text-slate-400 cursor-pointer hover:text-slate-700">
                  <MoreVertical size={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-slate-200 flex justify-center">
        <button className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors text-sm">
          Ver todos os profissionais
        </button>
      </div>
    </div>
  );
}
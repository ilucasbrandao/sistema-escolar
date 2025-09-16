export function ResumoCard({ label, value, color = "slate" }) {
    const textColor = {
        slate: "text-slate-800",
        green: "text-green-600",
        red: "text-red-600",
    }[color];

    return (
        <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`text-lg font-bold ${textColor}`}>{value}</p>
        </div>
    );
}

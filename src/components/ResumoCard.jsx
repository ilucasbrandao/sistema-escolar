export function ResumoCard({ label, value, color = "slate" }) {
    const textColor = {
        slate: "text-slate-800",
        green: "text-green-600",
        red: "text-red-600",
    }[color];

    return (
        <div className="bg-white border border-slate-200 rounded-md shadow-sm p-4">
            <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                {label}
            </p>
            <p className={`mt-1 text-xl font-semibold ${textColor}`}>
                {value}
            </p>
        </div>
    );
}

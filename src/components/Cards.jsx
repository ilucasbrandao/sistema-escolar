export function Card({ title, value, color = "blue" }) {
    const colors = {
        blue: "bg-blue-50 text-blue-700",
        green: "bg-green-50 text-green-700",
        red: "bg-red-100 text-red-900",
    };

    return (
        <div className={`p-6 rounded-lg shadow-md ${colors[color]} text-center`}>
            <h3 className="text-sm font-semibold mb-2">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}

export function InfoCard({ title, value, icon, highlight = false, color = "blue" }) {
    const colors = {
        blue: "bg-blue-50 text-blue-700",
        green: "bg-green-50 text-green-700",
        red: "bg-red-100 text-red-900",
    };

    const highlightColor = {
        blue: "bg-blue-100",
        green: "bg-green-100",
        red: "bg-red-200",
    };

    return (
        <div className={`p-6 rounded-lg shadow-md border ${highlight ? highlightColor[color] : colors[color]}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
                <span className="text-xl">{icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    );
}

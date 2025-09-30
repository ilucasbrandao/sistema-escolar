export function ActionCard({ icon, label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
        >
            {icon}
            <span className="text-lg font-medium text-gray-700">{label}</span>
        </button>
    );
}

export function NavCard({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            className="p-4 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg border border-sky-200 font-medium transition"
        >
            {label}
        </button>
    );
}

export function InfoCard({ title, value, icon }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            </div>
            <p className="text-gray-600 text-base">{value}</p>
        </div>
    );
}



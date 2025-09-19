import React from "react";

export function Select({ label, value, onChange, options = [] }) {
    return (
        <div className="w-full px-3 mb-4">
            {label && <label className="block text-slate-700 font-semibold text-sm mb-2">{label}</label>}
            <select
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {options.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export const Field = ({ label, children, error }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">
            {label}
        </label>
        {children}
    </div>
);
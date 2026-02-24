export const FormCard = ({ title, icon: Icon, iconColor, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
            <div className={`p-2 ${iconColor} rounded-lg`}>
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-700">{title}</h3>
        </div>
        {children}
    </div>
);
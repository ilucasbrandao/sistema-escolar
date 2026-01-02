const QuickStat = ({ label, value, icon: Icon }) => (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-sm min-w-[160px]">
        <div className="p-2 bg-white rounded-lg shadow-sm text-slate-600">
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
            <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
        </div>
    </div>
);
export default QuickStat;
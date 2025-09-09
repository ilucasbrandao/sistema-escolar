export function Container({ children }) {
    return (

        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 overflow-y-auto">

            <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10">
                {children}
            </div>
        </div>
    );
}


export function TitleH1({ children }) {
    return (
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-slate-800 tracking-tight mb-6">
            {children}
        </h1>
    );
}

export function TitleH3({ children }) {
    return (
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-center text-slate-600 border-b border-slate-300 pb-3 mb-4">

            {children}
        </h3>
    );
}

export function Paragrafos({ children }) {
    return (
        <p className="text-base sm:text-lg leading-relaxed text-slate-700 mb-4 text-center">
            {children}
        </p>
    );
}

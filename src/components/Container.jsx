export function Container({ children }) {
    return (
        <div className="min-h-screen w-full bg-slate-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-12 overflow-y-auto align-items-center">
            <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-10 border border-slate-200">
                {children}
            </div>
        </div>
    );
}

export function TitleH1({ children }) {
    return (
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-6">
            {children}
        </h1>
    );
}

export function TitleH3({ children }) {
    return (
        <h3 className="text-xl md:text-2xl font-medium text-slate-700 border-b border-slate-200 pb-2 mb-4">
            {children}
        </h3>
    );
}

export function Paragrafos({ children }) {
    return (
        <p className="text-base md:text-lg leading-relaxed text-slate-600 mb-4">
            {children}
        </p>
    );
}

import logoBrandao from "../assets/1.png";
import logoBrandao2 from "../assets/2.png";

export function TopBackground() {
    return (
        <div className="max-w-60 rounded-3xl overflow-hidden flex items-center justify-center  transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xs">
            <img
                src={logoBrandao}
                alt="Logo Brandao"
                className="max-w-full max-h-full rounded-3xl object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
    );
}

export function TopBackground2() {
    return (
        <div className="max-w-55 rounded-3xl overflow-hidden flex items-center justify-center bg-green-500 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <img
                src={logoBrandao2}
                alt="Logo Brandao"
                className="max-w-full max-h-full rounded-3xl object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
    );
}

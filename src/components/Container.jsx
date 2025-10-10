import PropTypes from "prop-types";
import clsx from "clsx";

// -----------------
// Container principal com fundo infantilizado
// -----------------
export function Container({ children, padded = true, className, ...props }) {
    return (
        <div
            className={clsx(
                "min-h-screen w-full bg-gradient-to-b from-pink-100 via-yellow-100 to-blue-100 overflow-y-auto",
                className
            )}
            {...props}
        >
            <div
                className={clsx(
                    "w-full bg-white/55 border border-white/50 rounded-2xl shadow-lg backdrop-blur-sm",
                    padded && "p-6 sm:p-8 lg:p-10"
                )}

            >
                {children}
            </div>
        </div>
    );
}

Container.propTypes = {
    children: PropTypes.node.isRequired,
    padded: PropTypes.bool,
    className: PropTypes.string,
};

// -----------------
// Títulos mais divertidos
// -----------------
export function Title({ children, level = 1, className }) {
    const Tag = `h${level}`;

    const styles = {
        1: "text-3xl md:text-4xl lg:text-5xl font-bold text-purple-900 tracking-tight mb-6",
        2: "text-2xl md:text-3xl font-semibold text-pink-700 mb-5",
        3: "text-xl md:text-2xl font-medium text-yellow-700 border-b-2 border-yellow-300 pb-2 mb-4",
    };

    return (
        <Tag className={clsx(styles[level] || styles[1], className)}>
            {children}
        </Tag>
    );
}

Title.propTypes = {
    children: PropTypes.node.isRequired,
    level: PropTypes.oneOf([1, 2, 3]),
    className: PropTypes.string,
};

// -----------------
// Parágrafo
// -----------------
export function Paragraph({ children, muted = false, className }) {
    return (
        <p
            className={clsx(
                "text-base md:text-lg leading-relaxed mb-4",
                muted ? "text-slate-500" : "text-slate-700",
                className
            )}
        >
            {children}
        </p>
    );
}

Paragraph.propTypes = {
    children: PropTypes.node.isRequired,
    muted: PropTypes.bool,
    className: PropTypes.string,
};

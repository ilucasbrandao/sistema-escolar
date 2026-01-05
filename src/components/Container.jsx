import PropTypes from "prop-types";
import clsx from "clsx";

// -----------------
// Container principal
// -----------------
export function Container({ children, padded = true, className, ...props }) {
    return (
        <div
            className={clsx(
                "min-h-screen w-full bg-gradient-to-br from-orange-50 via-slate-50 to-emerald-50 p-4 sm:p-6 lg:p-8",
                className
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl w-full">
                <div
                    className={clsx(
                        "w-full bg-white/60 border border-white/60 rounded-3xl shadow-xl backdrop-blur-md",
                        padded && "p-5 sm:p-8 lg:p-10"
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

Container.propTypes = {
    children: PropTypes.node.isRequired,
    padded: PropTypes.bool,
    className: PropTypes.string,
};

export function Title({ children, level = 1, className }) {
    const Tag = `h${level}`;
    const styles = {
        1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight mb-4 sm:mb-6",
        2: "text-xl sm:text-2xl md:text-3xl font-semibold text-pink-700 mb-3 sm:mb-5",
        3: "text-lg sm:text-xl md:text-2xl font-medium text-yellow-700 border-b-2 border-yellow-300 pb-2 mb-4",
    };
    return (
        <Tag className={clsx(styles[level] || styles[1], className)}>
            {children}
        </Tag>
    );
}
Title.propTypes = {
    children: PropTypes.node,
    level: PropTypes.number,
    className: PropTypes.string,
};

export function Paragraph({ children, muted = false, className }) {
    return (
        <p
            className={clsx(
                "text-sm sm:text-base md:text-lg leading-relaxed mb-4",
                muted ? "text-slate-500" : "text-slate-700",
                className
            )}
        >
            {children}
        </p>
    );
}
Paragraph.propTypes = {
    children: PropTypes.node,
    muted: PropTypes.bool,
    className: PropTypes.string,
};

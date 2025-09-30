import PropTypes from "prop-types";
import clsx from "clsx";

// -----------------
// Container principal
// -----------------
const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
};

export function Container({
    children,
    padded = true,
    className,
    ...props
}) {
    return (
        <div
            className={clsx(
                "min-h-screen w-full bg-slate-50 overflow-y-auto",
                className
            )}
            {...props}
        >
            <div
                className={clsx(
                    "w-full bg-white",
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
    maxWidth: PropTypes.oneOf(Object.keys(maxWidths)),
    padded: PropTypes.bool,
    className: PropTypes.string,
};

// -----------------
// Title (H1, H2, H3...)
// -----------------
export function Title({ children, level = 1, className }) {
    const Tag = `h${level}`;

    const styles = {
        1: "text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight mb-6",
        2: "text-2xl md:text-3xl font-semibold text-slate-800 mb-5",
        3: "text-xl md:text-2xl font-medium text-slate-700 border-b border-slate-200 pb-2 mb-4",
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
                muted ? "text-slate-500" : "text-slate-600",
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

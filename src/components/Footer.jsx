import PropTypes from "prop-types";
import clsx from "clsx";

export default function Footer({
    appName = "Reforço Escolar Tia Jeane",
    year = new Date().getFullYear(),
    author = "Lucas Brandão",
    authorLink = null,
    className,
}) {
    return (
        <footer
            className={clsx(
                "w-full border-t border-slate-200 mt-12 px-6 py-6 text-center text-slate-500 text-sm sm:text-base",
                className
            )}
        >
            <p>
                &copy; {year} {appName}. Todos os direitos reservados.
            </p>
            <p className="mt-1">
                Desenvolvido por{" "}
                {authorLink ? (
                    <a
                        href={authorLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-700 hover:text-slate-900 transition-colors"
                    >
                        {author}
                    </a>
                ) : (
                    <span className="font-medium text-slate-700">{author}</span>
                )}
            </p>
        </footer>
    );
}

Footer.propTypes = {
    appName: PropTypes.string,
    year: PropTypes.number,
    author: PropTypes.string,
    authorLink: PropTypes.string,
    className: PropTypes.string,
};

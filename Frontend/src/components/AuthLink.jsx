import { Link } from "react-router-dom";

function AuthLink({ text, linkText, to }) {
    return (
        <p className="mt-6 text-center text-sm">
            {text}{" "}
            <Link className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline" to={to}>
                {linkText}
            </Link>
        </p>
    );
}

export default AuthLink;
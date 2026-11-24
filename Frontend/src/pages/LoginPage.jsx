import "../App.css";
import Login from "../apis/Login";
import AuthLink from "../components/AuthLink";

function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="text-center text-3xl font-bold text-gray-900">
                    Welcome <span className="text-emerald-600">back</span>
                </h1>
                <p className="mb-6 mt-2 text-center text-gray-500">
                    Log in to continue learning.
                </p>

                <Login />

                <AuthLink
                    text="Don't have an account?"
                    linkText="Sign Up"
                    to="/signup"
                />
            </div>
        </div>
    );
}

export default LoginPage;
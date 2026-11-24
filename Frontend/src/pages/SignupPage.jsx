import "../App.css";
import Signup from "../apis/Signup";
import AuthLink from "../components/AuthLink";

function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="text-center text-3xl font-bold text-gray-900">
                    Create your <span className="text-emerald-600">account</span>
                </h1>
                <p className="mb-6 mt-2 text-center text-gray-500">
                    Start your learning journey today.
                </p>

                <Signup />

                <AuthLink
                    text="Already a user?"
                    linkText="Sign In"
                    to="/login"
                />
            </div>
        </div>
    );
}

export default SignupPage;
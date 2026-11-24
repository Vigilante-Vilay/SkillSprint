import "../App.css";
import OtpVerification from "../apis/OtpVerification";

function OtpPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4 py-10">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="text-center text-3xl font-bold text-gray-900">
                    Verify your <span className="text-emerald-600">email</span>
                </h1>
                <p className="mb-6 mt-2 text-center text-gray-500">
                    One last step to get started.
                </p>

                <OtpVerification />
            </div>
        </div>
    );
}

export default OtpPage;
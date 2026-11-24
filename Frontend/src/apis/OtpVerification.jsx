import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../App.css"

function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/user/verify-otp",
                {
                    email: email,
                    otp: data.otp
                }
            );
            if (response.data.error) {
                setError("otp", {
                    type: "server",
                    message: response.data.error
                });
                return;
            }

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("firstName", response.data.firstName);
            localStorage.setItem("role", response.data.role);

            console.log(response.data);

            navigate("/home");
        }
        catch (error) {
            setError("otp", {
                type: "server",
                message: error.response?.data?.error || "Something went wrong"
            });
        }
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-4 text-center text-sm text-gray-600">
                Enter the OTP sent to <span className="font-semibold text-gray-900">{email}</span>
            </div>

            <input
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                {...register("otp", {
                    required: {
                        value: true,
                        message: "OTP is required"
                    },
                    pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Enter a valid 6-digit OTP"
                    }
                })}
                placeholder="Enter OTP"
            />

            <div className="mb-6 mt-2 min-h-5 text-center text-sm text-red-500">{errors.otp?.message}</div>

            <button
                className="cursor-pointer rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
                type="submit"
            >
                Verify OTP
            </button>

        </form>
    );
}

export default OtpVerification;
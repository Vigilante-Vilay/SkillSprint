import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css"

function Signup() {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "STUDENT"
        }
    });

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                "http://localhost:3000/user/signup",
                data
            );

            navigate("/verify-otp",{
                state: {email: data.email}
            })
        }
        catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1 text-sm font-medium text-gray-700">First Name</div>
            <input
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                {...register("firstName", { required: {value: true, message:"This field is required"}, minLength: {value: 5, message:"Must be at least 5 characters"} })}
                placeholder="First Name"
            />
            <div className="mb-3 min-h-5 text-sm text-red-500">{errors.firstName?.message}</div>

            <div className="mb-1 text-sm font-medium text-gray-700">Last Name</div>
            <input
                className="mb-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                {...register("lastName")}
                placeholder="Last Name"
            />

            <div className="mb-1 text-sm font-medium text-gray-700">Email</div>
            <input
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                {...register("email", { required: {value: true, message:"This field is required"} })}
                placeholder="Email"
            />
            <div className="mb-3 min-h-5 text-sm text-red-500">{errors.email?.message}</div>

            <div className="mb-1 text-sm font-medium text-gray-700">Password</div>
            <input
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                type="password"
                {...register("password", { required: {value: true, message:"This field is required"}, minLength: {value: 8, message:"Must be at least 8 characters"} })}
                placeholder="Password"
            />
            <div className="mb-3 min-h-5 text-sm text-red-500">{errors.password?.message}</div>

            <div className="mb-1 text-sm font-medium text-gray-700">Role</div>
            <select
                className="mb-6 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                {...register("role")}
            >
                <option value="STUDENT">Student</option>
                <option value="INSTRUCTOR">Instructor</option>
            </select>

            <button
                onClick={()=>{navigate("/verify-otp")}}
                className="cursor-pointer rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
                type="submit"
            >
                Signup
            </button>

        </form>
    );
}

export default Signup;
import "../App.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


function Login(){
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const navigate = useNavigate();

    const onSubmit = async (data)=>{
        try{
            const response = await axios.post("http://localhost:3000/user/login",data);

            localStorage.setItem("token",response.data.token);
            localStorage.setItem("firstName",response.data.firstName);
            localStorage.setItem("role",response.data.role);

            console.log(response.data);
            navigate("/home");
        }catch(error){
            console.log(error.reponse?.data || error.message);
        }
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1 text-sm font-medium text-gray-700">Email</div>
            <input
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                {...register("email", {
                    required: {
                        value: true,
                        message: "Email is required"
                    }
                })}
                placeholder="Email"
            />
            <div className="mb-3 min-h-5 text-sm text-red-500">{errors.email?.message}</div>

            <div className="mb-1 text-sm font-medium text-gray-700">Password</div>
            <input
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                type="password"
                {...register("password", {
                    required: {
                        value: true,
                        message: "Password is required"
                    }
                })}
                placeholder="Password"
            />
            <div className="mb-6 min-h-5 text-sm text-red-500">{errors.password?.message}</div>

            <button
                className="cursor-pointer rounded-lg bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
                type="submit"
            >
                Login
            </button>
        </form>
    )
}


export default Login;
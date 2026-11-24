import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CreateCourse from "../apis/CreateCourse";
import toast from "react-hot-toast";
import "../App.css";

function CreateCoursePage() {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        const loadingToast = toast.loading("Creating your course...");

        try {
            const formData = new FormData();

            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("thumbnail", data.thumbnail[0]);

            const response = await CreateCourse(formData);

            toast.success(response.msg, { id: loadingToast });
            navigate("/home");

        } catch (error) {
            toast.error(
                error.response?.data?.msg || "Unable to create course",
                { id: loadingToast }
            );
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-emerald-50 px-4 py-10">

            <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
                Create a New <span className="text-emerald-600">Course</span>
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-8 shadow-xl"
            >

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Course Title</label>
                    <input
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        {...register("title", {
                            required: "Course title is required"
                        })}
                        placeholder="Enter course title"
                    />
                    <p className="mt-1 text-sm text-red-500">{errors.title?.message}</p>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="h-32 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        {...register("description", {
                            required: "Description is required"
                        })}
                        placeholder="Enter course description"
                    />
                    <p className="mt-1 text-sm text-red-500">{errors.description?.message}</p>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Price (₹)</label>
                    <input
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        type="number"
                        {...register("price", {
                            required: "Price is required",
                            min: {
                                value: 1,
                                message: "Price must be greater than zero"
                            }
                        })}
                        placeholder="Enter course price"
                    />
                    <p className="mt-1 text-sm text-red-500">{errors.price?.message}</p>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Course Thumbnail</label>
                    <input
                        className="w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500 file:mr-4 file:cursor-pointer file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-emerald-700"
                        type="file"
                        accept="image/*"
                        {...register("thumbnail", {
                            required: "Course thumbnail is required"
                        })}
                    />
                    <p className="mt-1 text-sm text-red-500">{errors.thumbnail?.message}</p>
                </div>

                <button
                    type="submit"
                    className="mt-2 w-full cursor-pointer rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                    Create Course
                </button>

            </form>
        </div>
    );
}

export default CreateCoursePage;
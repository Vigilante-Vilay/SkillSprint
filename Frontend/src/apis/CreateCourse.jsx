import axios from "axios";

async function CreateCourse(formData) {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:3000/course/create",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.log(error.response?.data || error.message);
        throw error;
    }
}

export default CreateCourse;

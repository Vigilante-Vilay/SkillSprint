import axios from "axios";

async function GetMyCourses() {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            "http://localhost:3000/enrollment/my-courses",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data.enrollments.map(
            (enrollment) => enrollment.course.id
        );

    } catch (error) {
        console.log(error.response?.data || error.message);
        return [];
    }
}

export default GetMyCourses;

import axios from "axios";

async function GetCourses() {
    try {
        const response = await axios.get(
            "http://localhost:3000/course/all"
        );

        return response.data.courses;
    }
    catch (error) {
        console.log(error.response?.data || error.message);
        return [];
    }
}

export default GetCourses;
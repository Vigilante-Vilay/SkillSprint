
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GetCourses from "../apis/GetCourses";
import GetMyCourses from "../apis/GetMyCourses";
import CourseCard from "../components/CourseCard";
import Navbar from "../components/Navbar";
import "../App.css";

function HomePage() {

    const firstName = localStorage.getItem("firstName")

    const [courses, setCourses] = useState([]);
    const [boughtCourseIds, setBoughtCourseIds] = useState([]);

    const navigate = useNavigate();

    const isInstructor = localStorage.getItem("role") === "INSTRUCTOR";
    const isStudent = localStorage.getItem("role") === "STUDENT";

    useEffect(() => {
        const fetchData = async () => {
            const data = await GetCourses();
            setCourses(data);

            if (isStudent) {
                const boughtIds = await GetMyCourses();
                setBoughtCourseIds(boughtIds);
            }
        };

        fetchData();
    }, []);

    const refreshPurchasedCourses = async () => {
        const boughtIds = await GetMyCourses();
        setBoughtCourseIds(boughtIds);
    };

    return (
        <div className="min-h-screen bg-emerald-50">
            <Navbar />

            <div className="px-20 py-10">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome <span className="text-emerald-600">{firstName}</span>
                    </h2>

                    {isInstructor && (
                        <button
                            className="cursor-pointer rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                            onClick={() => navigate("/create-course")}
                        >
                            + Create Course
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            isBought={boughtCourseIds.includes(course.id)}
                            refreshPurchasedCourses={refreshPurchasedCourses}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;

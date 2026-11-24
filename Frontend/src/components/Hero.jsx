import "../App.css";
import HeroImg from "../assets/hero.png";
import Play from "../assets/Play_Button.png";

function Hero() {
    return (
        <section className="flex items-center justify-between gap-16 bg-emerald-50 px-20 py-20">
            {/* Left side */}
            <div className="max-w-xl">
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                    ★ Rated #1 Learning Platform
                </span>

                <h1 className="mt-6 text-6xl font-bold leading-tight text-gray-900">
                    Learn from the <span className="text-emerald-600">best instructors</span> in the world
                </h1>

                <p className="mt-6 text-lg text-gray-600">
                    Join over 100,000 students learning new skills with our comprehensive
                    online courses. Start your journey today.
                </p>

                <div className="mt-8 flex gap-4">
                    <button className="hover:scale-105 transition-all duration-200 cursor-pointer rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white hover:bg-emerald-700">
                        Get Started Free
                    </button>
                    <button className="hover:scale-105 transition-all duration-200 flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-8 py-3 font-semibold text-gray-800 hover:bg-gray-50">
                        <img className="h-5 w-5" src={Play} alt="Play" />
                        Watch Demo
                    </button>
                </div>

                <div className="mt-12 flex gap-10">
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">100K+</h3>
                        <p className="text-gray-500">Students</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">500+</h3>
                        <p className="text-gray-500">Courses</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-gray-900">50+</h3>
                        <p className="text-gray-500">Instructors</p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="relative">
                <img className="w-[550px] rounded-3xl shadow-2xl" src={HeroImg} alt="Hero" />

                <div className="absolute -left-10 -top-6 rounded-xl bg-white px-5 py-3 shadow-lg">
                    <p className="font-bold text-gray-900">12,543</p>
                    <p className="text-sm text-gray-500">Active Learners</p>
                </div>

                <div className="absolute -bottom-6 -right-8 rounded-xl bg-white px-5 py-3 shadow-lg">
                    <p className="font-bold text-gray-900">98%</p>
                    <p className="text-sm text-gray-500">Success Rate</p>
                </div>
            </div>
        </section>
    );
}

export default Hero;
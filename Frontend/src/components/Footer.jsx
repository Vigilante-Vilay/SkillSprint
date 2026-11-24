import "../App.css";
import Logo from "../assets/Logo.png";

function Footer() {
    return (
        <footer className="bg-gray-900 px-20 py-12 text-gray-400">
            <div className="flex justify-between gap-16">
                {/* Brand */}
                <div className="max-w-xs">
                    <img className="h-16 rounded bg-white p-1" src={Logo} alt="Logo" />
                    <p className="mt-4 text-sm">
                        Learn new skills from the best instructors with our comprehensive online courses.
                    </p>
                </div>

                {/* Quick links */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="cursor-pointer hover:text-emerald-400">Home</li>
                        <li className="cursor-pointer hover:text-emerald-400">Courses</li>
                        <li className="cursor-pointer hover:text-emerald-400">About</li>
                        <li className="cursor-pointer hover:text-emerald-400">Contact</li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li className="cursor-pointer hover:text-emerald-400">Help Center</li>
                        <li className="cursor-pointer hover:text-emerald-400">Terms of Service</li>
                        <li className="cursor-pointer hover:text-emerald-400">Privacy Policy</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="mb-4 font-semibold text-white">Contact</h4>
                    <ul className="space-y-2 text-sm">
                        <li>support@yoursite.com</li>
                        <li>+91 98765 43210</li>
                        <li>Delhi, India</li>
                    </ul>
                </div>
            </div>

            <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
                © 2026 YourSite. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
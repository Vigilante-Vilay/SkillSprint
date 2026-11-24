
import "../App.css";
import axios from "axios";
import toast from "react-hot-toast";

function CourseCard({ course, isBought, refreshPurchasedCourses }) {

    const handleBuyNow = async () => {
        const loadingToast = toast.loading("Initiating payment...");

        try {
            const token = localStorage.getItem("token");

            // Step 1: Create order
            const orderResponse = await axios.post(
                `http://localhost:3000/payment/create-order/${course.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const { keyId, order } = orderResponse.data;

            toast.dismiss(loadingToast);

            // Step 2: Configure Razorpay Checkout
            const options = {
                key: keyId,
                amount: order.amount,
                currency: order.currency,
                name: "SkillSprint",
                description: course.title,
                order_id: order.id,

                // Step 3: Handle successful payment
                handler: async (response) => {
                    const verifyToast = toast.loading("Verifying your payment...");

                    try {
                        const verifyResponse = await axios.post(
                            "http://localhost:3000/payment/verify",
                            response,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        toast.success(verifyResponse.data.msg, {
                            id: verifyToast
                        });
                        await refreshPurchasedCourses();

                    } catch (error) {
                        console.log(error.response?.data || error.message);

                        toast.error("Payment verification failed", {
                            id: verifyToast
                        });
                    }
                }
            };

            // Step 4: Open Checkout
            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", (response) => {
                console.log(response.error);
                toast.error("Payment failed. Please try again.");
            });

            razorpay.open();

        } catch (error) {
            console.log(error.response?.data || error.message);

            toast.error("Unable to initiate payment", {
                id: loadingToast
            });
        }
    };

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
            <img
                src={course.thumbnail}
                alt={course.title}
                className="h-48 w-full object-cover"
            />

            <div className="flex flex-1 flex-col p-5">
                <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                <h3 className="mt-2 line-clamp-2 text-sm text-gray-500">{course.description}</h3>

                <div className="mt-auto flex items-center justify-between pt-5">
                    <h3 className="text-2xl font-bold text-emerald-600">₹{course.price}</h3>

                    {isBought ? (
                        <button disabled className="cursor-not-allowed rounded-xl bg-gray-300 px-4 py-2">
                            Purchased
                        </button>
                    ) : (
                        <button
                            className="cursor-pointer rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-emerald-700"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseCard;

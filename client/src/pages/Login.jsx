import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducers/userSlice"
import "./../css/LoginSignup.css";
import OAuth from "../components/OAuth";

export default function Login() {
    const [formData, setFormData] = useState({ role: "creator" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    function handleRoleChange(role) {
        console.log(formData);
        setFormData((prev) => ({ ...prev, role }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        if (!formData.email || !formData.password) {
            setError("Fill all the fields");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success === false) {
                setError(data.message);
                return;
            }
            console.log(data)
            dispatch(login({
                user: data.user,
                role: data.user.role
            }))
            // document.cookie = `accessToken=${data.token}; path=/; Secure; SameSite=Strict`;
            navigate("/");
        } catch (e) {
            setError("error while calling backend");
        }
        finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex items-center justify-center h-screen gap-12">
            {/* Form Section */}
            <div className="shadow-lg w-full max-w-xl p-10 rounded-lg">
                <div className="mb-7">
                    <h1 className="text-3xl text-center font-bold my-7 uppercase">sign in</h1>

                    {/* Horizontal Toggle */}
                    <div className="relative w-full h-12 bg-gray-200 rounded-full flex items-center">
                        <div className={`absolute top-0 bottom-0 w-1/2 bg-blue-500 rounded-full transform transition-transform ${formData.role === "creator" ? "translate-x-0" : "translate-x-full"}`}></div>
                        <div className="flex justify-between w-full z-10">
                            <button className={`w-1/2 text-center py-2 font-medium ${formData.role === "creator" ? "text-white" : "text-gray-600"}`}
                                onClick={() => handleRoleChange("creator")}>
                                Creator
                            </button>
                            <button className={`w-1/2 text-center py-2 font-medium ${formData.role === "editor" ? "text-white" : "text-gray-600"}`} onClick={() => handleRoleChange("editor")}>
                                Editor
                            </button>
                        </div>
                    </div>
                </div>

                {formData.role == "editor" && <form onSubmit={handleSubmit} className="flex flex-col">
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your Email here"
                        id="email"
                        onChange={handleChange}
                        className="border p-3 rounded-lg mb-7"
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        onChange={handleChange}
                        className="border p-3 rounded-lg mb-7"
                    />

                    <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mb-7 animate-gradient-bg"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                    
                </form>}

                <div className="flex items-center justify-center"><OAuth role={formData.role} /></div>


                {error && <p className="text-red-500">{error}</p>}

                <div className="flex justify-center gap-2">
                    <p className="text-center">Don't have an account?</p>
                    <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
                </div>

            </div>

            {/* Image Section (Hidden on small screens) */}
            <div className=" hidden md:block">
                <img
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
                    alt="Illustration"
                />
            </div>

        </div>
    );
}

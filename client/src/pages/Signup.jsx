import { Link, useNavigate } from "react-router-dom";
import "./../css/LoginSignup.css"
import { useEffect, useState } from "react";

export default function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({ role: "creator" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [formData]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  function handleRoleChange(role) {
    setFormData((prev) => ({ ...prev, role }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword || !formData.fullName || !formData.email || !formData.role) {
      setError("Fill all values");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password Didn't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();
      if (data.success == false) {
        setError(data.message);
        return;
      }

      navigate("/login");
    }
    catch (error) {
      setError("error while calling to backend");
    }
    finally {
      setLoading(false);
    }

  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-lg w-full max-w-lg p-10 rounded-lg">
        
        <div className="mb-7">
          <h1 className="text-3xl text-center font-bold my-7 uppercase">sign up</h1>

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

        <form onSubmit={handleSubmit} className="flex flex-col">

          <label>Full Name:</label>
          <input type="text" placeholder='Enter your Name here' id='fullName' className="border p-3 rounded-lg mb-7" onChange={handleChange}></input>

          <label>Email:</label>
          <input type="email" placeholder="Enter your email here" id="email" className="border p-3 rounded-lg mb-7" onChange={handleChange}></input>

          <label>Password:</label>
          <input type="password" placeholder="Enter password" id="password" className="border p-3 rounded-lg mb-7" onChange={handleChange}></input>

          <label>Confirm Password:</label>
          <input type="password" placeholder="Confirm Your Password" id="confirmPassword" className="border p-3 rounded-lg mb-7" onChange={handleChange}></input>

          <button disabled={loading} className="bg-gradient-to-r from-blue-500 to-pink-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mb-7 animate-gradient-bg">
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {error && <p className="text-red-950">{error}</p>}

          <div className="flex justify-center gap-2">
            <p className="text-center">Already have an account? </p>
            <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
          </div>

        </form>

      </div>
    </div >
  )
}

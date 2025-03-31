"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CiUser } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Cookies from "js-cookie";
import Image from "next/image";

export default function AuthForm({ type }: { type: "login" | "register" }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = type === "login" ? "auth/login" : "auth/register";
      const payload =
        type === "login" ? { name: formData.name, password: formData.password } : formData;

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, payload);

      localStorage.setItem("token", res.data.access_token);
      Cookies.set("token", res.data.access_token, { expires: 7 });
      toast.success(type === "login" ? "Login successful!" : "Registration successful!");
      router.push("/landing");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#000000]  flex-row-reverse">
      {/* right Section (Form) */}
      <div className="w-1/2 h-full flex flex-col items-center justify-center p-8 shadow-lg">
      <h1 className=" text-7xl  text-gray-300 font-semibold font-sans">Happening  now </h1>
        <div className="max-w-md w-full">
          <h2 className="text-3xl  text-center text-gray-300  flex items-start justify-start mt-10  relative  -left-[2rem] mb-3 font-semibold">
            Join Today.
          </h2>


          <form onSubmit={handleSubmit} className="space-y-6  p-6 rounded-lg shadow-lg outline-none border-none">
            {type === "register" && (
              <div className="relative">
                <MdEmail className="absolute left top-1/2 transform -translate-y-1/2 text-gray-600 text-lg mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-5"
                  required
                />
              </div>
            )}
            <div className="relative">
              <CiUser className="absolute left top-1/2 transform -translate-y-1/2 text-gray-600 text-lg" />
              <input
                type="name"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}                  className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-5"

                required
              />
            </div>
            <div className="relative">
              <RiLockPasswordFill className="absolute left top-1/2 transform -translate-y-1/2 text-gray-600 text-lg" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none p-5"

                required
              />
            </div>
            <button
              type="submit"
              className="w-full  bg-transparent text-blue-500 border border-blue-500 font-medium p-3 rounded-full hover:bg-[#031018] transition cursor-pointer"
              disabled={loading}
            >
              {loading ? "Processing..." : type === "login" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-700">
            {type === "login" ? (
              <>
                Don't have an account?{" "}
                <button className="text-blue-600 hover:underline" onClick={() => router.push("/register")}>
                  Register here
                </button>
              </>
            ) : (
              < >
                Already have an account?{" "}
                <button className="text-blue-600 hover:underline" onClick={() => router.push("/login")}>
                  Login here
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* left Section (Text Animation) */}
      <div className="w-1/2 h-full flex items-center justify-center      p-8">
            <Image
            src="/twitter.jpeg"
            height={400}
            width={400}
            alt="twitter"
            />
      </div>

      {/* Tailwind Animations */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideInRight {
          animation: slideInRight 1s ease-out;
        }
      `}</style>
    </div>
  );
}

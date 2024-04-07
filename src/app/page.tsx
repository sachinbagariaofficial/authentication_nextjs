"use client";

import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const router = useRouter();

  const logoutFunc = async () => {
    const response = await fetch("http://localhost:5001/api/logout", {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const apiData = await response.json();

    if (apiData.status === true) {
      toast.success("Logout Successfully");
      router.push("/login");
    } else {
      toast.error("Failed to  Logout !!!!");
    }

    console.log("apiData", apiData);
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="text-white text-center text-6xl mt-5 mb-6">
        Welcome to Home
      </h1>
      <button className="button" onClick={logoutFunc}>
        Logout
      </button>
    </div>
  );
}

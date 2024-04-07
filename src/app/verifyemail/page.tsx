"use client";
import { useRouter, useSearchParams } from "next/navigation";
import "./style.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import SuccessPage from "../helper/successPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function VerifyEmail() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const [verifyToken, setVerifyToken] = useState("");
  const [verifyTokenStatus, setVerifyTokenStatus] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);

  // ********** Fetching token from URL parameters **********
  useEffect(() => {
    const { token } = Object.fromEntries(searchParam);
    setVerifyToken(token);
  }, []);

  // ********** Function to verify email **********
  const emailVerify = async (e: any) => {
    e.preventDefault();
    try {
      const data = await fetch("http://localhost:5001/api/verifyemail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verifyToken }),
      });

      const response = await data.json();
      // Updating state based on response
      if (response.status === true) {
        setVerifyTokenStatus(true);
        setShowErrorMsg(false);
        toast.success("Login successful!");
      } else {
        setVerifyTokenStatus(false);
        setShowErrorMsg(true);
        toast.error("Invalid Token. please try later");
      }
      console.log(response, "response");
    } catch (error) {
      toast.error("Failed to verify . please try later");
      console.log("Unable to verify email", error);
      setVerifyTokenStatus(false);
    }
  };

  console.log("verifyTokenStatus", verifyTokenStatus);

  return (
    <>
      {" "}
      <ToastContainer />
      <div className="grid place-items-center min-h-screen">
        {!verifyTokenStatus && (
          <div className="newsletter-form">
            <p className="heading">Please Verify your email address</p>
            <form className="form" onSubmit={emailVerify}>
              <label htmlFor="email">By Clicking the button below</label>

              <input value="Email Verify" type="submit" />
              {showErrorMsg ? (
                <div className="mt-6 sm:flex sm:gap-4">
                  <Link
                    href="/signup"
                    className="mt-2 inline-block w-full rounded-lg bg-stone-300 px-5 py-3 text-center text-sm font-semibold text-gray-800 sm:mt-0 sm:w-auto"
                  >
                    Signup
                  </Link>
                </div>
              ) : (
                ""
              )}
            </form>
          </div>
        )}

        {verifyTokenStatus && (
          <SuccessPage text="You have successfully verified your email. Now please login" />
        )}
      </div>
    </>
  );
}

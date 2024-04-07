"use client";
import { useEffect, useState } from "react";
import "./style.css";
import { string, z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { json } from "stream/consumers";
import SuccessPage from "../helper/successPage";

export default function SignupPage() {
   const [passwordShow, setPasswordShow] = useState(false);
   const [signupSuccess, setSignupSuccess] = useState(false);
   const [isLoading, setIsloading] = useState(false);
 
   // ********** Interface for Signup Data **********
   interface SingupDataType {
     confirmPassword: string;
     email: string;
     password: string;
     username: string;
   }
 
   // ********** Signup Form Validation Schema **********
   const SignUpSchema = z
     .object({
       username: z
         .string()
         .min(2, { message: "Username must be at least 2 characters long" }),
       email: z.string().email({ message: "Please enter correct email" }),
       password: z
         .string()
         .min(3, { message: "Username must be at least 4 characters long" })
         .max(20),
       confirmPassword: z.string(),
     })
     .refine(
       (value) => {
         return value.password === value.confirmPassword;
       },
       {
         message: "Passwords must match!",
         path: ["confirmPassword"],
       }
     );
 
   type SignUpSchemaType = z.infer<typeof SignUpSchema>;
 
   // ********** Form Handling **********
   const {
     register,
     handleSubmit,
     formState: { errors },
   } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });
 
   const passwordStatus = () => {
     setPasswordShow(!passwordShow);
   };
 
   const Signupform: SubmitHandler<SignUpSchemaType> = async (
     data: SingupDataType
   ) => {
     try {
       if (data.email) {
         setIsloading(true);
         // ********** API Call to Signup **********
         const response = await fetch("http://localhost:5001/api/signup", {
           method: "POST",
           body: JSON.stringify(data),
           headers: {
             "Content-Type": "application/json",
           },
         });
 
         const apiData = await response.json();
         console.log("apiData", apiData);
         if (apiData.status === false) {
           throw new Error(JSON.stringify(apiData.message));
         }
         // ********** Set Signup Success State **********
         setSignupSuccess(true);
         setIsloading(false);
       }
     } catch (error: any) {
       // ********** Error Handling **********
       setSignupSuccess(false);
       setIsloading(false);
       console.log("Error while signup", error);
     }
   };

  return (
    <div className="grid place-items-center min-h-screen">
      {!signupSuccess ? (
        <div className="min-h-screen flex justify-center items-center">
          <form className="form" onSubmit={handleSubmit(Signupform)}>
            <div className="flex-column">
              <label>Username </label>
            </div>
            <div className="inputForm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
              <input
                type="text"
                className="input"
                placeholder="Enter your Username"
                {...register("username")}
              />
            </div>
            <span className="text-sm text-red-700">
              {" "}
              {errors?.username?.message}{" "}
            </span>
            <div className="flex-column">
              <label>Email </label>
            </div>
            <div className="inputForm">
              <svg
                height="20"
                viewBox="0 0 32 32"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Layer_3" data-name="Layer 3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                </g>
              </svg>
              <input
                type="text"
                className="input"
                placeholder="Enter your Email"
                {...register("email")}
              />
            </div>
            <span className="text-sm text-red-700">
              {errors?.email?.message}{" "}
            </span>

            <div className="flex-column">
              <label>Password </label>
            </div>
            <div className="inputForm">
              <svg
                height="20"
                viewBox="-64 0 512 512"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
              </svg>
              <input
                type="text"
                className="input"
                placeholder="Enter your Password"
                {...register("password")}
              />
            </div>
            <span className="text-sm text-red-700">
              {" "}
              {errors?.password?.message}{" "}
            </span>
            <div className="flex-column">
              <label>Confirm Password </label>
            </div>
            <div className="inputForm">
              <svg
                height="20"
                viewBox="-64 0 512 512"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
              </svg>
              <input
                type={!passwordShow ? "password" : "text"}
                className="input"
                placeholder="Enter your Password"
                {...register("confirmPassword")}
              />

              {!passwordShow ? (
                <svg
                  onClick={passwordStatus}
                  viewBox="0 0 576 512"
                  height="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
                </svg>
              ) : (
                <svg
                  onClick={passwordStatus}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-slash-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                </svg>
              )}
            </div>
            <span className="text-sm text-red-700">
              {" "}
              {errors?.confirmPassword?.message}{" "}
            </span>

            <button className="button-submit" type="submit">
              {isLoading ? "loading..." : "Sign Up"}
            </button>
            <p className="p">
              Dont have an account?{" "}
              <Link href="/login" className="span">
                Login{" "}
              </Link>
            </p>
            <p className="p line">Or Signup With</p>

            <div className="flex-row">
              <button className="btn google">Google</button>
              <button className="btn apple">Apple</button>
            </div>
          </form>
        </div>
      ) : (
        <SuccessPage text="You have successfully signup. Now please check your mail" />
      )}
    </div>
  );
}

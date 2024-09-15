import React, { useState, useEffect } from "react";
import googleOneTap from "google-one-tap";
import Auth from "../utils/auth";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_VOLUNTEER, ADD_GOOGLE_VOLUNTEER } from "../utils/mutations";
import { useStateContext, useDispatchContext } from "../utils/GlobalState";
import ACTIONS from "../utils/actions";
import { QUERY_GOOGLE_VOLUNTEER } from "../utils/queries";
import { Link } from "react-router-dom";

const VolunteerSignup = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const [createGoogleVolunteer] = useMutation(ADD_GOOGLE_VOLUNTEER);
  const [uservFormData, setVolunteerFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName:"",
    skills:""
  });
  const [createVolunteer, { error }] = useMutation(ADD_VOLUNTEER);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setVolunteerFormData({ ...uservFormData, [name]: value });
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    try {
      const { data } = await createVolunteer({
        variables: { ...uservFormData },
      });

      if(data){
        console.log('success')
        Auth.login(data.createVolunteer.token);
      }
      
    } catch (err) {
      console.error(err);
    }

    setVolunteerFormData({
      username: "",
      email: "",
      password: "",
      fullName: "",
      skills:""
    });
  };


  useEffect(()=>{
    const clientID = process.env.REACT_APP_GOOGLE_CLIENT_ID
    const options = {
      client_id: clientID,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: "signup",
    };
    function decodeJwtResponse(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    }

    googleOneTap(options, async (response) => {
      const res = await fetch("/api/google/signup", {
        method: "POST",
        body: JSON.stringify({
          token: response.credential,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const userData = await res.json();
        console.log(userData);
        const { name: username, email, picture, sub, jti } = userData;
        const { data, errors } = await createGoogleVolunteer({
          variables: {
            username: username,
            email: email,
            jti: jti,
            sub: sub,
            picture: picture,
            skills: "",
          },
        });
        console.log(data);
        if (errors) {
          console.log(errors);
        }
        const responsePayload = decodeJwtResponse(response.credential);
        dispatch({ type: ACTIONS.USER_INFO, payload: responsePayload });
        console.log(responsePayload);
        Auth.login(data.createGoogleVolunteer.token);
      }
    });
  }, []);

  return (
    <>
      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto">
          <div>
            <img
              className="mx-auto h-20 w-auto "
              src="./assets/volunteerLogo.png"
              alt="volunteer icon"
            />
            <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white pb-10">
              Start making a change today!
            </h2>
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-700 dark:border-gray-600">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleFormSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="username"
                    name="username"
                    id="username"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="kindperson123"
                    required="yes"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full Name
                  </label>
                  <input
                    type="fullName"
                    name="fullName"
                    id="fullName"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Your full name here"
                    required="yes"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@email.com"
                    required="yes"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pwd"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="pwd"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required="yes"
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required="yes"
                  />
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                  Skills: 
                  </label>
                  <input
                    type="skills"
                    name="skills"
                    id="skills"
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Organizing, networking, fundrainsing, etc..."
                    required="yes"
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-600 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required={true}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className=" btn w-full text-white btn-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Get Started
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-white">
                  Already have an account?{" "}
                  <Link to="/loginvolunteer" className="text-indigo-700 hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VolunteerSignup;

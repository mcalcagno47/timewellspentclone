import React, { useState, useEffect } from "react";
import googleOneTap from "google-one-tap";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { LOGIN_GOOGLE_VOLUNTEER, LOGIN_VOLUNTEER } from "../utils/mutations";
import Auth from "../utils/auth";
import { LockClosedIcon } from "@heroicons/react/20/solid";

function LoginVolunteer(props) {
  const [uservformState, setFormState] = useState({
    username: "",
    password: "",
  });

  //Error messages:
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [displayUsernameError, setDisplayUsernameError] = useState(false);
  const [displayPasswordError, setDisplayPasswordError] = useState(false);

  const [loginAsVolunteer, { error }] = useMutation(LOGIN_VOLUNTEER);
  const [loginAsGoogleVolunteer, { err }] = useMutation(LOGIN_GOOGLE_VOLUNTEER);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Reset error messages and display status
    setUsernameError("");
    setDisplayUsernameError(false);
    setPasswordError("");
    setDisplayPasswordError(false);
    try {
      const mutationResponse = await loginAsVolunteer({
        variables: {
          username: uservformState.username,
          password: uservformState.password,
        },
      });
      
      const token = mutationResponse.data.loginAsVolunteer.token;
     
      Auth.login(token);
    } catch (e) {
      console.log(e);
      // Update error messages and display status based on the error
      if (e.message.includes("Username")) {
        setUsernameError(e.message);
        setDisplayUsernameError(true);
      } else if (e.message.includes("Password")) {
        setPasswordError(e.message);
        setDisplayPasswordError(true);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...uservformState,
      [name]: value,
    });

    // Reset error messages and display status when the user changes the input fields
    if (name === "username") {
      setUsernameError("");
      setDisplayUsernameError(false);
    } else if (name === "password") {
      setPasswordError("");
      setDisplayPasswordError(false);
    }
  };

  // Render error popups based on the display status and error messages
  const renderUsernameError = () => {
    if (displayUsernameError) {
      return (
        <div className="absolute top-0 mt-2 text-red-600 text-sm">
          {usernameError}
        </div>
      );
    }
  };

  const renderPasswordError = () => {
    if (displayPasswordError) {
      return (
        <div className="absolute top-0 mt-2 text-red-600 text-sm">
          {passwordError}
        </div>
      );
    }
  };

  useEffect(() => {
    if (Auth.loggedIn()) {
      return;
    }
    const clientID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const options = {
      client_id: clientID,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: "signin",
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
      const res = await fetch("/api/google/login", {
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
        const { data, error } = await loginAsGoogleVolunteer({
          variables: {
            email: email,
            jti: jti,
          },
        });
        const responsePayload = decodeJwtResponse(response.credential);
        console.log(responsePayload);
        Auth.login(data.loginAsGoogleVolunteer.token);
      }
    });
  }, []);

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-20 w-auto"
              src="./assets/volunteerLogo.png"
              alt="volunteer icon"
            />
            <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome Back!
            </h2>
            <p className="mt-2 text-center text-xl text-gray-600 font-bold dark:text-amber-200">
              If you're a charity, {" "}
              <Link
                to="/LoginCharity"
                className="font-medium text-indigo-600 hover:text-amber-500"
              >
                click here to sign in!
              </Link>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  placeholder="Username"
                  name="username"
                  type="text"
                  id="username"
                  onChange={handleChange}
                  autoComplete="username"
                  className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  placeholder="********"
                  name="password"
                  type="password"
                  id="pwd"
                  onChange={handleChange}
                  autoComplete="password"
                  className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
            </div>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-white">
              New here?{" "}
              <Link
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                click here to get started!
              </Link>
            </p>
          </form>
        </div>
      </div>

    </>
  );
}

export default LoginVolunteer;

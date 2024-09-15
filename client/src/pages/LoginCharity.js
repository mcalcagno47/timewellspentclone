import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { LOGIN_CHARITY } from "../utils/mutations";
import Auth from "../utils/auth";
import { LockClosedIcon } from "@heroicons/react/20/solid";

function LoginCharity(props) {
  const [usercformState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [loginAsCharity, { error }] = useMutation(LOGIN_CHARITY);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const mutationResponse = await loginAsCharity({
        variables: {
          username: usercformState.username,
          password: usercformState.password,
        },
      });
      const token = mutationResponse.data.loginAsCharity.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...usercformState,
      [name]: value,
    });
  };
  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-20 w-auto"
              src="./assets/nonprofitLogo.png"
              alt="nonprofitlogo"
            />
            <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Welcome Back!
            </h2>
            <p className="mt-2 text-center text-xl text-gray-600 dark:text-amber-200 font-bold">
              If you're a volunteer,{" "}
              <Link
                to="/LoginVolunteer"
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
              {error ? (
                <div>
                  <p className="error-text">
                    The provided credentials are incorrect
                  </p>
                </div>
              ) : null}
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

export default LoginCharity;

import React, { useState } from "react";
import { ADD_CHARITY } from "../utils/mutations";
import Auth from "../utils/auth";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const CharitySignup = () => {
  const [usercFormData, setCharityFormData] = useState({
    username: "",
    email: "",
    password: "",
    websiteURL: "",
  });

  const [createCharity, { error }] = useMutation(ADD_CHARITY);

  const handleChange = (event) => {
    const { name, value } = event.target;
    event.preventDefault();
    setCharityFormData({ ...usercFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(usercFormData)

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    // new code
    try {
      const { data } = await createCharity({
        variables: { ...usercFormData },
      });

      Auth.login(data.createCharity.token);
    } catch (err) {
      console.error(err);
    }

  };
  return (
<>
    <section>
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">
      <div>
        <img
          className="mx-auto h-20 w-auto "
          src="./assets/nonprofitLogo.png"
          alt="charity icon"
        />
        <h2 className="mt-6 text-center text-4xl font-bold tracking-tight text-gray-900 dark:text-white pb-10">
          Start making a change today!
        </h2>
      </div>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-700 dark:border-gray-600">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Create an account
          </h1>
          <form class="space-y-4 md:space-y-6" onSubmit={handleFormSubmit}>
            <div>
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Account Name
              </label>
              <input
                type="username"
                name="username"
                id="username"
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Charity or Nonprofit Name"
                required="yes"
              />
            </div>

            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@email.com"
                required="yes"
              />
            </div>
            <div>
              <label
                for="pwd"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="pwd"
                placeholder="••••••••"
                onChange={handleChange}
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required="yes"
              />
            </div>
            <div>
              <label
                for="confirm-password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required="yes"
              />
            </div>

            <div className="col-span-3 sm:col-span-2">
          <label
            htmlFor="company-website"
            className="block text-sm font-medium leading-6 dark:text-gray-400"
          >
            Website:
          </label>
          <div className="mt-2 flex rounded-md shadow-sm my-2">
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
              http://
            </span>
            <input
               name="websiteURL"
               type="websiteURL"
               id="websiteURL"
               value={usercFormData.websiteURL}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="  www.yourwebsite.org"
            />
          </div>
        </div>

            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-600 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required="true"
                />
              </div>
              <div class="ml-3 text-sm">
                <label
                  for="terms"
                  class="font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the{" "}
                  <a
                    class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="#"
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              class=" btn w-full text-white btn-primary hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Get Started
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-white">
              Already have an account?{" "}
              <Link to="/LoginCharity" class="text-indigo-700 hover:underline">
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

export default CharitySignup;

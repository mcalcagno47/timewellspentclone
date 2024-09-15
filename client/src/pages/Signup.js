import React from "react";

const Signup = () => {
  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-10 ">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight dark:text-white sm:text-6xl">
              How can we help?
            </h1>
          </div>
        </div>
        
        <div className="flex items-center justify-center flex-col w-full lg:flex-row">

        <button
            type="button"
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-small rounded-lg text-4xl px-6 py-8 text-center m-2"
            data-te-ripple-init
            data-te-ripple-color="light"
            onClick={() => document.location.replace("/VolunteerSignup")}
          >
            I want to help
          </button>

          <div className="divider lg:divider-horizontal">OR</div>
          
          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-small rounded-lg text-4xl px-6 py-8 text-center m-2"
            data-te-ripple-init
            data-te-ripple-color="light"
            onClick={() => document.location.replace("/CharitySignup")}
          >
            I'm looking for volunteers
          </button>
        </div>

        
       

        <div
          className="flex flex-wrap items-center justify-center"
          id="button-elements"
        >
     
        
        </div>
      </div>
    </div>
  );
};

export default Signup;

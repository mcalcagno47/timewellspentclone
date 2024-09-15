import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { QUERY_EVENT } from "../utils/queries";
import { Link } from "react-router-dom";

const EventPage = () => {
  let { id } = useParams();

  const { loading, error, data } = useQuery(QUERY_EVENT, {
    variables: { _id: id },
  });
  console.log(data);
  const event = data?.event;
  console.log(event);
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : !event ? (
        <p>Event not found</p>
      ) : (
        <div className="max-w-7xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 my-0">

          {/* <!--Main Col--> */}
          <div id="profile" className="w-full lg:w-3/5 rounded-lg lg:rounded-lg shadow-2xl bg-white dark:bg-gray-800 mx-6 lg:mx-auto">


            <div className="p-4 md:p-12 text-center lg:text-left">
              {/* <!-- Image for mobile view--> */}
              <div className="w-full">
                {/* <!-- Big profile image for side bar (desktop) --> */}
                <div className="w-full">
                  <img src={event.image} className="rounded-lg lg:block w-full" />
                </div>

              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 pt-8">{event.title}</h1>
              <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-indigo-600"></div>
              <div className="pt-4 text-gray-800 dark:text-gray-200"><Link to={`/profile/${event.savedCharity}`}>{event.savedCharity}</Link></div>
              <a className="pt-4  text-gray-800 dark:text-gray-200 font-bold flex items-center justify-center lg:justify-start"><svg className="h-4 fill-current text-indigo-600 pr-4 my-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M20 4H4A1 1 0 0 0 3 5V9H21V5A1 1 0 0 0 20 4ZM17 3V5M12 3V5M7 3V5" /></svg>{event.date}</a>
              <a className="pt-2  text-gray-800 dark:text-gray-200 text-xs lg:text-sm flex items-center justify-center lg:justify-start"><svg className="h-4 fill-current text-indigo-600 pr-4 my-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z" /></svg>{event.address}</a>
              <a className="pt-8 text-md text-gray-800 dark:text-gray-200">{event.description}</a>

              <div className="pt-12 pb-8">
                {/* <a href={`/profile/${event.savedCharity}`}>
                  <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full">
                    Get In Touch
                  </button>
                </a> */}
              </div>
              {/* <!-- Use https://simpleicons.org/ to find the svg for your preferred product -->  */}
            </div>
          </div>
          <div className="absolute top-0 right-0 h-12 w-18 p-4">
            <button className="js-change-theme focus:outline-none">🌙</button>
          </div>

        </div>
      )}
    </div>
  );
};

export default EventPage;

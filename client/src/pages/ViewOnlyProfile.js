import styles from "../styles/Profile.module.css";
import React from "react";
import { QUERY_CHARITY, QUERY_CHARITY_BY_USERNAME } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import EventCard from "../components/EventCard";

function ViewOnlyProfile() {
  const { username } = useParams();
  console.log(username);
  const { loading, error, data } = useQuery(QUERY_CHARITY_BY_USERNAME, {
    variables: { username: username },
  });
  const charity = data?.charity;

  if (loading)
    return (
  <Loading />
    );
  if (error) return <p>{error.message}</p>;

  return (
      <div>
        <section className={styles.mainContainer}>
          <div className="w-full lg:w-8/12 xl:w-6/12 2xl:4/12 px-4 mx-auto">
            <div className=" flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg ">
              <div className="px-6 bg-gray-200 dark:bg-gray-600  text-gray-900">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4 flex justify-center">
                    <div className="">
                      <img
                        alt=""
                        src={charity.image ? charity.image : 'https://static.vecteezy.com/system/resources/previews/001/880/049/non_2x/volunteers-collecting-donations-for-charity-free-vector.jpg'}
                        className="shadow-xl rounded-full h-auto align-middle border-none  -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                      ></img>
                    </div>
                  </div>
  
                  {/* ----------------------- ICONS -------------------------
                  
                  ----------------------- Website ------------------------- */}
                  <div className="w-full px-4 justify-center mt-20">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center items-center ">
                        <div className="flex justify-center space-x-2">
                          <div>
                            <a
                              href={`https://{charity.websiteURL}`}
                              target="blank"
                              rel="noopener"
                            >
                              <button
                                type="button"
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                className="inline-flex items-center justify-center w-8 h-8 mr-2  rounded-full bg-primary p-2 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                              >
                                <i className="fa-solid fa-globe"></i>
                              </button>
                            </a>
                          </div>
                        </div>
  
                        <span className="text-sm text-gray-900"></span>
                      </div>
  
                      {/* -----------------------Twitter-------------------------- */}
                      <div className="mr-4 p-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <div>
                            <a
                              href={`https://twitter.com/${charity.twitter}`}
                              target="blank"
                              rel="noopener"
                            >
                              <button
                                type="button"
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                className="inline-flex items-center justify-center w-8 h-8 mr-2  rounded-full bg-primary p-2 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                              >
                                <i className="fa-brands fa-twitter"></i>
                              </button>
                            </a>
                          </div>
                        </div>
  
                        {/* -----------------------Instagram------------------------- */}
                        <span className="text-sm text-gray-900"></span>
                      </div>
                      <div className="lg:mr-4 p-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <div>
                            <a href={`https://instagram.com/${charity.instagram}`}>
                              <button
                                type="button"
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                className="inline-flex items-center justify-center w-8 h-8 mr-2  rounded-full bg-primary p-2 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                              >
                                <i className="fa-brands fa-instagram"></i>
                              </button>
                            </a>
                          </div>
                        </div>
                        <span className="text-sm text-gray-900"></span>
                      </div>
                    </div>
                  </div>
                </div>
  
              
                  <div className="text-center mt-12 dark:text-white">
                    <h3 className="text-xl font-semibold leading-normal mb-2 text-gray-900 dark:text-white mb-2">
                      {charity.username}
                    </h3>
                    <div className="mb-2 text-blueGray-600 mt-10 dark:text-white">
                      <i className="fas fa-location-dot mr-2 text-lg text-gray-900 "></i>
                      {charity.address}
                    </div>
                    <div className="mb-2 text-blueGray-600 mt-10 dark:text-white">
                      <i className="fas fa-phone mr-2 text-lg text-gray-900 "></i>
                      {charity.phoneNumber}
                    </div>
                  </div>
            
  
                <div className="mt-10 py-5 border-t border-blueGray-200 text-center">
                 
                    <div className="flex flex-wrap justify-center flex-col items-center dark:text-white">
                      <div className="w-full lg:w-9/12 px-4">
                        <p>{charity.description}</p>
                      </div>
                    </div>
              
                </div>
              </div>
            </div>
  
          <div
            className="flex flex-wrap "
          >
            {charity.savedEvents?.map((event, i) => {
              return (
                <div
                  key={i}
                  className="flex flex-wrap justify-center gap-4 mx-auto lg:flex lg:flex-wrap lg:justify-center m-2"
                >
                  <EventCard event={event} key={event._id} />
                </div>
              );
            })}
          </div>
          </div>
   
        </section>  
      </div>
  );
}

export default ViewOnlyProfile;

import React from "react";
import { useStateContext, useDispatchContext } from "../utils/GlobalState";
import { useState, useEffect } from "react";
import Auth from "../utils/auth";
import { useMutation, useQuery } from "@apollo/client";
import {
  QUERY_EVENT,
  QUERY_GOOGLE_VOLUNTEER,
  QUERY_ALL_EVENTS,
  QUERY_VOLUNTEER,
} from "../utils/queries";
import {
  UPDATE_GOOGLE_VOLUNTEER_DESCRIPTION,
  UPDATE_VOLUNTEER_DESCRIPTION,
  REMOVE_GOOGLE_VOLUNTEER,
  REMOVE_VOLUNTEER,
} from "../utils/mutations";
import styles from "../styles/Profile.module.css";
import EventCard from "../components/EventCard";

const Profile = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(Auth.getProfile()?.data?._id);
  const [userDescription, setUserDescription] = useState("");
  const [userSkills, setUserSkills] = useState(Auth.getProfile()?.data?.skills)
  const [userEvents, setUserEvents] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [isUserEditingDescription, setIsUserEditingDescription] = useState(false);
  const [isUserEditingSkills, setIsUserEditingSkills] = useState(false);

  const {
    loading,
    error,
    data: googleVolunteerData,
  } = useQuery(QUERY_GOOGLE_VOLUNTEER, {
    variables: {
      _id: userId,
    },
    skip: !userId,
  });
  const {
    loading: volunteerLoading,
    error: volunteerError,
    data: volunteerData,
  } = useQuery(QUERY_VOLUNTEER, {
    variables: {
      _id: userId,
    },
    skip: !userId,
  });

  const [updateGoogleVolunteer] = useMutation(
    UPDATE_GOOGLE_VOLUNTEER_DESCRIPTION,
    {
      variables: {
        user_description: userDescription,
        _id: Auth.getProfile()?.data._id,
        skills: userSkills,
      },
    }
  );
  const [updateVolunteerDescription] = useMutation(
    UPDATE_VOLUNTEER_DESCRIPTION,
    {
      variables: {
        user_description: userDescription,
        _id: Auth.getProfile()?.data._id,
        skills: userSkills,
      },
    }
  );
  const [removeVolunteer] = useMutation(REMOVE_VOLUNTEER);
  const [removeGoogleVolunteer] = useMutation(REMOVE_GOOGLE_VOLUNTEER);

  const handleRemoveVolunteer = async () => {
    if (volunteerData?.volunteer) {
      await removeVolunteer({ variables: { _id: userId } });

      // Handle any additional logic, e.g., updating the UI or redirecting the user.
    } else if (googleVolunteerData?.googleVolunteer) {
      await removeGoogleVolunteer({ variables: { _id: userId } });
      // Handle any additional logic, e.g., updating the UI or redirecting the user.
    } else {
      console.error(
        "No volunteer or Google volunteer found for the current user"
      );
    }
    Auth.logout();
  };

  const handleSaveDescription = async (e) => {
    setIsUserEditingDescription(false);
    setIsUserEditingSkills(false)
    if (googleVolunteerData?.googleVolunteer) {
      const { data, error } = await updateGoogleVolunteer();
    }
    if (volunteerData?.volunteer) {
      const { data: vData, error: vError } = await updateVolunteerDescription();
      if (vError) {
        alert("Something went wrong.");
        console.log(vError);
      }
    }
  };
  console.log(googleVolunteerData);
  console.log(userData);
  useEffect(() => {
    if (volunteerData?.volunteer) {
      setUserData(volunteerData?.volunteer);
      setUserDescription(volunteerData?.volunteer?.user_description);
      setUserSkills(volunteerData?.volunteer?.skills)
      setUserEvents(volunteerData?.volunteer?.savedEvents);
    }
    if (googleVolunteerData?.googleVolunteer) {
      setUserData(googleVolunteerData?.googleVolunteer);
      setUserDescription(googleVolunteerData?.googleVolunteer?.user_description);
      setUserSkills(googleVolunteerData?.googleVolunteer?.skills)
      setUserEvents(googleVolunteerData?.googleVolunteer?.savedEvents);
    }
  }, [loading, volunteerLoading, userEvents]);

  useEffect(() => {
    const getUserLatLng = async () => {
      const response = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const locationData = await response.json();
      return locationData;
    };

    const getUserAddress = async (locationData) => {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${locationData.lat},${locationData.lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const addressData = await response.json();
      return addressData.results[6].formatted_address;
    };
    setIsLocationLoading(true);
    getUserLatLng()
      .then((locationData) => getUserAddress(locationData.location))
      .then((address) => setUserLocation(address));
    setIsLocationLoading(false);
  }, []);
  return (
    <>
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
                        src={userData?.picture ? userData?.picture : '../assets/letter-v-svgrepo-com.png' }
                        className={"shadow-xl rounded-full h-auto align-middle border-none  -m-16 -ml-20 lg:-ml-16 max-w-150-px " + (userData?.picture ? '' : 'h-24 w-24')}
                      ></img>
                    </div>
                  </div>

                  {/* ----------------------- ICONS -------------------------
                  
                  ----------------------- Website ------------------------- */}
                </div>
                <div className="text-center mt-12">
                  <h3 className="text-xl font-semibold leading-normal mb-2 text-gray-900 mb-2 dark:text-white">
                    {userData?.username}
                  </h3>
                  {!isLocationLoading ? (
                    <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 dark:text-white font-bold uppercase">
                      <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400 dark:text-white"></i>

                      {userLocation}
                    </div>
                  ) : (
                    <div></div>
                  )}


     {/* GY - I can't get skills to populate. Please help!              */}

                  <div className="mb-2 mt-10 text-gray-900 dark:text-white">
                  {isUserEditingSkills ? (
                        <textarea
                          className="textarea textarea-info bg-transparent dark:text-white w-96 mt-7"
                          placeholder="Skills"
                          type="text"
                          autoFocus={true}
                          id="description"
                          value={userSkills}
                          onChange={(e) => setUserSkills(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.keyCode === 27) {
                              e.currentTarget.blur();
                              setIsUserEditingSkills(false);
                            }
                          }}
                        />
                      ) : (
                        <p className="mb-4 text-blueGray-700 mt-7 dark:text-white">
                          <i className="fas fa-briefcase mr-2 text-lg dark:text-white "></i>
                          {userSkills}
                        </p>
                      )}
                    
                    
                  </div>
                  <div
                    className="flex flex-col items-center"
                  >
                    {isUserEditingSkills ? 
                      <button
                        className="group relative flex  justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={handleSaveDescription}
                      >
                        Save
                      </button>
                      :
                    <button
                        onClick={() => setIsUserEditingSkills(true)}
                        className="group relative flex  justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-30"
                      >
                        Edit Skills
                      </button>
                    }
                  </div>
                  
                </div>

                <div className="mt-10 py-5 border-t border-blueGray-200 text-center">
                  <div className="flex flex-wrap justify-center flex-col items-center">
                    <div className="w-full lg:w-9/12 px-4 flex flex-col items-center">
                      {isUserEditingDescription ? (
                        <textarea
                          className="textarea textarea-info bg-transparent dark:text-white w-96 mt-7"
                          placeholder="Bio"
                          type="text"
                          autoFocus={true}
                          id="description"
                          value={userDescription}
                          onChange={(e) => setUserDescription(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.keyCode === 27) {
                              e.currentTarget.blur();
                              setIsUserEditingDescription(false);
                            }
                          }}
                        />
                      ) : (
                        <p className="mb-4 text-blueGray-700 mt-7 dark:text-white">
                          {userDescription}
                        </p>
                      )}
                      {isUserEditingDescription ? (
                      <button
                        className="group relative flex  justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
                        onClick={handleSaveDescription}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="group relative flex  justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-max"
                        onClick={() => setIsUserEditingDescription(true)}
                      >
                        Edit Description
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {userEvents?.map((event, i) => {
              return (
                <div
                  key={i}
                  className="flex flex-wrap justify-center pb-4 gap-4 mx-auto lg:flex lg:flex-wrap lg:justify-center"
                >
                  <EventCard event={event} key={event._id} />
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap justify-center">
            <label
              htmlFor="nuke-user-modal"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Deactivate Account
            </label>
          </div>
          <input
            type="checkbox"
            id="nuke-user-modal"
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                WARNING: DEACTIVATING ACCOUNT
              </h3>
              <p className="py-4 text-left">
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed. This action cannot be undone.
              </p>
              <div className="flex flex-row-reverse space-x-4 ">
                <div className="modal-action ">
                  <button
                    htmlFor="nuke-user-modal"
                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                    onClick={handleRemoveVolunteer}
                  >
                    Deactivate
                  </button>
                </div>
                <span> </span>
                <div className="modal-action">
                  <label
                    htmlFor="nuke-user-modal"
                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Profile;

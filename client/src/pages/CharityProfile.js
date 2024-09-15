//GY: Pasted in styling/logic from ViewOnlyProfile. Just need to add the correct logic/query for
//logged in charity via _id. Then implement the edit features for fields and description at the bottom
import styles from "../styles/Profile.module.css";
import React, { useEffect } from "react";
import { QUERY_CHARITY, QUERY_ALL_EVENTS } from "../utils/queries";
import { UPDATE_CHARITY, REMOVE_CHARITY,REMOVE_EVENT } from "../utils/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { useState } from "react";
import Auth from "../utils/auth";
import { useDispatchContext, useStateContext } from "../utils/GlobalState";
import EventCard from "../components/EventCard";

function CharityProfile() {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  // const userId = Auth.getProfile().data._id;
  const [userId, setUserId] = useState(null)
  const { loading, error, data } = useQuery(QUERY_CHARITY, {
    variables: {
      _id: userId,
    },
    skip: !userId || userId === null,
  });

  console.log(userId);
  const [userData, setUserData] = useState(null); // add closing parenthesis
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(""); // add missing variables
  // const [charityName, setCharityName] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [address, setAddress] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState(data?.charity.username);

  const [image, setImage] = useState("");
  // const [userEvents, setUserEvents] =useState(null)
  // const [userData, setUserData] = useState(
  //   {
  //   userInformation: {
  //     _id: Auth.getProfile()?.data._id,
  //     description: data.description,
  //     charityName: data.charityName,
  //     websiteURL: data.websiteURL,
  //     address: data.address,
  //     facebook: data.facebook,
  //     instagram: data.instagram,
  //     twitter: data.twitter,
  //     phoneNumber: data.phoneNumber,
  //   },
  // }
  // );

  // const [isEditing, setIsEditing] = useState(false);

  // //ID

  // const [userId, setUserId] = useState(Auth.getProfile().data._id);

  const [updateCharity] = useMutation(UPDATE_CHARITY, {
    variables: {
      _id: Auth.getProfile()?.data._id,
      description: description,
      // charityName: charityName,
      username: username,
      websiteURL: websiteURL,
      address: address,
      facebook: facebook,
      instagram: instagram,
      twitter: twitter,
      phoneNumber: phoneNumber,
      image: image
    },
  });
  // const {
  //   loading: eventsLoading,
  //   error: eventsError,
  //   data: eventsData,
  // } = useQuery(QUERY_ALL_EVENTS, {
  //   variables: {
  //     _id: data?.charity.savedEvents,
  //   },
  // });

  console.log(data?.charity);

  useEffect(() => {
    // setUserData(data);
    setUserId(Auth.getProfile()?.data?._id)
    setDescription(data?.charity?.description);
    // setCharityName(data?.charityName);
    setUsername(data?.charity.username);
    setWebsiteURL(data?.charity?.websiteURL);
    setAddress(data?.charity?.address);
    setFacebook(data?.charity?.facebook);
    setInstagram(data?.charity?.instagram);
    setTwitter(data?.charity?.twitter);
    setPhoneNumber(data?.charity?.phoneNumber);
    setImage(data?.charity.image);
  }, [data]);
  // const { _id } = useParams();
  // console.log(username);
  // const { loading, error, data } = useQuery(QUERY_CHARITY_BY_USERNAME, {
  //   variables: { username: username },
  // });
  // const charity = data?.charity;

  //Save function
  const handleSave = async (e) => {
    console.log(websiteURL)
    setIsEditing(false);
    const { data, error } = await updateCharity();

    if (error) {
      alert("Something went wrong.");
      console.log(error);
    }
  };

  //Edit function
  const handleEdit = async (e) => {
    setUserData();
    setIsEditing(true);
  };

  const [removeEvent] = useMutation(REMOVE_EVENT, {
    onError: (err) => {
      console.error("Error in removeEvent mutation:", err);
    },
    onCompleted: () => {
      // Reload the page after successfully removing the event
      window.location.reload();
    },
  });
  
  const handleRemoveEvent = async (eventId) => {
    try {
      const { data, errors } = await removeEvent({
        variables: { _id: eventId },
      });
    } catch (error) {
      console.error("Error in remove event mutation:", error);
    }
  };



  const [removeCharity] = useMutation(REMOVE_CHARITY, {
    onError: (err) => {
      console.error("Error in removeCharity mutation:", err);
    },
  });

  const handleRemoveCharity = async () => {
    
    try {
      const { data, errors } = await removeCharity({
        variables: { _id: userId },
      });
      // window.location.reload();
    } catch (error) {
      console.error("Error in remove charity mutation:", error);
    }
    setUserId(null);
    Auth.logout();
  };
  if (loading) return <Loading />;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <section className={styles.mainContainer}>
        <div className="w-full lg:w-8/12 xl:w-6/12 2xl:4/12 px-4 mx-auto">
          <div className="pb-2">
            {isEditing ? (
              <button
                className="group relative flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="group relative flex  justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
          <div className=" flex flex-col min-w-0 break-words bg-inherit w-full mb-6 shadow-xl rounded-lg ">
            <div className="px-6 bg-gray-200 dark:bg-gray-600  text-gray-900">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <div className="">
                    <img
                      alt=""
                      src={image}
                      className="shadow-xl rounded-full h-auto align-middle border-none  -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    ></img>
                  </div>
                </div>

                {/* ----------------------- ICONS -------------------------
                
                ----------------------- Website ------------------------- */}
                <div className="w-full px-4 justify-center mt-20">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="p-3 text-center items-center ">
                      <div className="flex justify-center space-x-2">
                        <div>
                          <a
                            href={`https://${websiteURL}`}
                            target="blank"
                            rel="noopener"
                          >
                            <button
                              type="button"
                              data-te-ripple-init
                              data-te-ripple-color="light"
                              className="inline-flex items-center justify-center w-8 h-8 px-9  rounded-full bg-primary p-2 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                            >
                              <i className="fa-solid fa-globe"></i>
                            </button>
                          </a>
                        </div>
                      </div>

                      <span className="text-sm text-gray-900"></span>
                    </div>

                    {/* -----------------------Twitter-------------------------- */}
                    <div className="p-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <div>
                          <a
                            href={`https://twitter.com/${twitter}`}
                            target="blank"
                            rel="noopener"
                          >
                            <button
                              type="button"
                              data-te-ripple-init
                              data-te-ripple-color="light"
                              className="inline-flex items-center justify-center w-8 h-8 px-9 rounded-full bg-primary p-2 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                            >
                              <i className="fa-brands fa-twitter"></i>
                            </button>
                          </a>
                        </div>
                      </div>

                      {/* -----------------------Instagram------------------------- */}
                      <span className="text-sm text-gray-900"></span>
                    </div>
                    <div className="p-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <div>
                          <a href={`https://instagram.com/${instagram}`}>
                            <button
                              type="button"
                              data-te-ripple-init
                              data-te-ripple-color="light"
                              className="inline-flex items-center justify-center w-8 h-8 px-9  rounded-full bg-primary p-2 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
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

              {/* -----------------------Edit Icons Input-------------------------- */}
              {isEditing ? (
                <div className="space-y-6 bg-inherit dark:bg-inherit px-4 py-5 sm:p-6">
                  {/* image edit field */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="image"
                      className="text-sm font-small leading-6 text-gray-900 dark:text-white"
                    >
                      Image
                    </label>
                    <input
                      className=" block w-full text-sm bg-inherit rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-white"
                      placeholder="www.mynewURL.com"
                      type="text"
                      autoFocus={true}
                      id="image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 27) {
                          e.currentTarget.blur();
                          setIsEditing(false);
                        }
                      }}
                  
                    />
                  </div>
                  
                  {/* Email edit field */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="title"
                      className="text-sm font-small leading-6 text-gray-900 dark:text-white"
                    >
                      Website
                    </label>
                    <input
                      className=" block w-full text-sm bg-inherit rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-white"
                      placeholder="www.mynewURL.com"
                      type="website"
                      autoFocus={true}
                      id="websiteURL"
                      value={websiteURL}
                      onChange={(e) => setWebsiteURL(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 27) {
                          e.currentTarget.blur();
                          setIsEditing(false);
                        }
                      }}
                      // onBlur={()=> setIsUserEditingDescription(false)}
                    />
                  </div>

                  {/* Twitter edit field */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="title"
                      className="text-sm font-small leading-6 text-gray-900 dark:text-white"
                    >
                      Twitter Handle
                    </label>
                    <input
                      className=" block w-full text-sm bg-inherit rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-white"
                      placeholder="myTwitterHandle"
                      type="twitter"
                      autoFocus={true}
                      id="twitter"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 27) {
                          e.currentTarget.blur();
                          setIsEditing(false);
                        }
                      }}
                      // onBlur={()=> setIsUserEditingDescription(false)}
                    />
                  </div>

                  {/* Instagram edit field */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="title"
                      className="text-sm font-small leading-6 text-gray-900 dark:text-white"
                    >
                      Instagram Handle
                    </label>
                    <input
                      className=" block w-full text-sm bg-inherit rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-white"
                      placeholder="myInstagramHandle"
                      type="instagram"
                      autoFocus={true}
                      id="instagram"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 27) {
                          e.currentTarget.blur();
                          setIsEditing(false);
                        }
                      }}
                      // onBlur={()=> setIsUserEditingDescription(false)}
                    />
                  </div>
                </div>
              ) : null}

              {/* Editing Written Fields */}
              {isEditing ? (
                <div className="space-y-6 bg-inherit px-4 py-5 sm:p-6">
                  {/* Name field edit */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="title"
                      className="text-sm font-small leading-6 text-gray-900  dark:text-white"
                    >
                      Organization Name
                    </label>
                    <input
                      className=" block w-full text-4xl bg-white rounded-md border-0 py-1 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-gray-400"
                      placeholder={username}
                      type="username"
                      autoFocus={true}
                      id="username"
                      value={username}
                      // onChange={(e) => setWebsiteURL(e.target.value)}
                      // onKeyDown={(e) => {
                      //   if (e.keyCode === 27) {
                      //     e.currentTarget.blur();
                      //     setIsEditing(false);
                      //   }
                      // }}
                      disabled
                    />
                    <p className="mt-2 text-xs text-gray-500  dark:text-white">
                      To change the name of your organization, please contact
                      support.
                    </p>
                  </div>

                  {/* Address field edit */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="title"
                      className="text-sm font-small leading-6 text-gray-900  dark:text-white"
                    >
                      Address
                    </label>
                    <input
                      className=" block w-full text-sm bg-inherit rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-white"
                      placeholder="MyOrganizationAddress"
                      type="address"
                      autoFocus={true}
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 27) {
                          e.currentTarget.blur();
                          setIsEditing(false);
                        }
                      }}
                      // onBlur={()=> setIsUserEditingDescription(false)}
                    />
                  </div>

                  {/* Phone field edit */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="title"
                      className="text-sm font-small leading-6 text-gray-900  dark:text-white"
                    >
                      Phone Number:
                    </label>
                    <input
                      className=" block w-full text-sm bg-inherit rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:text-white"
                      placeholder="(800)-800-0000"
                      type="phoneNumber"
                      autoFocus={true}
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 27) {
                          e.currentTarget.blur();
                          setIsEditing(false);
                        }
                      }}
                      // onBlur={()=> setIsUserEditingDescription(false)}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center mt-12 dark:text-white">
                  <h3 className="text-xl font-semibold leading-normal mb-2 text-gray-900 dark:text-white mb-2">
                    {username}
                  </h3>
                  <div className="mb-2 text-blueGray-600 mt-10 dark:text-white">
                    <i className="fas fa-location-dot mr-2 text-lg text-gray-900 "></i>
                    {address}
                  </div>
                  <div className="mb-2 text-blueGray-600 mt-10 dark:text-white">
                    <i className="fas fa-phone mr-2 text-lg text-gray-900 "></i>
                    {phoneNumber}
                  </div>
                </div>
              )}

              <div className="mt-10 py-5 border-t border-blueGray-200 text-center">
                {isEditing ? (
                  <div className="space-y-6 bg-inherit px-4 py-5 sm:p-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="title"
                        className="text-sm font-small leading-6 text-gray-900  dark:text-white"
                      >
                        Description
                      </label>
                      <textarea
                        className=" block w-full text-sm bg-inherit rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  dark:text-white"
                        placeholder="Mission statement: We are an charity that does things that charities do."
                        type="description"
                        autoFocus={true}
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.keyCode === 27) {
                            e.currentTarget.blur();
                            setIsEditing(false);
                          }
                        }}
                        // onBlur={()=> setIsUserEditingDescription(false)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center flex-col items-center dark:text-white">
                    <div className="w-full lg:w-9/12 px-4">
                      <p>{description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="flex flex-wrap "
          >
            {data?.charity.savedEvents.map((event, i) => {
            return (
              <div
                key={i}
                className="flex flex-wrap justify-center gap-4 mx-auto lg:flex lg:flex-wrap lg:justify-center m-2"
              >
                <EventCard event={event} key={event._id} />
                
                <button
                  className="  justify-left translate-x-32  lg:translate-x-36  absolute flex rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {
                    window.location.href = "/event/edit/" + event._id;
                  }}
                >
                  Edit Event
                </button>
                
                
                <button
                  className="  justify-right absolute flex -translate-x-28 lg:-translate-x-32 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={() => {handleRemoveEvent(event._id)}}
                  >
                 Remove Event
                </button>
                
                </div>
            );
          })}
          </div>
          
          
        </div>
        <div className="flex flex-wrap justify-center mt-4">
        <label htmlFor="nuke-modal" className="btn btn-danger"
        >
          Deactivate Account
        </label>
        </div>
      </section>
      {/* The button to open modal
      <label htmlFor="nuke-modal" className="btn">
        open modal
      </label> */}

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="nuke-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">WARNING: DEACTIVATING ACCOUNT</h3>
          <p className="py-4 text-left">
            Are you sure you want to deactivate your account? All of your data
            will be permanently removed. This action cannot be undone.
          </p>
          <div className="flex flex-row-reverse space-x-4 ">
            <div className="modal-action ">
              <button
                htmlFor="nuke-modal"
                className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                onClick={handleRemoveCharity}
              >
                Deactivate
              </button>
            </div>
            <span> </span>
            <div className="modal-action">
              <label
                htmlFor="nuke-modal"
                className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityProfile;

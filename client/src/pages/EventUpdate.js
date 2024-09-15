import React, { useState, useEffect } from "react";
import { useMutation,useQuery } from "@apollo/client";
import { UPDATE_CHARITY_EVENT } from "../utils/mutations";
import { parse } from "graphql";
import { useParams } from "react-router-dom";
import {QUERY_EVENT} from "../utils/queries"
function EventUpdate(props) {
  let { id } = useParams();

  const { loading, err, data } = useQuery(QUERY_EVENT, {
    variables: { _id: id },
  });
  const event = data?.event;
  const [usercformState, setFormState] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    time: "",
    address: "",
    // savedCharity: "",
  });
  const [addCharityEvent, { error }] = useMutation(UPDATE_CHARITY_EVENT);
  useEffect(()=>{
    if(data){
      setFormState({
    _id: id,
    title: event.title,
    description: event.description,
    image: event.image,
    date: event.date,
    time: event.time,
    address: event.address,
      })
    }
  },[data])
  //Form Validation:
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    time: "",
    address: "",
    // savedCharity: "",
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    //Form validation:
    const {title, description, image, date, time, address, savedCharity} = usercformState;
    const formErrors = {
      title: title ? "" : "Please enter a title for your event",
      description: description ? "" : "Please enter a description for your event",
      image: image ? "" : "Please insert an image for your event",
      date: date ? "" : "Please enter the date of your event",
      time: time ? "" : "Please enter the time of your event",
      address: address ? "" : "Please enter the address of your event",
      // savedCharity: savedCharity ? "" : "Please enter the name of your Charity",
    };
    if(Object.values(formErrors).some((error) => error)){
      setErrors(formErrors);
      setSubmitted(false);
      return; 
    } else {
        document.location.replace("/CharityProfile")
    }

    try {
      console.log("Before calling addCharityEvent");
      const mutationResponse = await addCharityEvent({
        variables: {
            id: id,
            title: usercformState.title,
            description: usercformState.description,
            image: usercformState.image,
            date: usercformState.date,
            time: usercformState.time,
            address: usercformState.address,
        },
      });
      console.log("After calling addCharityEvent");
      console.log("Mutation response:", mutationResponse);
    } catch (e) {
      console.log("Error during addCharityEvent call:", e);
    } finally {
      setSubmitted(true);
      console.log("Form submission completed");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...usercformState,
      [name === "charity" ? "savedCharity" : name]: value,
    });
  };

  return (
    <>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-base font-semibold leading-6 text-gray-900 dark:text-white text-center">
                Edit Event
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-200 text-center">
                Change any details about your event
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleFormSubmit}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6 bg-gray-200 dark:bg-gray-600">
                  {/*---------------------------- TITLE-------------------------- */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-200"
                    >
                      Event Title
                    </label>
                    <input
                      placeholder="Community Cleanup"
                      name="title"
                      type="text"
                      id="title"
                      value={usercformState.title}
                      onChange={handleChange}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-600 dark:text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                  </div>
                  {/*---------------------------- Event Details -------------------------- */}
                  <div>
                    <label
                      htmlFor="details"
                      className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-200"
                    >
                      Event Details
                    </label>
                    <div className="mt-2">
                      <textarea
                        placeholder="Type description here"
                        name="description"
                        type="text"
                        id="description"
                        onChange={handleChange}
                        value={usercformState.description}
                        
                        className="mt-1 block w-full rounded-md border-0 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">
                      What do you want your volunteers to know about the event?
                    </p>
                    {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                  </div>

                  {/*---------------------------- Date-------------------------- 
                  Will add cooler date and time picker later*/}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-200"
                    >
                      Date
                    </label>
                    <input
                      placeholder="3/27/23"
                      name="date"
                      type="date"
                      id="date"
                      onChange={handleChange}
                      value={usercformState.date}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-600shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                  </div>

                  {/*----------------------------Time------------------------- 
                  Will add cooler date and time picker later*/}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium leading-6 text-gray-600"
                    >
                      Time
                    </label>
                    <input
                      placeholder="12:30PM"
                      name="time"
                      type="time"
                      id="time"
                      onChange={handleChange}
                      value={usercformState.time}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-600shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
                  </div>
                  {/*----------------------------Address------------------------- 
                  */}
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-200"
                    >
                      Address
                    </label>
                    <input
                      placeholder="200 W Awesome Street, Chicago IL, 60618"
                      name="address"
                      type="address"
                      id="address"
                      value={usercformState.address}
                      onChange={handleChange}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-600 bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="imageLink"
                      className="block text-sm font-medium leading-6 text-gray-600 dark:text-gray-200"
                    >
                      Image Link
                    </label>
                    <input
                      placeholder="Place an Image link here"
                      name="image"
                      type="link"
                      id="image"
                      onChange={handleChange}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-600 bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                  </div>
                </div>
                {/*---------------------------- Submit Button------------------------- */}
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6 bg-gray-200 dark:bg-gray-600">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                    Save Changes

                  </button>

                </div>
                {/*---------------------------- Error Message (make it a modal/notification)------------------------- */}
                {error ? (
                  <div>
                    <p className="error-text">Failed to save changes. Please try again!</p>
                  </div>
                ) : null }
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}

export default EventUpdate;

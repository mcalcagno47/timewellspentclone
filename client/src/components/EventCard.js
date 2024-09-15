import { Link } from "react-router-dom";
import { ADD_VOLUNTEER_EVENT, ADD_GOOGLE_VOLUNTEER_EVENT, REMOVE_VOLUNTEER_EVENT, REMOVE_GOOGLE_VOLUNTEER_EVENT } from "../utils/mutations";
import { QUERY_VOLUNTEER, QUERY_GOOGLE_VOLUNTEER, QUERY_CHARITY } from '../utils/queries'
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from "@apollo/client";
import Auth from "../utils/auth";
import styles from '../styles/EventCard.module.css'


function EventCard({ event }) {
  
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null)
  const [isEventRemoved, setIsEventRemoved] = useState(true);
  const [charityName, setCharityName] = useState(event.savedCharity)
  const [addVolunteerEvent, { error }] = useMutation(ADD_VOLUNTEER_EVENT, {
    context: { token: userToken },
    update: (cache, { data: { addVolunteerEvent } }) => {
      
      // Update the cache
    },
    onError: (err) => {
      // console.error(err);
    },
  });
  const [addGoogleVolunteerEvent, { error: googlevError }] = useMutation(ADD_GOOGLE_VOLUNTEER_EVENT, {
    context: { token: userToken }, 
    update: (cache, { data: { addVolunteerEvent } }) => {
      
      // Update the cache
    },
    onError: (err) => {
      // console.error(err);
    },
  });
  const [removeVolunteerEvent] = useMutation(REMOVE_VOLUNTEER_EVENT,{
    context: { token: userToken}
  })
  const [removeGoogleVolunteerEvent] = useMutation(REMOVE_GOOGLE_VOLUNTEER_EVENT,{
    context: { token: userToken}
  })
  const {loading: volunteerLoading, error: volunteerError, data: volunteerData, refetch: refetchV} = useQuery(QUERY_VOLUNTEER,{
    variables:{
      _id: userToken?.data._id,
    },
    skip: !userToken?.data._id,
  })
  const {loading: googleVolunteerLoading, error: googleVolunteerError, data: googleVolunteerData, refetch} = useQuery(QUERY_GOOGLE_VOLUNTEER,{
    variables:{
      _id: userToken?.data._id,
    },
    skip: !userToken?.data._id,
  })

  const {loading: charityLoading, error: charityError, data: charityData} = useQuery(QUERY_CHARITY,{
    variables:{
      _id: userToken?.data._id,
    },
    skip: !userToken?.data._id,
  })

  const handleAddEvent = async (e) => {
    const eventId = e.target.dataset.id;
  
    try {
      if(volunteerData?.volunteer){
        const { data, errors } = await addVolunteerEvent({
          variables: {
            eventId: event._id,
          },
          update: (cache, { data: { addVolunteerEvent } }) => {
            // ...
          },
        });
        refetchV({
          _id: userToken?.data._id,
      })
      }
      if(googleVolunteerData?.googleVolunteer){
        const {googleData, errors: googleErrors} = await addGoogleVolunteerEvent({
          variables: {
            eventId: event._id,
          }
        })
        refetch({
          _id: userToken?.data._id,
        })
      }
        
      
    } catch (error) {
    }
  };
  
  const handleRemoveEvent = async (e) =>{
    if(volunteerData?.volunteer){
      const { volunteerData, errors} = await removeVolunteerEvent({
        variables: {
          eventId: event._id
        }
      });
      refetchV({
        _id: userToken?.data._id,
    })
    }
    if(googleVolunteerData?.googleVolunteer){
      const {googleVolunteerData, errors: googleErrors} = await removeGoogleVolunteerEvent({
        variables: {
          eventId: event._id,
        }
      });
      refetch({
        _id: userToken?.data._id,
    })
    }
      
      
  }
  console.log(charityData)
console.log(googleVolunteerData)
  useEffect(() => {
    console.log(googleVolunteerData)
    setUserToken(Auth.getProfile())
    console.log(event._id);
  }, [event]);


  if (!event) {
    return <h3>No events match this search, check again later!</h3>
  }

  return (
      <div className="max-w-sm max-h-max rounded overflow-hidden shadow-lg dark:bg-slate-600">
          <Link to={`/event/${event._id}`}>
            <img
              className="rounded-t-lg h-48 w-96 object-cover"
              src= {event.image}
              alt=""
            />
          </Link>
          <div className="p-5">
            <Link to={`/event/${event._id}`}>
              <h5 className="text-gray-900 font-bold text-2xl text-left tracking-tight mb-2 dark:text-white">
                {event.title}
              </h5>
            </Link>
            <p className="font-normal text-gray-700 mb-3 text-left dark:text-gray-400">
              <Link to ={`/profile/${charityName}`}>{charityName}</Link>
            </p>
          <div className="flex space-x-1 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>{" "}
            <p className="font-normal text-gray-400 ">{event.date}</p>
          </div>

          <div className="flex space-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>

            <p className="font-normal text-gray-400 ">{event.address}</p>
           
          </div>
          <div className ="grid place-self-end pt-2">
            {
              <div>
              {(!charityData?.charity && Auth.loggedIn()) &&
              <div>
                { googleVolunteerData?.googleVolunteer?.savedEvents?.some((eventObj)=> eventObj._id === event._id) ||  volunteerData?.volunteer?.savedEvents?.some((eventObj)=> eventObj._id === event._id) ?
              <button
                type="button"
                className={`text-white bg-gradient-to-r from-cyan-500 to-blue-500 
                hover:bg-gradient-to-bl focus:ring-4 focus:outline-none 
                focus:ring-cyan-300 dark:focus:ring-cyan-800 font-small 
                text-4xl text-center m-2 
                rounded-full px-3 py-1 text-sm font-semibold   mb-2 ` + styles.removeEvent}
                data-te-ripple-init
                data-te-ripple-color="light"
                data-id={event._id} 
                data-button='remove'
                onClick={handleRemoveEvent}>
                Remove Event
              </button>
              :
              <button
                type="button"
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 
                hover:bg-gradient-to-bl focus:ring-4 focus:outline-none 
                focus:ring-cyan-300 dark:focus:ring-cyan-800 font-small 
                text-4xl text-center m-2 
                rounded-full px-3 py-1 text-sm font-semibold   mb-2"
                data-te-ripple-init
                data-te-ripple-color="light"
                data-id={event._id} 
                data-button='add'
                onClick={handleAddEvent}>
                Sign up!
              </button>
            }
              </div>
              }
              </div>
            }
            
            
          
            
          </div>
        </div>
      </div>
      
  );
}

export default EventCard;

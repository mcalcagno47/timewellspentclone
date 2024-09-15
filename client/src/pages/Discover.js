import React, { useState } from "react";
import EventCard from "../components/EventCard";
import { useQuery } from "@apollo/client";
import { QUERY_ALL_EVENTS} from "../utils/queries";
import SearchBar from "../components/SearchBar"
import Loading from "../components/Loading";

const Discover = () => {
  const { loading, data } = useQuery( QUERY_ALL_EVENTS);
  const events = data?.allEvents || [];
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="mx-auto">
      <h1 className="text-center text-gray-900 font-bold text-2xl tracking-tight m-4 dark:text-white mx-auto">
        What kind of help are you wanting to provide?
      </h1>

      {/* ------------------SearchBar---------------- */}
      <div className="justify-center flex">
        <div className="mb-3">
          <SearchBar searchInput={searchInput} setSearchInput={setSearchInput}/>
        </div>
      </div>

      {/* ---------------Event Cards----------------- */}
      
        <div className="flex flex-wrap gap-4 mx-auto">
          {loading ? (
            <Loading/>
          ) : (
              <div  className="flex flex-wrap gap-4 mx-auto lg:py-16 lg:px-5 lg:flex-row lg:items-center">
                {events.filter((event) => {
                  if (searchInput?.toLowerCase()==='') {
                    return event
                  } 
                  else if (event?.title?.toLowerCase().includes(searchInput) || event?.description?.toLowerCase().includes(searchInput)) {
                    return event
                  }
                }).map((event,i) => (
                  <div 
                  className="flex flex-wrap justify-center gap-4 mx-auto lg:flex lg:flex-wrap lg:justify-center"
                  key={i}>
                    <EventCard event={event} key={event._id} />
                  </div>
                ))}
              </div>
          )}
        </div>
    </div>
  );
};

export default Discover;

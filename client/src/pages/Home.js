import React, { useCallback, useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import  Auth  from '../utils/auth'
import { useQuery } from "@apollo/client";
import { QUERY_ALL_EVENTS } from "../utils/queries";
import {GoogleMap, useJsApiLoader, Libraries} from '@react-google-maps/api'


const containerStyle = {
  width: '700px',
  height: '400px',
  alignSelf: 'center',
  borderRadius: '5px',
};
const googleMapsLibraries = ['places']
const center = {
  lat: 41.9703133,
  lng: -87.663045
};

const Home = () => {

  const [searchOpportunityInput, setSearchOpportunityInput] = useState('');

  const { loading, data } = useQuery(QUERY_ALL_EVENTS);
  const events = data?.allEvents || [];
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: googleMapsLibraries,
  })
  
  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    
    let service;
    let infowindow;
    let infoWindow;
    
    const bounds = new window.google.maps.LatLng(center);
    map.setCenter(bounds)
    map.setZoom(10)
    infoWindow = new window.google.maps.InfoWindow();

    const locationButton = document.createElement("button");
    
    locationButton.textContent = "Pan to Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(pos);
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(
          browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
        );
      }
    })
    
    setMap(map)
  }, [])

  

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const handleSearchClick = async () =>{
   
    const getSearchInputLatLng = async () =>{
      const geocoder = new window.google.maps.Geocoder();
      let response = geocoder.geocode({
        'address': searchOpportunityInput 
      },
        function (results, status){
          if(status == 'OK'){
            console.log(results[0].geometry.location.lat())
          }
          else{
            alert('Geocode was not successful.', status)
          }
        }
      )
      console.log(await response)
      const latLng = {lat:(await response).results[0].geometry.location.lat() , lng :(await response).results[0].geometry.location.lng() }
      console.log(latLng)
      map.setCenter(latLng);
      return latLng;
    }
   getSearchInputLatLng();

    function createInfoWindow(markerObject, placeDetails){
      let infoWindow = new window.google.maps.InfoWindow({})

      const content = document.createElement('div')
      content.classList.add('content')

      if(placeDetails?.photos){
        const placePhotoWrapper = document.createElement('div');
        placePhotoWrapper.classList.add('photoWrapper');
        const placePhoto = document.createElement('img');
        placePhotoWrapper.appendChild(placePhoto);
        placePhoto.setAttribute('src', placeDetails?.photos[0]?.getUrl())
        console.log(placeDetails?.photos[0]?.getUrl());
        content.appendChild(placePhotoWrapper)
      }
      const placeName = document.createElement('h2')
      const placeAddress = document.createElement('p')
      const placePhone = document.createElement('p')
      placeName.textContent = markerObject.place.name;
      placeAddress.textContent = placeDetails.formatted_address;
      placePhone.textContent = placeDetails.formatted_phone_number;
      content.appendChild(placeName);
      content.appendChild(placeAddress);
      content.appendChild(placePhone);
      
      infoWindow.setContent(content);

      markerObject.marker.addListener('mouseover', ()=>{
        
        infoWindow.open({
          anchor: markerObject.marker,
          map: map,
        })
      })

      markerObject.marker.addListener('mouseout', ()=>{
        
        infoWindow.close({
          anchor: markerObject.marker,
          map: map,
        })
      })
      
      if(placeDetails.website){
        markerObject.marker.addListener('click', ()=>{
          window.open(placeDetails.website)
        })
        let clickForWebsite = document.createElement('p')
        clickForWebsite.textContent = 'Click marker to view website.'
        clickForWebsite.style.fontSize = '12px'
        clickForWebsite.style.alignSelf = 'center'
        clickForWebsite.style.color = 'green'
        content.appendChild(clickForWebsite);
      }

      return infoWindow;
    }

    async function createMarker(place) {
      if (!place.geometry || !place.geometry.location) return;
      const marker = new window.google.maps.Marker({
        map,
        animation: window.google.maps.Animation.DROP,
        position: place.geometry.location,
      });
      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
      }
      marker.setMap(map)
      return {marker, place};
    }
    
    const request = {
      location: await getSearchInputLatLng(),
      radius: '2500',
      keyword: 'charity'
    };
    
    let service;
    
    service = new window.google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
    function callback(results, status) {
      console.log(results)
      if (status == window.google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {

          (function (i) {
            setTimeout(function () {
              service.getDetails({placeId: results[i].place_id, fields: ['formatted_address', 'formatted_phone_number', 'website', 'photos']}, (PlaceDetails, PlacesServiceStatus)=>{
                createMarker(results[i])
                  .then((markerObject)=>{
                    createInfoWindow(markerObject, PlaceDetails);
                  })
                
                  if(PlacesServiceStatus == window.google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT){
                    return console.log(PlacesServiceStatus);
                  }
                  console.log(PlaceDetails)
              })
            }, 500 * i);
          })(i);
          
        }
      }
      
      if(results.length === 0){
        return console.log('zero results')
      }
    }
  }

  useEffect(()=>{
    if(Auth.isTokenExpired()){
      Auth.logout();
    }
  },[])
  return (
    <div>
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
              Time Well Spent
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-200">
              "Time well spent adds to a life well lived." 
            </p>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-200">
            We match volunteers to non-profits and charities to make sure that your time is well spent on helping others. 
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {!Auth.loggedIn() &&
                <a
                  href="/signup"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </a>
              }
              
              <a href="/discover" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white ">
                Find Opportunities <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <svg
            className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
            viewBox="0 0 1155 678"
          >
            <path
              fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
              fillOpacity=".3"
              d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
            />
            <defs>
              <linearGradient
                id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                x1="1155.49"
                x2="-78.208"
                y1=".177"
                y2="474.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9089FC" />
                <stop offset="1" stopColor="#FF80B5" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <section className="bg-white dark:bg-gray-800">
        <div className="container flex flex-col px-6 py-10 mx-auto space-y-6 lg:h-[32rem] lg:py-16 lg:flex-row lg:items-center">
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
              <h1 className="text-2xl font-bold tracking-wide text-gray-800 dark:text-white lg:text-5xl">
                Find Opportunities
              </h1>

              <div className="mt-8 space-y-5">
                <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mx-2 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span className="mx-2">Find opportunities near you</span>
                </p>

                <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mx-2 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span className="mx-2">Find organizations in the causes you care about</span>
                </p>

                <p className="flex items-center -mx-2 text-gray-700 dark:text-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 mx-2 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span className="mx-2">For Charities: Host events that volunteers can find</span>
                </p>
              </div>
            </div>

            <div className="w-full mt-8 bg-transparent border rounded-md lg:max-w-sm dark:border-gray-700 focus-within:border-indigo-400 focus-within:ring focus-within:ring-indigo-300 dark:focus-within:border-indigo-400 focus-within:ring-opacity-40">
              <form className="flex flex-col lg:flex-row">
                <input
                  type="input"
                  placeholder="Search a city or zip code"
                  className="flex-1 h-10 px-4 py-2 m-1 text-gray-700 placeholder-gray-400 bg-transparent border-none appearance-none dark:text-gray-200 focus:outline-none focus:placeholder-transparent focus:ring-0"
                  value={searchOpportunityInput}
                  onChange={(e)=>setSearchOpportunityInput(e.target.value)}
                  onKeyDown={(e)=>{
                    if (e.key === 'Escape') {
                        e.target.blur()
                    }
                    if(e.key === 'Enter'){
                      e.preventDefault();
                      handleSearchClick();
                    }
                  }}
                />

                <button
                  type="button"
                  className="h-10 px-4 py-2 m-1 text-white transition-colors duration-200 transform bg-indigo-500 rounded-md hover:bg-indigo-400 focus:outline-none focus:bg-indigo-400"
                  onClick={handleSearchClick}
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center justify-center w-full h-96 lg:w-1/2">
        
            {isLoaded && 
              <GoogleMap
                center={center}
                zoom={5}
                mapContainerStyle={containerStyle}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
              </GoogleMap>
        }
          </div>
        </div>
      </section>
        {/* ---------------Event Cards----------------- */}
          <div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 px-6 py-10 mx-auto lg:flex lg:flex-wrap lg:justify-center">
              {events.map((event) => (
                <EventCard event={event} key={event._id} />
              ))}
            </div>
          )}
          </div>
        
        
          
        
    </div>
  );
};

export default Home;

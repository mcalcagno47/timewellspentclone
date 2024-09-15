//Navbar
//Note: When in mobile view, menu automatically "hamburgers".
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";

import CharityHamburger from "./CharityHamburger";
import UserHamburger from "./UserHamburger";

import { useStateContext } from "../utils/GlobalState";
import { useState, useEffect,useContext } from "react";
import { useQuery } from "@apollo/client";
import {
  QUERY_GOOGLE_VOLUNTEER,
  QUERY_CHARITY,
  QUERY_VOLUNTEER,
} from "../utils/queries";
import Toggle from "../components/Toggle";

const volunteerNavigation = [
  { name: "Home", to: "/", href: "/", current: false },
  { name: "Find Opportunities", href: "/discover", current: false },
  { name: "Profile", href: "/profile", current: false },
];

const charityNavigation = [
  {
    name: "Create Event",
    to: "/EventForm",
    href: "/EventForm",
    current: false,
  },
  { name: "Home", to: "/", href: "/", current: false },
  { name: "Profile", href: "/CharityProfile", current: false },
];

const loggedInNav = [
  { name: "Login", href: "/LoginVolunteer", current: false },
  { name: "Sign Up", href: "/Signup", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const state = useStateContext();
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(Auth.getProfile()?.data._id);
  const {
    loading: loadingGooglev,
    error: errorGooglev,
    data: dataGooglev,
  } = useQuery(QUERY_GOOGLE_VOLUNTEER, {
    variables: {
      _id: userId,
    },
    skip: !userId,
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const {
    loading: loadingCharity,
    error: errorCharity,
    data: dataCharity,
  } = useQuery(QUERY_CHARITY, {
    variables: {
      _id: userId,
    },
    skip: !userId,
  });

  const {
    loading: loadingVolunteer,
    error: errorVolunteer,
    data: dataVolunteer,
  } = useQuery(QUERY_VOLUNTEER, {
    variables: {
      _id: userId,
    },
    skip: !userId,
  });
console.log(isLoggedIn)
  useEffect(() => {
    if (dataCharity?.charity) {
      setUserData(dataCharity.charity);
    }
    if (dataVolunteer?.volunteer) {
      setUserData(dataVolunteer.volunteer);
    }
    if (dataGooglev?.googleVolunteer) {
      setUserData(dataGooglev.googleVolunteer);
    }
    if (Auth.loggedIn()) {
      setIsLoggedIn(true);
    }
  }, [dataVolunteer, dataCharity, dataGooglev]);

  const isCharity = userData?.isCharity === true;

  if (isCharity)
    return (
      <Disclosure as="nav" className="bg-gray-900 sticky absolute top-0 ">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <UserHamburger />
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src="/assets/logoLite.png"
                      alt="TimeWellSpent"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src="/assets/logoLite.png"
                      alt="TimeWellSpent"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {isLoggedIn
                        ? charityNavigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          ))
                        : charityNavigation.slice(0, 2).map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          ))}
                      {!isLoggedIn &&
                        loggedInNav.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
                {Auth.loggedIn() && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Toggle />
                    <Menu as="div" className="relative ml-3">
                      <div className="flex">
                        {userData?.name && (
                          <span className="mr-2">{userData?.name}</span>
                        )}
                        
                          <img
                          onClick={()=> document.location.replace('/charityprofile')}
                            className="h-10 w-10 rounded-full cursor-pointer"
                            referrerPolicy="no-referrer"
                            src={'/assets/letter-c-svgrepo-com.png'}
                            alt=""
                          />
                        
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Your Profile
                              </Link>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/signout"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                    <p
                      className="hidden sm:flex ml-2 cursor-pointer text-white"
                      onClick={()=>{
                        setIsLoggedIn(false)
                        Auth.logout()}}
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Navbar View in Desktop Mode. CharityNavigation items are mapped over and buttons are generated */}
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {charityNavigation.map((item) => {
                  return (
                    <Disclosure.Button
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    ></Disclosure.Button>
                  );
                })}
                {!isLoggedIn &&
                  loggedInNav.map((item) => {
                    return (
                      <Disclosure.Button
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      ></Disclosure.Button>
                    );
                  })}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  else {
    return (
      <Disclosure as="nav" className="bg-gray-900 sticky absolute top-0">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <UserHamburger />
                </div>

                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src="assets/logoLite.png"
                      alt="TimeWellSpent"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src="assets/logoLite.png"
                      alt="TimeWellSpent"
                    />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {isLoggedIn
                        ? volunteerNavigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          ))
                        : volunteerNavigation.slice(0,2).map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          ))}
                      {!isLoggedIn &&
                        loggedInNav.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                    </div>
                  </div>
                </div>
                <Toggle />
                {Auth.loggedIn() && 
                  <div className="relative inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-2 sm:pr-0">


                    {/* <Toggle /> */}
                    <Menu as="div" className="relative ml-3">
                      <div className="flex">
                        {userData?.name && (
                          <span className="mr-2">{userData?.name}</span>
                        )}
                          <img
                            onClick={()=> document.location.replace('/profile')}
                            className="h-10 w-10 rounded-full cursor-pointer"
                            referrerPolicy="no-referrer"
                            src={userData?.picture ? userData?.picture : '/assets/letter-v-svgrepo-com.png'}
                            alt=""
                          />
                       
                        
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                               
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Your Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                
                                to="/signout"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>



                    <p
                      className="hidden sm:flex ml-2 cursor-pointer text-white"
                      onClick={()=>{
                        setIsLoggedIn(false)
                        Auth.logout()}}
                    >
                      Logout
                    </p>
                  </div>
                }
              </div>
            </div>
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {volunteerNavigation.map((item) => {
                  return (
                    <Disclosure.Button
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    ></Disclosure.Button>
                  );
                })}
                {!isLoggedIn &&
                  loggedInNav.map((item) => {

                    return <Disclosure.Button
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    ></Disclosure.Button>
                  })
                  && <div
                    onClick={() => {
                      setIsLoggedIn(false);
                      Auth.logout();
                    }}
                    className="border-b border-gray-400 my-8 uppercase"
                  >
                    Logout
                  </div>
                }

              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  }
}

export default Navbar;

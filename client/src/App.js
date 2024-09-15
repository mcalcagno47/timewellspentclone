import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import VolunteerSignup from "./pages/VolunteerSignup";
import CharitySignup from "./pages/CharitySignup";
import Navbar from "./components/Navbar";
import EventUpdate from "./pages/EventUpdate";
import Discover from "./pages/Discover";
import NoMatch from "./pages/NoMatch";
import Profile from "./pages/Profile";
import CharityProfile from "./pages/CharityProfile"
import ViewOnlyProfile from "./pages/ViewOnlyProfile"
import EventPage from "./pages/EventPage";
import Footer from "./components/Footer";
import Auth from './utils/auth'
import { useStateContext, useDispatchContext } from "./utils/GlobalState";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import LoginVolunteer from "./pages/LoginVolunteer";
import LoginCharity from "./pages/LoginCharity";
import EventForm from "./pages/EventForm";
import ACTIONS from "./utils/actions";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  const state = useStateContext();
  const dispatch = useDispatchContext();

  //if token is expired or tampered with, the token is destroyed and the user is logged out.
  useEffect(()=>{
    if(Auth.isTokenExpired() || (!Auth.getProfile() && localStorage.getItem('id_token'))){
      dispatch({type: ACTIONS.LOGGED_IN, payload: false});
      Auth.logout();
    }
  },[])
  return (
    <ApolloProvider client={client}>
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main className="main pb-60 pt-10 bg-gray-100 dark:bg-gray-800">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/LoginVolunteer" element={<LoginVolunteer />} />
            <Route path="/LoginCharity" element={<LoginCharity />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/VolunteerSignup" element={<VolunteerSignup />} />
            <Route path="/charitySignup" element={<CharitySignup />} />

            <Route path="/EventForm" element={<EventForm />} />
            <Route path="/event/:id" element ={<EventPage />}/>
            <Route path="/event/edit/:id" element ={<EventUpdate />}/>
            <Route path="/discover" element={<Discover />} />
{/* change back to /profile */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:username" element={<ViewOnlyProfile />} />
            <Route path="/charityprofile" element ={<CharityProfile/>}/>
           
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Router>
      </main>
      <Footer className="footer"/>
    </ApolloProvider>
  );
}

export default App;

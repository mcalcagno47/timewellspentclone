import { gql } from "@apollo/client";

export const LOGIN_VOLUNTEER = gql`
  mutation loginAsVolunteer($username: String!, $password: String!) {
    loginAsVolunteer(username: $username, password: $password) {
      token
      userv {
        _id
        username
      }
    }
  }
`;
export const LOGIN_GOOGLE_VOLUNTEER = gql`
  mutation loginAsGoogleVolunteer($email: String!, $jti: String!) {
    loginAsGoogleVolunteer(email: $email, jti: $jti) {
      token
      googlev {
        _id
        username
        email
        picture
      }
    }
  }
`;

export const LOGIN_CHARITY = gql`
  mutation loginAsCharity($username: String!, $password: String!) {
    loginAsCharity(username: $username, password: $password) {
      token
      userc {
        _id
        username
      }
    }
  }
`;

export const ADD_CHARITY_EVENT = gql`
  mutation addCharityEvent($savedEvents: inputEvent!) {
    addCharityEvent(savedEvents: $savedEvents) {
      _id
      title
      description
      image
      date
      address
      savedCharity
    }
  }
`;

export const ADD_VOLUNTEER_EVENT = gql`
  mutation addVolunteerEvent($eventId: ID!) {
    addVolunteerEvent(eventId: $eventId) {
      _id
      fullName
      username
      email
      skills
      password
      savedEvents{
        _id
        title
        description
        image
        address
        time
        savedCharity
        date
      }
    }
  }
`;
export const ADD_GOOGLE_VOLUNTEER_EVENT = gql`
  mutation addGoogleVolunteerEvent($eventId: ID!) {
    addGoogleVolunteerEvent(eventId: $eventId) {
      _id
      username
      email
      skills
      savedEvents{
        _id
        title
        description
        image
        address
        time
        savedCharity
        date
      }
    }
  }
`;

export const ADD_VOLUNTEER = gql`
  mutation createVolunteer(
    $username: String!
    $password: String!
    $email: String!
    $fullName: String!
    $skills: String
  ) {
    createVolunteer(
      username: $username
      password: $password
      email: $email
      fullName: $fullName
      skills:$skills
    ) {
      userv {
        _id
        username
        email
        fullName
      }
      token
    }
  }
`;
export const ADD_GOOGLE_VOLUNTEER = gql`
  mutation createVolunteer(
    $username: String!
    $email: String!
    $sub: String!
    $jti: String!
    $picture: String!
  ) {
    createGoogleVolunteer(
      username: $username
      email: $email
      sub: $sub
      jti: $jti
      picture: $picture
    ) {
      googlev {
        _id
        username
        email
        jti
        sub
        picture
      }
      token
    }
  }
`;
export const UPDATE_GOOGLE_VOLUNTEER_DESCRIPTION = gql`
  mutation updateGoogleVolunteer($_id: ID!, $user_description: String, $skills: String) {
    updateGoogleVolunteer(_id: $_id, user_description: $user_description, skills: $skills) {
      _id
      user_description
      skills
    }
  }
`;
export const UPDATE_VOLUNTEER_DESCRIPTION = gql`
  mutation updateVolunteerDescription($_id: ID!, $user_description: String, $skills: String) {
    updateVolunteerDescription(_id: $_id, user_description: $user_description, skills: $skills) {
      _id
      user_description
      skills
    }
  }
`;
export const ADD_CHARITY = gql`
  mutation createCharity(
    $username: String!
    $password: String!
    $email: String!
    $websiteURL: String!
  ) {
    createCharity(
      username: $username
      password: $password
      email: $email
      websiteURL: $websiteURL
    ) {
      userc {
        _id
        username
        email
        password
        websiteURL
      }

      token
    }
  }
`;

export const UPDATE_CHARITY = gql`
mutation updateCharityDescription($_id: ID!, $websiteURL:String!, $description:String, $address:String, $facebook:String, $instagram:String, $twitter:String, $phoneNumber:String, $charityName:String, $image: String){
  updateCharity(_id: $_id, websiteURL:$websiteURL, description:$description, address:$address, facebook:$facebook, instagram:$instagram, twitter:$twitter, phoneNumber:$phoneNumber, charityName:$charityName, image: $image){
    _id
    description
    savedEvents{
      _id
      title
      description
      image
      savedCharity
      date
      time
      address
    }
    websiteURL
    description
    address
    facebook
    instagram
    twitter
    phoneNumber
    charityName
  }
}`;
export const REMOVE_CHARITY = gql`
  mutation removeCharity($_id: ID!) {
    removeCharity(_id: $_id) {
      _id
    }
  }
`;

export const REMOVE_VOLUNTEER =gql`
mutation removeVolunteer($_id: ID!){
  removeVolunteer(_id: $_id){
    _id
  }
}
`
export const REMOVE_GOOGLE_VOLUNTEER =gql`
mutation removeGoogleVolunteer($_id: ID!){
  removeGoogleVolunteer(_id: $_id){
    _id
  }
}
`
export const REMOVE_VOLUNTEER_EVENT =gql`
mutation removeVolunteerEvent($eventId: ID!) {
  removeVolunteerEvent(eventId: $eventId) {
    savedEvents{
    _id
    address
    time
    date
    savedCharity
    title
    image
    description
    }
  }
}
`
export const REMOVE_GOOGLE_VOLUNTEER_EVENT =gql`
mutation removeGoogleVolunteerEvent($eventId: ID!) {
  removeGoogleVolunteerEvent(eventId: $eventId) {
    savedEvents{
    _id
    address
    time
    date
    savedCharity
    title
    image
    description
    }
  }
}
`
export const UPDATE_CHARITY_EVENT=gql`
mutation UpdateEvent($id: ID!, $title: String, $description: String, $image: String, $date: String, $time: String, $address: String) {
  updateEvent(_id: $id, title: $title, description: $description, image: $image, date: $date, time: $time, address: $address) {
    title
    description
    image
    date
    time
    address
    _id
  }
}`
export const REMOVE_EVENT = gql`
  mutation RemoveEvent($_id: ID!) {
    removeEvent(_id: $_id) {
      _id
    }
  }
`;

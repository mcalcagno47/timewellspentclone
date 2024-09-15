import { gql } from "@apollo/client";

export const QUERY_VOLUNTEER = gql`
  query volunteer($_id: ID!){
    volunteer(_id: $_id) {
      _id
      fullName
      username
      email
      skills
      savedEvents{
        _id
        title
        description
        date
        savedCharity
        time
        address
        image
      }
      user_description
  }
}
`;

export const QUERY_ALL_EVENTS = gql`
  query AllEvents {
    allEvents {
      _id
      title
      description
      image
      savedCharity
      date
      time
      address
    }
  }
`;

export const QUERY_EVENT = gql`
  query Event($_id: ID!) {
    event(_id: $_id) {
      _id
      title
      description
      image
      savedCharity
      date
      time
      address
    }
  }
`;

export const QUERY_CHARITY = gql`
  query charity($_id: ID) {
    charity(_id: $_id) {
      username
      email
      websiteURL
      description
      address
      facebook
      instagram
      twitter
      phoneNumber
      charityName
      isCharity
      image
      savedEvents{
        _id
        title
        description
        image
        date
        address
      }
    }
  }

`;

export const QUERY_CHARITY_BY_USERNAME = gql`
  query charity($username: String!) {
    charity(username: $username) {
      _id
      email
      savedEvents{
        _id
        title
        description
        image
        date
        address
        savedCharity
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
  }
`;

export const QUERY_GOOGLE_VOLUNTEER = gql`
  query googleVolunteer($_id: ID!) {
    googleVolunteer(_id: $_id) {
      username
      email
      picture
      skills
      savedEvents{
        _id
        title
        image
        description
        time
        address
        date
      }
      user_description
    }
  }
`;





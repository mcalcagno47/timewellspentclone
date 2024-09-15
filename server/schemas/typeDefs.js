const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Auth{
    token:String
    userv: Volunteer
    googlev: GoogleVolunteer
    userc: Charity
}

type Volunteer{
    _id:ID
    fullName:String!
    username:String!
    email:String!
    skills:String
    password:String!
    savedEvents:[Event]
    isCharity:Boolean
    user_description: String
}

type Charity{
    _id:ID
    password:String!
    username:String!
    email:String!
    savedEvents:[Event]
    websiteURL:String!
    description:String
    image:String
    address:String
    facebook:String
    instagram:String
    twitter:String
    phoneNumber:String
    charityName:String
    isCharity:Boolean
}

type Event{
    _id:ID
    title:String
    description:String
    image:String
    date:String
    time:String
    address:String
    savedCharity: String
}

input inputEvent {
    title:String!
    description:String
    image: String
    time:String
    date:String!
    address:String!
    savedCharity: String
}

type GoogleVolunteer{
    _id:ID
    username:String!
    email:String!
    jti:String!
    sub:String!
    picture:String!
    skills: String
    user_description: String
    savedEvents: [Event]
}

type Mutation{
    createVolunteer(username:String!, fullName:String!, email:String!, password:String!, skills:String):Auth
    createGoogleVolunteer(username:String!, email:String!, jti:String!, sub:String!, picture:String!):Auth
    updateGoogleVolunteer(_id: ID!, user_description: String, skills: String):GoogleVolunteer
    updateVolunteerDescription(_id: ID!, user_description:String, skills: String):Volunteer
    createCharity(username:String!, password:String!, email:String!, websiteURL:String!):Auth
    updateCharity(_id:ID!, websiteURL:String!, description:String, address:String, facebook:String, instagram:String, twitter:String, phoneNumber:String, charityName:String, image:String):Charity
    loginAsVolunteer(username: String!, password: String!,):Auth
    loginAsCharity(username: String!, password: String!,):Auth
    loginAsGoogleVolunteer(email: String!, jti: String!):Auth
    addCharityEvent(savedEvents:inputEvent):Event
    addVolunteerEvent(eventId: ID!): Volunteer
    addGoogleVolunteerEvent(eventId: ID!): GoogleVolunteer
    updateVolunteer(_id:ID!,fullName:String!, username:String!, email:String!, skills:String):Volunteer
    updateEvent(_id:ID!,title:String, description:String, image:String, date:String, time:String, address:String):Event
    removeVolunteerEvent(eventId:ID!):Volunteer
    removeGoogleVolunteerEvent(eventId:ID!):GoogleVolunteer
    removeEvent(_id:ID!):Event
    removeVolunteer(_id:ID!):Volunteer
    removeCharity(_id: ID!): Charity
    removeGoogleVolunteer(_id:ID!): GoogleVolunteer
}


  type Query{
    allEvents:[Event]
    event(_id: ID!): Event
    volunteer(_id: ID): Volunteer
    allVolunteers: [Volunteer]!
    charity(_id: ID, username: String): Charity
    allCharity: [Charity]!
    googleVolunteer(_id: ID!): GoogleVolunteer
}
`
module.exports=typeDefs

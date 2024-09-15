const { AuthenticationError } = require("apollo-server-express");
const { Volunteer, Charity, Event, GoogleVolunteer } = require("../models");
const { signToken } = require("../utils/auth");
const { decodeToken } = require("../utils/auth");

const resolvers = {
  Query: {
    allVolunteers: async () => {
      return Volunteer.find();
    },

    volunteer: async (parent, { _id }, context) => {
      return Volunteer.findOne({ _id: _id }).populate("savedEvents");
    },

    allCharity: async () => {
      return Charity.find();
    },
    charity: async (parent, { _id, username }) => {
      return Charity.findOne({
        $or: [{ _id: _id }, { username: username }],
      }).populate("savedEvents");
    },

    allEvents: async () => {
      return Event.find();
    },
    event: async (parent, { _id }) => {
      return Event.findOne({ _id: _id });
    },
    googleVolunteer: async (parent, { _id }, context) => {
      return GoogleVolunteer.findOne({ _id: _id }).populate("savedEvents");
    },
  },

  Mutation: {
    // ---------------------------------- Volunteer Mutations ----------------------------------
    createVolunteer: async function (parent, args) {
      const userv = await Volunteer.create({ ...args, isCharity: false });

      if (!userv) {
        throw new Error("Failed to create volunteer.");
      }
      const token = signToken(userv);
      return { token, userv };
    },

    createGoogleVolunteer: async function (parent, args) {
      try {
        let googlev = await GoogleVolunteer.findOne({ email: args.email });
        if (!googlev)
          googlev = await GoogleVolunteer.create({ ...args, isCharity: false });
        const token = signToken(googlev);
        return {
          token,
          googlev,
        };
      } catch (err) {
        console.log(err);
      }
    },

    updateGoogleVolunteer: async function (parent, args, context) {
      try {
        const googlev = await GoogleVolunteer.findOneAndUpdate(
          {
            _id: args._id,
          },
          {
            $set: { 
              user_description: args.user_description,
              skills: args.skills, 
            },
          },
          {
            new: true,
          }
        );
        if (!googlev) throw new Error("User not found.");
        return { googlev };
      } catch (err) {
        console.log(err);
      }
    },
    updateVolunteerDescription: async function (parent, args, context) {
      try {
        const volunteer = await Volunteer.findOneAndUpdate(
          {
            _id: args._id,
          },
          {
            $set: { 
              user_description: args.user_description,
              skills: args.skills,
            },
          },
          {
            new: true,
          }
        );
        if (!volunteer) throw new Error("User not found.");
        return { volunteer };
      } catch (err) {
        console.log(err);
      }
    },

    addVolunteerEvent: async function (parent, { eventId }, context) {
      try {
        const volunteerId = decodeToken(context.token);
        const volunteer = await Volunteer.findById(volunteerId).populate(
          "savedEvents"
        );
        const event = await Event.findById(eventId);

        if (!volunteer || !event) {
          throw new Error("Volunteer or event not found");
        }

        // Check if the event is already saved
        if (
          !volunteer.savedEvents.some((savedEvent) =>
            savedEvent.equals(eventId)
          )
        ) {
          volunteer.savedEvents.push(eventId);
          await volunteer.save();
        }
        return volunteer;
      } catch (error) {
        console.error("Token error:", error.message); // Log the error message for debugging
        throw new Error("Invalid token");
      }
    },
    addGoogleVolunteerEvent: async function (parent, { eventId }, context) {
      try {
        const volunteerId = decodeToken(context.token);
        const volunteer = await GoogleVolunteer.findById(volunteerId).populate(
          "savedEvents"
        );
        const event = await Event.findById(eventId);

        if (!volunteer || !event) {
          throw new Error("Volunteer or event not found");
        }

        // Check if the event is already saved
        if (
          !volunteer.savedEvents.some((savedEvent) =>
            savedEvent.equals(eventId)
          )
        ) {
          volunteer.savedEvents.push(eventId);
          await volunteer.save();
        }
        return volunteer;
      } catch (error) {
        console.error("Token error:", error.message); // Log the error message for debugging
        throw new Error("Invalid token");
      }
    },
    removeVolunteerEvent: async (parent, { eventId }, context) => {
      const updatedVolunteer = await Volunteer.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedEvents: eventId } },
        { new: true }
      );

      if (!updatedVolunteer) {
        throw new Error("Failed to remove volunteer event");
      }

      return updatedVolunteer;
    },
    removeGoogleVolunteerEvent: async (parent, { eventId }, context) => {
      const updatedVolunteer = await GoogleVolunteer.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedEvents: eventId } },
        { new: true }
      );
      if (!updatedVolunteer) {
        throw new Error("Failed to remove volunteer event");
      }

      return updatedVolunteer;
    },

    updateVolunteer: async function (parent, args) {
      const { _id, fullName, username, email, skills } = args;
      const updateVolunteer = await Volunteer.findByIdAndUpdate(
        _id,
        { fullName, username, email, skills },
        { new: true } // Return the updated document
      );

      if (!updateVolunteer) {
        throw new Error("Volunteer not found");
      }

      return updateVolunteer;
    },
    removeVolunteer: async function (parent, args, context) {
      // Find and remove the event from the Events collection
      const removedVolunteer = await Volunteer.findByIdAndDelete(args._id);
      if (!removedVolunteer) {
        throw new Error("Event not found");
      }
      return removedVolunteer;
    },
    removeGoogleVolunteer: async function (parent, args, context) {
      // Find and remove the event from the Events collection
      const removedGoogleVolunteer = await GoogleVolunteer.findByIdAndDelete(args._id);
      if (!removedGoogleVolunteer) {
        throw new Error("Event not found");
      }


      return removedGoogleVolunteer;
    },

    // ---------------------------------- Charity Mutations ----------------------------------
    addCharityEvent: async function (parent, { savedEvents }, context) {
      try {
        if (!savedEvents.description) {
          throw new Error("Event description is required.");
        }
        if (savedEvents.image !== "") {
          const charity = await Charity.findOne({ _id: context.user._id });
          const newEvent = await Event.create({
            ...savedEvents,
            savedCharity: charity.username,
          });
          const updatedCharity = await Charity.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedEvents: newEvent._id } },
            { new: true, runValidators: true }
          );
          return { updatedCharity, newEvent };
        } else {
          const charity = await Charity.findOne({ _id: context.user._id });
          const newEvent = await Event.create({
            title:savedEvents.title,
            description:savedEvents.description,
            date:savedEvents.date,
            time:savedEvents.time,
            address:savedEvents.address,
           
            savedCharity: charity.username,
          });
          const updatedCharity = await Charity.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedEvents: newEvent._id } },
            { new: true, runValidators: true }
          );
          return { updatedCharity, newEvent };
        }
      } catch (err) {
        console.log(err);
        throw new AuthenticationError("You need to be logged in!");
      }
    },

    updateCharity: async function (parent, args, context) {
      try {
        const userc = await Charity.findOneAndUpdate(
          {
            _id: args._id,
          },

          args,

          {
            new: true,
          }
        );
        if (!userc) throw new Error("User not found.");
        return { userc };
      } catch (err) {
        console.log(err);
      }
    },

    createCharity: async function (parent, args) {
      const userc = await Charity.create({ ...args, isCharity: true });

      if (!userc) {
        throw new Error("Failed to create charity.");
      }
      const token = signToken(userc);
      return { token, userc };
    },
    removeCharity: async (parent, { _id }, context) => {
      // Check if the user is authenticated
      if (context.user) {
        // Find the charity by _id
        const charity = await Charity.findOne({ _id });

        if (!charity) {
          throw new Error("Charity not found");
        }

        // Find and log events to delete
        const eventsToDelete = await Event.find({
          savedCharity: charity.username,
        });
        // Remove all events with the same savedCharity name
        await Event.deleteMany({ savedCharity: charity.username });
        // Remove the charity
        await Charity.findByIdAndDelete(_id);

        // Return the removed charity
        return charity;
      }
      throw new AuthenticationError(
        "You must be logged in to perform this action"
      );
    },
    // ---------------------------------- Authentication Mutations ----------------------------------
    loginAsVolunteer: async function (parent, args) {
      const userv = await Volunteer.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });
      if (!userv) {
        throw new Error("Failed to login as volunteer.");
      }

      const correctPw = await userv.isCorrectPassword(args.password);

      if (!correctPw) {
      }
      const token = signToken(userv);
      return { token, userv };
    },

    loginAsGoogleVolunteer: async function (parent, args) {
      const googlev = await GoogleVolunteer.findOne({ email: args.email });
      if (!googlev) {
        throw new AuthenticationError("Account does not exist");
      }
      const token = signToken(googlev);
      return { token, googlev };
    },

    loginAsCharity: async function (parent, args) {
      const userc = await Charity.findOne({
        $or: [{ username: args.username }, { email: args.email }],
      });
      if (!userc) {
        throw new Error("Failed to login charity.");
      }

      const correctPw = await userc.isCorrectPassword(args.password);

      if (!correctPw) {
      }
      const token = signToken(userc);
      return { token, userc };
    },
    // ---------------------------------- Evnet Mutations -------------------------------------------
    updateEvent: async function (parent, args, context) {
      const { _id, ...updateFields } = args;

      const updatedEvent = await Event.findByIdAndUpdate(
        _id,
        updateFields,
        { new: true } // Return the updated document
      );

      if (!updatedEvent) {
        throw new Error("Event not found");
      }

      return updatedEvent;
    },

    removeEvent: async function (parent, args, context) {
      // Find and remove the event from the Events collection
      const removedEvent = await Event.findByIdAndDelete(args._id);
      if (!removedEvent) {
        throw new Error("Event not found");
      }
      return removedEvent;
    },
  },
};

module.exports = resolvers;

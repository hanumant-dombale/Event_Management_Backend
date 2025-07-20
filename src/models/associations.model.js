// Import models
import User from "./user.model.js";
import Venue from "./venue.model.js";
import Event from "./event.model.js";
import Ticket from "./ticket.model.js";
import Registration from "./registration.model.js";
import Invitation from "./invitation.model.js";
import Feedback from "./feedback.model.js";

import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20;

const applyAssociations = () => {
    Event.belongsTo(User, { foreignKey: "createdBy", as: "creator" });
    Event.belongsTo(Venue, { foreignKey: "venueId" });
    Event.hasMany(Ticket, { foreignKey: "eventId" });
    Event.hasMany(Registration, { foreignKey: "eventId" });
    Event.hasMany(Invitation, { foreignKey: "eventId" });
    Event.hasMany(Feedback, { foreignKey: "eventId" });

    User.hasMany(Event, { foreignKey: "createdBy", as: "createdEvents" });
    User.hasMany(Registration, { foreignKey: "userId" });
    User.hasMany(Invitation, { foreignKey: "senderId" });
    User.hasMany(Feedback, { foreignKey: "userId" });

    Ticket.belongsTo(Event, { foreignKey: "eventId" });
    Ticket.hasMany(Registration, { foreignKey: "ticketId" });

    Registration.belongsTo(User, { foreignKey: "userId" });
    Registration.belongsTo(Event, { foreignKey: "eventId" });
    Registration.belongsTo(Ticket, { foreignKey: "ticketId" });

    Invitation.belongsTo(User, { foreignKey: "senderId" });
    Invitation.belongsTo(Event, { foreignKey: "eventId" });

    Feedback.belongsTo(User, { foreignKey: "userId" });
    Feedback.belongsTo(Event, { foreignKey: "eventId" });
};

export default applyAssociations;

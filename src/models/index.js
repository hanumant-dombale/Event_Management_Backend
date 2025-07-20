import Sequelize from "sequelize";
import sequelize from "../database/connetion.js";

// Import models
import User from "./user.model.js";
import Venue from "./venue.model.js";
import Event from "./event.model.js";
import Ticket from "./ticket.model.js";
import Registration from "./registration.model.js";
import Invitation from "./invitation.model.js";
import Feedback from "./feedback.model.js";

// Assign models to Sequelize instance
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.Venue = Venue;
db.Event = Event;
db.Ticket = Ticket;
db.Registration = Registration;
db.Invitation = Invitation;
db.Feedback = Feedback;

// Apply associations
import applyAssociations from "./associations.model.js";
applyAssociations();

export default db;

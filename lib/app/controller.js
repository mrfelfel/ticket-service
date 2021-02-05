import database from "./database";

/**
 * Create new ticket
 */
function newTicket(req, res) {
  let uid = req.body.uid, // User Id - required
    title = req.body.title, // Ticket title - required
    department = req.body.department,
    strange = req.body.strange,
    message = req.body.message, // Ticket message - required
    attachments = req.body.attachments, // files url
    addtional = req.body.addtional || "";

  if (!uid) {
    return res.status(400).json({ status: false, code: 400, require: "uid" });
  } else if (!title) {
    return res.status(400).json({ status: false, code: 400, require: "title" });
  } else if (!message) {
    return res
      .status(400)
      .json({ status: false, code: 400, require: "message" });
  } else {
    new database.ticket({
      uid,
      title,
      department,
      strange,
      addtional
    })
      .save()
      .then((ticket) => {
        return new database.messages({
          tid: ticket._id,
          uid,
          message,
          attachments,
        }).save();
      })
      .then((message) => {
        res
          .status(200)
          .json({ status: true, code: 200, id: message["tid"] || null });
      })
      .catch((_) => {
        res.status(500).json({ status: false, code: 500 });
      });
  }
}

/**
 * Add new message to the ticket
 */
function newMessage(req, res) {
  let uid = req.body.uid, // User Id - required
    tid = req.body.tid, // Ticket Id - required
    message = req.body.message, // Ticket - message - required
    attachments = req.body.attachments; // files url

  if (!uid) {
    return res.status(400).json({ status: false, code: 400, require: "uid" });
  } else if (!tid) {
    return res.status(400).json({ status: false, code: 400, require: "tid" });
  } else if (!message) {
    return res
      .status(400)
      .json({ status: false, code: 400, require: "message" });
  } else {
    database.ticket
      .findById(tid)
      .exec()
      .then((ticket) => {
        if (ticket == null) {
          res.status(503).json({ status: false, code: 503, ticket: null });
        } else if (ticket["enable"] == false) {
          return database.ticket
            .updateOne({ _id: tid }, { enable: true })
            .exec();
        } else {
          return Promise.resolve();
        }
      })
      .then(() => {
        return new database.messages({ tid, uid, message, attachments }).save();
      })
      .then((message) => {
        res
          .status(200)
          .json({ status: true, code: 200, id: message["tid"] || null });
      })
      .catch((_) => {
        res.status(500).json({ status: false, code: 500 });
      });
  }
}

/**
 * Change status
 */
function changeStatus(req, res) {
  let tid = req.body.tid, // Ticket Id - requried
    status = req.body.status; // Status - True/False

  if (!tid) {
    return res.status(400).json({ status: false, code: 400, require: "tid" });
  } else if (!status) {
    return res
      .status(400)
      .json({ status: false, code: 400, require: "status" });
  } else if (typeof status != "boolean") {
    return res
      .status(400)
      .json({ strange: false, code: 400, bad: "status", type: "boolean" });
  } else {
    database.ticket
      .updateOne({ _id: tid }, { enable: status })
      .exec()
      .then(() => {
        return res.status(200).json({ status: true, code: 200 });
      })
      .catch((_) => {
        res.status(500).json({ status: false, code: 500 });
      });
  }
}

/**
 * Get all user's ticket
 */
function getTicket(req, res) {
  let uid = req.params.uid;

  let object = {};
  if (uid) object["uid"] = uid;

  database.ticket
    .find(object)
    .exec()
    .then((tickets) => {
      return res.status(200).json({ status: true, code: 200, tickets });
    })
    .catch((_) => {
      res.status(500).json({ status: false, code: 500 });
    });
}

/**
 * Get all messages in a ticket
 */
function getMessages(req, res) {
  let tid = req.params.tid;

  database.messages
    .find({ tid })
    .exec()
    .then((messages) => {
      return res.status(200).json({ status: true, code: 200, messages });
    })
    .catch((_) => {
      res.status(500).json({ status: false, code: 500 });
    });
}

function getTicketByID(req, res) {
  let tid = req.params.tid;

  database.ticket
    .findOne({ _id: tid })
    .exec()
    .then((ticket) => {
      return res.status(200).json({ status: true, code: 200, ticket });
    })
    .catch((_) => {
      res.status(500).json({ status: false, code: 500 });
    });
}

export default {
  newTicket,
  newMessage,
  changeStatus,
  getTicket,
  getMessages,
  getTicketByID,
};

import mongoose from "mongoose";

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected successfully!");
  } catch (error) {
    console.log("MongoDB cannot connect.");
    process.exit();
  }
})();

const ticket = mongoose.model(
    "ticket",
    new mongoose.Schema(
      {
        uid: { type: String, required: true }, // user id: ObjectID, username, email, etc..
        title: { type: String, default: null }, // title of user's ticket
        department: { type: String, default: null }, // Witch part of user's ticket
        strange: { type: String, default: null }, // How much this ticket is important, Useing numbers or some things you want.
        enable: { type: Boolean, default: true }, // This ticket is answering or closed
        status: { type: String, default: "WAIT" }, // How much this ticket is important, Useing numbers or some things you want.
        addtional: { type: String, default: "", required: false }, // How much this ticket is important, Useing numbers or some things you want.
      },
      {
        timestamps: true, // Enable created_at and updated_at
      }
    )
  ),
  messages = mongoose.model(
    "message",
    new mongoose.Schema(
      {
        tid: { type: mongoose.Types.ObjectId, ref: "ticket", required: true }, // Ticket Id,
        uid: { type: String, required: true }, // Withch user send this message
        message: { type: String, required: true }, // User's ticket message
        attachments: { type: String, default: null }, // User's file url and you can split urls with special char (Like: "-url-" )
      },
      {
        timestamps: true,
      }
    )
  );

export default { ticket, messages };

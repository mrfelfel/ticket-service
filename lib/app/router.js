import express from 'express';
import controller from './controller';
const router = express.Router();

router.post('/ticket', controller.newTicket); // Create new ticket
router.post('/ticket/message', controller.newMessage); // Add new message to the ticket

router.put('/ticket/status', controller.changeStatus); // Chahnge ticket status (Enable/Disable)

router.get('/ticket', controller.getTicket); // Get all saved tickets
router.get('/ticket/:uid', controller.getTicket); // Get all saved tickets by User Id
router.get('/ticket/:tid/message', controller.getMessages); // Get all saved message by Ticket Id
router.get('/ticket/one/:tid', controller.getTicketByID); // Get all saved message by Ticket Id

export default router;
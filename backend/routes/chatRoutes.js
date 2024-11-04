// routes/chatRoutes.js
import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/chatController.js'; // Change this to getMessages

const router = Router();

router.post('/send', sendMessage); // Route for sending messages
router.get('/:userId/:otherUserId', getMessages); // Route for getting messages

export default router;

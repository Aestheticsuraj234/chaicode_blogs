import { Router } from "express";

const router = Router();

router.get('/users', (req, res) => {
    res.send('User List');
});



export default router;
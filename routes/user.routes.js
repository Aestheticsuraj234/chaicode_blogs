import { Router } from "express";

const router = Router();

router.get('/users', (req, res) => {
    res.send('User List');
});

router.post('/users', (req, res) => {
    res.send('Create User');
});

router.get('/users/:id', (req, res) => {
    res.send(`Get User with ID: ${req.params.id}`);
});

router.put('/users/:id', (req, res) => {
    res.send(`Update User with ID: ${req.params.id}`);
});


export default router;
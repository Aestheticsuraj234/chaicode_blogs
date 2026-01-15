import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');  
});
const PORT = process.env.PORT || 3000;

app.use('/api', (await import('./routes/user.routes.js')).default);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
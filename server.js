const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = 7777;

app.use('/uploads', express.static('uploads'));
app.use('/css', express.static('css'));

function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// noinspection JSUnusedGlobalSymbols
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let tasks = [];

app.get('/', (req, res) => {
    res.render('index', { tasks, filterStatus: req.query.filterStatus });
});

app.get('/api/tasks', (req, res) => {
    const filterStatus = req.query.filterStatus;
    let filteredTasks = tasks;

    if (filterStatus) {
        filteredTasks = tasks.filter(task => task.status === filterStatus);
    }

    res.status(200).json(filteredTasks);
});


app.post('/api/tasks', upload.single('file'), (req, res) => {
    const { title, status, dueDate } = req.body;
    const file = req.file ? req.file.filename : null;
    const id = generateUniqueId();
    tasks.push({ id, title, status, dueDate, file });
    res.status(201).json({ id, title, status, dueDate, file });
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(task => task.id !== id);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
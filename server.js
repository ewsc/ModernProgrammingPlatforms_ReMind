const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = 7777;

app.use('/uploads', express.static('uploads'));
app.use('/css', express.static('css'));


function generateUniqueId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let tasks = [];

app.get('/', (req, res) => {
    const filterStatus = req.query.filterStatus;
    let filteredTasks = tasks;

    if (filterStatus) {
        filteredTasks = tasks.filter(task => task.status === filterStatus);
    }

    res.render('index', { tasks: filteredTasks, filterStatus });
});

app.post('/add-task', upload.single('file'), (req, res) => {
    const { title, status, dueDate } = req.body;
    const file = req.file ? req.file.filename : null;
    const id = generateUniqueId();
    tasks.push({ id, title, status, dueDate, file });
    res.redirect('/');
});

app.post('/delete-task', (req, res) => {
    const { id } = req.body;
    tasks = tasks.filter(task => task.id !== id);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Free Clash of Clans gems => http://localhost:${PORT}`);
});
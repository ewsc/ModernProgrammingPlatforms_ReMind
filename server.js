const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let notes = [];

app.get('/', (req, res) => {
res.render('index', { notes });
});

app.post('/new-note', (req, res) => {
const { title, content } = req.body;
notes.push({ title, content });
res.redirect('/');
});

app.listen(PORT, () => {
console.log(`Сервер запущен на http://localhost:${PORT}`);
});
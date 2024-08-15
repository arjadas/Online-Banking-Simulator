const express = require('express');

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// app.set('views', 'myviews')  -- incase the views folder is named differently

// listen for requests
app.listen(3000);

// the order matters here, if no match, then goes to use.

// middleware and static files that can be accessed by the browser
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {

    const items = [
        { name: 'item 1', description: 'description 1' },
        { name: 'item 2', description: 'description 2' },
    ];

    res.render('about', { title: 'About', items: items });
});

// 404 page
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});
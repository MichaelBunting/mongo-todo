const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const exec = require('child_process').exec;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

const compiler = webpack(webpackConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(webpackDevMiddleware(compiler, {
    hot: false,
    filename: 'bundle.js',
    publicPath: '/',
    stats: {
        colors: true,
    },
    historyApiFallback: true,
}));

app.use(express.static(__dirname + '/www'));

MongoClient.connect('mongodb://localhost:27017/mongo-todo', (err, database) => {
    if (!err) {
        console.dir(`Connected to ${database.databaseName}`);

        const routes = require('./routes')(app, database);

        app.listen(3000, 'localhost', () => {
            console.log('App listening at: http://localhost:3000');
        });
    } else {
        console.error('No connection');
    }
});

// app.post('/quotes', (req, res) => {
//     db.collection('quotes').save(req.body, (err, results) => {
//         if (err)
//             return console.error(err);

//         console.log('saved to db');
//         res.redirect('/');
//     });
// });

// app.get('/', (req, res) => {
//     let quotes = db.collection('quotes').find().toArray();

//     // res.send('/index.html', quotes);
// });
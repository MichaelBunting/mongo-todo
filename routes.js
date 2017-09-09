const RandomGenerator =  require('./testing/RandomGenerator');

function handleError(err) {
    const RED = '\033[0;31m';
    const RESET = '\033[0m';

    console.log(`
        ${RED}Error:
        ${err}${RESET}
    `);
}

module.exports = function(app, db) {
    app.get('/tasks/all', (req, res) => {
        db.collection('tasks').find().toArray()
            .then(tasks => {
                res.send(tasks);
            })
            .catch(err => {
                handleError(err);
            });
    });

    app.get('/tasks/insertRandom', (req, res) => {
        let date = new Date();
        let ampm = date.getHours() > 12 ? 'pm' : 'am';
        let hours = date.getHours() > 12 ? date.getHours() - 12 : (date.getHours() === 0 ? 12 : date.getHours());
        let mins = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        
        let randomItem = {
            name: RandomGenerator.randomSentence(),
            time: `${hours}:${mins} ${ampm}`
        };

        db.collection('tasks').insertOne(randomItem, (err) => {
            if (err)
                handleError(err);
            
            res.send(`
                Inserted random item:
                <pre>
                ${JSON.stringify(randomItem)}
                </pre>
            `)
        });
    });

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/www/index.html');
    })

    app.get('*', (req, res) => {
        res.send('404');
    });
}
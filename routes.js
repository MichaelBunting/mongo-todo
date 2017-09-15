const RandomGenerator =  require('./testing/RandomGenerator');
const ObjectId = require('mongodb').ObjectId;

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

    app.post('/tasks/add', (req, res) => {
        let newTask = {
            name: req.body.taskName,
            time: req.body.taskTime,
            complete: false
        };

        db.collection('tasks').insertOne(newTask, (err, obj) => {
            if (err)
                handleError(err);

            res.json({
                error: false,
                message: `Added task '${newTask.name}' at time '${newTask.time}' with completion of '${newTask.complete}'`,
                newTask: obj.ops[0]
            });
        });
    });

    app.delete('/tasks/delete/:objectId', (req, res) => {
        let query = {
            '_id': ObjectId(req.params.objectId)
        };

        db.collection('tasks').deleteOne(query, err => {
            if (err) 
                handleError(err);

            res.json({
                message: `Deleted item with id '${req.params.objectId}'`,
                taskId: query._id
            });
        });
    });

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/www/index.html');
    })

    app.get('*', (req, res) => {
        res.send('404');
    });
}
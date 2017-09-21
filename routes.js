// const RandomGenerator =  require('./testing/RandomGenerator');

function handleError(err) {
    const RED = '\033[0;31m';
    const RESET = '\033[0m';

    console.log(`
        ${RED}Error:
        ${err}${RESET}
    `);
}

module.exports = {
    init: (app, db) => {
        const TaskController = new (require('./controllers/TaskController'))(db);

        app.get('/tasks/all', TaskController.getAllTasks);
        app.post('/tasks/add', TaskController.addTask);
        app.delete('/tasks/delete/:objectId', TaskController.deleteTask);
        app.put('/tasks/toggleComplete/:id&:complete', TaskController.completeTask);

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/www/index.html');
        });

        app.get('*', (req, res) => {
            res.send('404');
        });
    }
}
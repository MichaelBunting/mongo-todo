const ObjectId = require('mongodb').ObjectId;

class TaskController  {
    constructor(db) {
        this.db = db;

        this.getAllTasks = this.getAllTasks.bind(this);
        this.addTask = this.addTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    handleError(err) {
        const RED = '\x1b[31m';
        const RESET = '\x1b[0m';
    
        console.log(`
            ${RED}Error:
            ${err}${RESET}
        `);
    }

    getAllTasks(req, res) {
        this.db.collection('tasks').find().sort({
                complete: -1
            }).toArray()
            .then(tasks => {
                res.send(tasks);
            })
            .catch(err => {
                this.handleError(err);
            });
    }

    addTask(req, res) {
        let timestamp = new Date();
        
        let newTask = {
            name: req.body.taskName,
            time: req.body.taskTime,
            complete: false,
            created_at: timestamp,
            updated_at: timestamp
        };

        this.db.collection('tasks').insertOne(newTask, (err, obj) => {
            if (err)
                this.handleError(err);

            res.json({
                error: false,
                message: `Added task '${newTask.name}' at time '${newTask.time}' with completion of '${newTask.complete}'`,
                newTask: obj.ops[0]
            });
        });
    }

    deleteTask(req, res) {
        let query = {
            '_id': ObjectId(req.params.objectId)
        };

        this.db.collection('tasks').deleteOne(query, err => {
            if (err) 
                this.handleError(err);

            res.json({
                message: `Deleted item with id '${req.params.objectId}'`,
                taskId: query._id
            });
        });
    }

    completeTask(req, res) {
        let timestamp = new Date();
        let query = {
            '_id': ObjectId(req.params.id)
        };
        let change = {
            $set: {
                complete: req.params.complete
            }
        };

        this.db.collection('tasks').update(query, change, err => {
            if (err)
                this.handleError(err);

            res.json({
                message: `Updated item with id '${req.params.id}' with complete status of '${req.params.complete}'`,
                taskId: req.params.id
            });
        });
    }
};

module.exports = TaskController;
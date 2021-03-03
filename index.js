const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");
const config = require('./conf/db');
//dotenv.config();
app.use("/static",express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
mongoose.connect(config.DB, { useNewUrlParser: true },{ useUnifiedTopology: true }).then(
    () => {console.log('Database is connected')},
    err => { console.log('Can not connect to the database'+ err)}
);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.listen(config.PORT, () => {
    console.log(`Server is running on PORT ${config.PORT}`);
});

// const server = app.listen(3000, function(err) {
//     console.log(
//       "nodejs running url"+ window.location.href
//     );
//   });
  
    app.get("/", (req, res) => {
        console.log("I am here");
        TodoTask.find({}, (err, tasks) => 
        {res.render("todo.ejs", { todoTasks: tasks });
    });
});

app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } 
    catch (err) {
        res.redirect("/");
    }
});

app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => 
    {res.render("todoEdit.ejs", 
    { todoTasks: tasks, idTask: id });
});
}).post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, {
         content: req.body.content 
        }, err => {
            if (err) 
            return res.send(500, err);
            res.redirect("/");
        });
    });

    app.route("/remove/:id").get((req, res) => 
    {const id = req.params.id;
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });


   
const app = require("./app");

app.listen(9090, (error) => {
    if (error) console.log(error);
    console.log("server listening on 9090");
});
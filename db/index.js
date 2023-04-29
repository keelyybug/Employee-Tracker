const connection = require('./connections');

class DB {
    constructor(connection){
        this.connection = connection;
    }

//find all employees, join with roles and departments to display their roles, salaries, departments, and managers
    findAllEmployees(){
        return this.connection.promise().query(

        );
    }







}
module.exports = newDB(connection);
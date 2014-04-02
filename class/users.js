module.exports = {
    database: "",
    init: function(config , database ){
        this.database = database;
    },
    checkUser: function( module_name , module_id , callback ){
        this.database.query("SELECT * FROM module_auth WHERE module_name = '" + module_name + "' AND module_id = '" + module_id + "'",
        function(err, rows, fields) {
            if( rows.length == 0 ){
                
            }
            callback();
        }
         );
    }
}



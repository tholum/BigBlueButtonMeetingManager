module.exports = {
    mysql: require('mysql'),
    connection: null,
    init: function(config){
        this.connection = this.mysql.createConnection({
            host     : config.database.host,
            user     : config.database.username,
            password : config.database.password,
            database : config.database.name
        });

    } , 
    query: function( arg1 , arg2 , arg3 ){
        this.connection.query( arg1 , arg2 , arg3 );
    },
    search: function( table , searchObject , callback ){
        var query = "";
    }
}


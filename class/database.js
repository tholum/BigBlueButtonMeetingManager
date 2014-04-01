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

    }
}


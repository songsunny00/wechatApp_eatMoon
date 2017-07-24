(function() {
    var connection, mysql, settings;

     settings = {
        host:'localhost',
        user     : 'root',
        password : 'root',
        port:'80',
        database : 'wechat'
    }

    connection = null;

    mysql = require('mysql');

    exports.getDbCon = function() {
        var err;
        try {
            if (connection) {
                connection = mysql.createConnection(settings);
                connection.connect();
            } else {
                connection = new mysql.createConnection(settings);
                connection.connect();
            }
        } catch (_error) {
            err = _error;
            throw err;
        }
        return connection;
    };

}).call(this);
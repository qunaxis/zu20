module.exports = {
    "development": {
        "username": "postgres",
        "password": "Diman222319",
        "database": "allservice",
        "host": "localhost",
        "port": 5432,
        "dialect": "postgresql"
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        "username": "qunaxis",
        "password": "Diman222319",
        "database": "as",
        "host": 'rc1b-3to2wlk3cs3kkt0a.mdb.yandexcloud.net',
        "port": 6432,
        "dialect": "postgres",
        "dialectOptions": {
          "ssl": true
        }
    }
}
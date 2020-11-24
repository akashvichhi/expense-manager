import React from 'react';
import { ToastAndroid } from 'react-native';
var SQLite = require("react-native-sqlite-storage");

var DB = SQLite.openDatabase({
  name: "expansemanager",
  location: 'default',
  createFromLocation: "~database/expanse-manager.sqlite"
}, () => console.log("DB connected."), error => console.error(error));

const getFormattedDate = dateObj => {
    const date = dateObj.getDate() <= 9 ? "0" + dateObj.getDate() : dateObj.getDate();
    let month = dateObj.getMonth() + 1;
    if(month <= 9){
        month = "0" + month;
    }
    const year = dateObj.getFullYear();
    return date + "-" + month + "-" + year;
}

const getFormattedTime = dateObj => {
    const hours = dateObj.getHours() <= 9 ? "0" + dateObj.getHours() : dateObj.getHours();
    const minutes = dateObj.getMinutes() <= 9 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
    return hours + ":" + minutes;
}

const getFormattedDateTime = dateObj => getFormattedDate(dateObj) + " " + getFormattedTime(dateObj)

const showToastMessage = (message, long = false) => {
    const duration = long ? ToastAndroid.LONG : ToastAndroid.SHORT;
    ToastAndroid.showWithGravity(message, duration, ToastAndroid.CENTER);
}

class Functions extends React.Component {
    static getFormattedDate = dateObj => getFormattedDate(dateObj)
    static getFormattedTime = dateObj => getFormattedTime(dateObj)
    static getFormattedDateTime = dateObj => getFormattedDateTime(dateObj)

    static addItem = item => new Promise((resolve, reject) => {
        const sql = `INSERT INTO expanses ('amount', 'description', 'date', 'type') VALUES (${item.amount}, '${item.description}', '${item.datetime}', '${item.type}')`;
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                if(results.insertId > 0) {
                    resolve(true);
                }
                reject("Could not save item");
            });
        });
    })

    static showToastMessage = (message, long = false) => showToastMessage(message, long)
}

export default Functions;
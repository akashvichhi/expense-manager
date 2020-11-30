import React from 'react';
import { ToastAndroid } from 'react-native';
var SQLite = require("react-native-sqlite-storage");

var DB = SQLite.openDatabase({
  name: "expansemanager",
  location: 'default',
  createFromLocation: "~database/expanse-manager.sqlite"
}, () => console.log("DB connected."), error => console.error(error));

const getDate = dateObj => {
    const date = dateObj.getDate() <= 9 ? "0" + dateObj.getDate() : dateObj.getDate();
    return date;
}

const getMonth = dateObj => {
    let month = dateObj.getMonth() + 1;
    if(month <= 9){
        month = "0" + month;
    }
    return month;
}

const getFormattedDate = dateObj => {
    const date = getDate(dateObj);
    const month = getMonth(dateObj);
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

const months = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
}

const getDayDates = (dateObj, dateDiff = 0) => {
    if(dateDiff > 0) dateObj.setDate(dateObj.getDate() - dateDiff);

    dateObj.setHours(5, 30, 0, 0);
    let startDate = dateObj.getTime();
    
    dateObj.setHours(29, 30);
    let endDate = dateObj.getTime();
    
    return [startDate, endDate];
}

const getMonthDates = (dateObj, monthDiff = 0) => {
    if(monthDiff > 0) dateObj.setMonth(dateObj.getMonth() - monthDiff);

    dateObj.setDate(1);
    dateObj.setHours(5, 30, 0, 0);
    let startDate = dateObj.getTime();

    dateObj.setMonth(dateObj.getMonth() + 1);
    let endDate = dateObj.getTime();        

    return [startDate, endDate];
}

class Functions extends React.Component {
    static getDate = dateObj => getDate(dateObj)
    static getMonthYear = dateObj => {
        let month = getMonth(dateObj);
        month = months[month];
        let year = dateObj.getFullYear();
        return month + " " + year;
    }
    static getFormattedDate = dateObj => getFormattedDate(dateObj)
    static getFormattedTime = dateObj => getFormattedTime(dateObj)
    static getFormattedDateTime = dateObj => getFormattedDateTime(dateObj)
    static getTodayDates = () => getDayDates(new Date())
    static getYesterdayDates = () => getDayDates(new Date(), 1)
    static getLastWeekDates = () => {
        let date = new Date();
        
        date.setHours(29, 30, 0, 0);
        let endDate = date.getTime();
        
        date.setDate(date.getDate() - 7);
        date.setHours(5, 30);
        let startDate = date.getTime();
        
        return [startDate, endDate];
    }
    static getThisMonthDates = () => getMonthDates(new Date())
    static getLastMonthDates = () => getMonthDates(new Date(), 1)

    static getThisMonthSummary = () => new Promise((resolve) => {
        const [startDate, endDate] = getMonthDates(new Date());
        const sql = "SELECT * FROM expanses WHERE datetime >= '" + startDate + "' AND datetime < '" + endDate + "'";
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                let totalIncome = 0;
                let totalExpanse = 0;
                let totalBalance = 0;

                for(let i = 0; i < (results.rows.length); i++) {
                    let item = results.rows.item(i);
                    if(item.type == "income") {
                        totalIncome += item.amount;
                    }
                    else {
                        totalExpanse += item.amount;
                    }
                }
                totalBalance = totalIncome - totalExpanse;
                resolve({ income: totalIncome, expense: totalExpanse, balance: totalBalance });
            });
        });
    })

    static addItem = item => new Promise((resolve, reject) => {
        // datetime format stored in DB: 'd-m-Y H:i'
        const sql = `INSERT INTO expanses ('amount', 'description', 'month', 'date', 'datetime', 'type') VALUES (${item.amount}, '${item.description}', '${item.month}', '${item.date}', '${item.datetime}', '${item.type}')`;
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                if(results.insertId > 0) {
                    resolve(true);
                }
                reject("Could not save item");
            });
        });
    })

    static getItems = (where = "") => new Promise((resolve) => {
        const sql = "SELECT * FROM expanses" + (where ? " WHERE " + where : "") + " ORDER BY datetime DESC";
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                let items = {};
                for(let i = 0; i < (results.rows.length); i++) {
                    let item = results.rows.item(i);
                    if(item.month in items) {
                        items[item.month].push(item);
                    }
                    else {
                        items[item.month] = [item];
                    }
                }
                resolve(items);
            });
        });
    })

    static getItem = id => new Promise((resolve) => {
        const sql = "SELECT * FROM expanses WHERE id = " + id;
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                const item = results.rows.item(0);
                resolve(item);
            });
        });
    })

    static updateItem = (id, item) => new Promise((resolve) => {
        const sql = `UPDATE expanses SET amount=${item.amount}, description='${item.description}', month='${item.month}', date='${item.date}', datetime='${item.datetime}' WHERE id = ${id}`;
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                resolve(true);
            }, error => {
                console.log(error);
            });
        });
    })

    static deleteItem = id => new Promise((resolve) => {
        const sql = "DELETE FROM expanses WHERE id = " + id;
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                resolve(true);
            });
        });
    })

    static showToastMessage = (message, long = false) => showToastMessage(message, long)
}

export default Functions;
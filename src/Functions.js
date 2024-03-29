import React from 'react';
import { ToastAndroid, PermissionsAndroid } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
var SQLite = require("react-native-sqlite-storage");
var RNFS = require("react-native-fs");

const DOWNLOAD_PATH =  RNFS.ExternalStorageDirectoryPath + "/Expense Manager/";
const TABLE_NAME = "expanses";

const createDownloadPath = () => new Promise((resolve, reject) => {
    RNFS.mkdir(DOWNLOAD_PATH)
        .then(() => resolve(true))
        .catch(error => {
            console.log(DOWNLOAD_PATH)
            console.error(error);
            resolve(false);
        });
});

const askAndroidPermissions = () => new Promise((resolve, reject) => {
    if(Platform.OS === "android")  {   
        const permissions = [
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ];
        PermissionsAndroid.requestMultiple(permissions).then(granted => {
            if(granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED) {
                resolve(true);
            }
            resolve(false);
        }).catch(error => {
            console.error("Error while asking android permissions");
            reject(error);
        });
    }
    else {
        resolve(true);
    }
});

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

const generateHtml = expense => {
    let counter = 1;
    let html = `
        <style type="text/css">
            .main {
                font-family: sans-serif;
                margin: auto;
                width: 720px;
            }
            h2 {
                text-align: center;
            }
            .main-table {
                border: solid 1px;
                border-collapse: collapse;
                font-size: 14px;
                text-align: center;
                width: 100%;
            }
            .main-table td, .main-table th {
                border: solid 1px;
                padding: 8px;
            }
            .main-table th {
                background-color: rgba(170, 170, 170);
            }
            .main-table tbody tr:nth-child(even) {
                background-color: rgba(231, 231, 231);
            }
        </style>

        <div class="main">
            <h2>Expense Manager</h2>
            <table class="main-table">
                <thead>
                    <tr>
                        <th>Sr no.</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Income</th>
                        <th>Expense</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
    `;

    Object.keys(expense).map(date => {
        html += `<tr><td colspan="6" style="font-weight: 600;">${date}</td></tr>`;
        const transaction = expense[date];
        transaction.map(t => {
            html += `
                <tr>
                    <td>${counter++}</td>
                    <td>${getFormattedDate(new Date(Number(t.datetime)))}</td>
                    <td>${getFormattedTime(new Date(Number(t.datetime)))}</td>
                    <td>${t.type == "income" ? t.amount : ""}</td>
                    <td>${t.type == "expense" ? t.amount : ""}</td>
                    <td>${t.description}</td>
                </tr>
            `;
        });
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    return html.trim();
}

const getFilename = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = getMonth(today);
    const date = getDate(today);
    const hours = today.getHours();
    const minutes = today.getMinutes();

    return `EM_${year}_${month}_${date}_${hours}_${minutes}`;
}

const openFile = path => {
    FileViewer.open(path).catch(error => {
        console.error(error);
        showToastMessage("Could not open file " + path);
    })
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
        const sql = "SELECT * FROM " + TABLE_NAME + " WHERE datetime >= '" + startDate + "' AND datetime < '" + endDate + "'";
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                let totalIncome = 0;
                let totalExpense = 0;
                let totalBalance = 0;

                for(let i = 0; i < (results.rows.length); i++) {
                    let item = results.rows.item(i);
                    if(item.type == "income") {
                        totalIncome += item.amount;
                    }
                    else {
                        totalExpense += item.amount;
                    }
                }
                totalBalance = totalIncome - totalExpense;
                resolve({ income: totalIncome, expense: totalExpense, balance: totalBalance });
            });
        });
    })

    static addItem = item => new Promise((resolve, reject) => {
        // datetime format stored in DB: 'd-m-Y H:i'
        const sql = `INSERT INTO ${TABLE_NAME} ('amount', 'description', 'month', 'date', 'datetime', 'type') VALUES (${item.amount}, '${item.description}', '${item.month}', '${item.date}', '${item.datetime}', '${item.type}')`;
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
        const sql = "SELECT * FROM " + TABLE_NAME + "" + (where ? " WHERE " + where : "") + " ORDER BY datetime DESC";
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
        const sql = "SELECT * FROM " + TABLE_NAME + " WHERE id = " + id;
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                const item = results.rows.item(0);
                resolve(item);
            });
        });
    })

    static updateItem = (id, item) => new Promise((resolve) => {
        const sql = `UPDATE ${TABLE_NAME} SET amount=${item.amount}, description='${item.description}', month='${item.month}', date='${item.date}', datetime='${item.datetime}' WHERE id = ${id}`;
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                resolve(true);
            }, error => {
                console.log(error);
            });
        });
    })

    static deleteItem = id => new Promise((resolve) => {
        const sql = "DELETE FROM " + TABLE_NAME + " WHERE id = " + id;
        DB.transaction((tx) => {
            tx.executeSql(sql, [], (tx, results) => {
                resolve(true);
            });
        });
    })

    static showToastMessage = (message, long = false) => showToastMessage(message, long)

    static savePdf = expense => new Promise(async (resolve, reject) => {
        try {
            const granted = await askAndroidPermissions();
            if(granted) {
                await createDownloadPath();
                const html = generateHtml(expense);
                const filename = getFilename();
                const options = {
                    html: html,
                    fileName: filename,
                    directory: "Expense Manager",
                    height: 780,
                    width: 780,
                }
                await RNHTMLtoPDF.convert(options);
                resolve(filename + ".pdf");
            }
            else {
                showToastMessage("Could not save file");
                reject(error);
            }
        }
        catch(error) {
            showToastMessage("Could not save file");
            reject(error);
        }
    })

    static saveCSV = expenses => new Promise((resolve, reject) => {
        askAndroidPermissions().then(async granted => {
            if(granted) {
                await createDownloadPath();
                let csvString = "Sr No,Date,Time,Income,Expense,Description\n";
                // construct csvString
                for(let date in expenses) {
                    let exp = expenses[date];
                    let header = date + "\n";
                    let row = header;
                    exp.forEach((e, i) => {
                        let date = Functions.getFormattedDate(new Date(Number(e.datetime)));
                        let time = Functions.getFormattedTime(new Date(Number(e.datetime)));
                        let income = e.type == "income" ? e.amount : "";
                        let expense = e.type == "expense" ? e.amount : "";
                        row += `${(i+1)},${date},${time},${income},${expense},${e.description}\n`;
                    });
                    csvString += row + "\n";
                }

                const filename = getFilename() + ".csv";
                RNFS.writeFile(DOWNLOAD_PATH + filename, csvString)
                    .then(() => {
                        resolve(filename);
                    })
                    .catch(e => {
                        showToastMessage("Could not save csv file")
                        console.log("Error")
                        reject(e);
                    });
            }
            else {
                showToastMessage("Could not save csv file");
                reject(true);
            }
        }).catch(e => {
            showToastMessage("Could not save csv file"); reject(e)
        });
    })

    static openFile = filename => openFile(DOWNLOAD_PATH + filename)
}

export default Functions;
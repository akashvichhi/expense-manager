import React from 'react';

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

class Functions extends React.Component {
    static getFormattedDate = dateObj => getFormattedDate(dateObj)
    static getFormattedTime = dateObj => getFormattedTime(dateObj)
    static getFormattedDateTime = dateObj => getFormattedDateTime(dateObj)
}

export default Functions;
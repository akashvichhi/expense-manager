import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { Button, Text } from 'native-base';
import DatePicker from '@react-native-community/datetimepicker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Functions from './Functions';

const style = StyleSheet.create({
    form: {
        paddingHorizontal: 10,
        marginTop: 15,
    },
    formRow: {
        marginTop: 15,
    },
    input: {
        borderColor: "#7b7f9c",
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 16,
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
    error: {
        color: "#900",
        fontSize: 14,
        marginTop: 5,
    },
    dateBtn: {
        justifyContent: "flex-start",
        paddingHorizontal: 0,
    },
    dateText: {
        color: "#333",
        paddingLeft: 0,
    },
    icon: {
        color: "#333",
        marginRight: 10,
        marginLeft: 15,
    },
    submit: {
        backgroundColor: "#7b7f9c",
        borderRadius: 5,
    },
});

const ItemForm = ({ type }) => {
    const now = new Date();
    const date = Functions.getFormattedDate(now);
    const time = Functions.getFormattedTime(now);
    const datetime = Functions.getFormattedDateTime(now);

    const [item, setItem] = useState({
        timestamp: now,
        datetime: datetime,
        date: date,
        time: time,
        amount: "",
        description: "",
        type: type == "income" ? "income" : "expanse",
    });

    const emptyItem = () => {
        setItem({
            timestamp: now,
            datetime: datetime,
            date: date,
            time: time,
            amount: "",
            description: "",
            type: type == "income" ? "income" : "expanse",
        });
    }

    const [showDatePicker, setDatePicker] = useState(false);
    const [showTimePicker, setTimePicker] = useState(false);

    const [error, setError] = useState("");

    const handleInput = (key, value) => {
        const temp = item;
        temp[key] = value;
        setItem({ ...temp });
    }

    const setDate = (event, selectedDate) => {
        setDatePicker(false);
        if(event.type == "set") {
            const temp = item;
            temp['timestamp'] = selectedDate;
            temp['date'] = Functions.getFormattedDate(new Date(selectedDate));
            temp['datetime'] = Functions.getFormattedDateTime(new Date(selectedDate));
            setItem({ ...temp });
        }
    }

    const setTime = (event, selectedTime) => {
        console.log(selectedTime);
        setTimePicker(false);
        if(event.type == "set") {
            const temp = item;
            temp['timestamp'] = selectedTime;
            temp['time'] = Functions.getFormattedTime(new Date(selectedTime));
            temp['datetime'] = Functions.getFormattedDateTime(new Date(selectedTime));
            setItem({ ...temp });
        }
    }

    const handleSubmit = () => {
        if(item.amount == "") {
            setError("Please enter amount");
        }
        else {
            setError("");
            Functions.addItem(item).then(() => {
                Functions.showToastMessage("Item saved");
                emptyItem();
            }).catch(error => {
                Functions.showToastMessage(error);
                emptyItem();
            });
        }
    }

    return (
        <View style={style.form}>
            <View>
                <TextInput
                    placeholder="Amount"
                    keyboardType="number-pad"
                    value={item.amount}
                    onChangeText={value => handleInput('amount', value)}
                    style={style.input}
                />
                {error != "" ?
                    <Text style={style.error}>{error}</Text>
                : null}
            </View>
            <View style={style.formRow}>
                {showDatePicker && <DatePicker
                    value={item.timestamp}
                    onChange={setDate}
                />}
                <Button block transparent style={[style.input, style.dateBtn]} onPress={() => setDatePicker(true)}>
                    <Fontisto name="date" size={20} style={style.icon} />
                    <Text uppercase={false} style={style.dateText}>{item.date}</Text>
                </Button>
            </View>
            <View style={style.formRow}>
                {showTimePicker && <DatePicker
                    value={item.timestamp}
                    onChange={setTime}
                    mode="time"
                    display="clock"
                    is24Hour={false}
                />}
                <Button block transparent style={[style.input, style.dateBtn]} onPress={() => setTimePicker(true)}>
                    <Ionicons name="time-outline" size={24} style={[style.icon, { marginRight: 6 }]} />
                    <Text uppercase={false} style={style.dateText}>{item.time}</Text>
                </Button>
            </View>
            <View style={style.formRow}>
                <TextInput
                    placeholder="Description (optional)"
                    value={item.description}
                    onChangeText={value => handleInput('description', value)}
                    numberOfLines={5}
                    multiline
                    textAlignVertical="top"
                    style={style.input}
                />
            </View>
            <View style={style.formRow}>
                <Button block style={style.submit} onPress={handleSubmit}>
                    <Text uppercase={false} style={{ fontSize: 16 }}>Save</Text>
                </Button>
            </View>
        </View>
    )
}

export default ItemForm;

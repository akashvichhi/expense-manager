import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Form, Input, Textarea, Item } from 'native-base';
import DatePicker from '@react-native-community/datetimepicker';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Functions from './Functions';

const style = StyleSheet.create({
    form: {
        paddingHorizontal: 10,
    },
    formItem: {
        borderColor: "#7b7f9c",
        borderRadius: 5,
        marginTop: 15,
    },
    formInput: {
        fontSize: 16,
        paddingLeft: 15,
    },
    noBorder: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
    },
    submitBtn: {
        backgroundColor: "#7b7f9c",
        borderRadius: 5,
        flex: 1,
    },
    submitText: {
        fontSize: 16,
        width: "100%",
        textAlign: "center",
    },
    dateBtn: {
        borderColor: "#7b7f9c",
        borderWidth: 1,
        borderRadius: 5,
        flex: 1,
        justifyContent: "flex-start",
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
    textarea: {
        fontSize: 16,
        paddingLeft: 15,
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
            Functions.showToastMessage("Please enter amount");
        }
        else {
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
            <Form>
                <Item regular style={style.formItem}>
                    <Input
                        placeholder="Amount"
                        onChangeText={value => handleInput('amount', value)}
                        style={style.formInput}
                        value={item.amount}
                    />
                </Item>
                <Item regular style={[style.formItem, style.noBorder]}>
                    {showDatePicker && <DatePicker
                        value={item.timestamp}
                        onChange={setDate}
                    />}
                    <Button block transparent style={style.dateBtn} onPress={() => setDatePicker(true)}>
                        <Fontisto name="date" size={20} style={style.icon} />
                        <Text uppercase={false} style={style.dateText}>{item.date}</Text>
                    </Button>
                </Item>
                <Item regular style={[style.formItem, style.noBorder]}>
                    {showTimePicker && <DatePicker
                        value={item.timestamp}
                        onChange={setTime}
                        mode="time"
                        display="clock"
                        is24Hour={false}
                    />}
                    <Button block transparent style={style.dateBtn} onPress={() => setTimePicker(true)}>
                        <Ionicons name="time-outline" size={24} style={[style.icon, { marginRight: 6 }]} />
                        <Text uppercase={false} style={style.dateText}>{item.time}</Text>
                    </Button>
                </Item>
                <Textarea
                    rowSpan={5} bordered
                    placeholder="Description (optional)"
                    onChangeText={value => handleInput('description', value)}
                    value={item.description}
                    style={[style.formItem, style.textarea]}
                />
                <Item regular style={[style.formItem, style.noBorder]}>
                    <Button style={style.submitBtn} onPress={handleSubmit}>
                        <Text uppercase={false} style={style.submitText}>Save</Text>
                    </Button>
                </Item>
            </Form>
        </View>
    )
}

export default ItemForm;

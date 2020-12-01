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
        borderRadius: 5,
        flex: 1,
    },
    saveBtn: {
        backgroundColor: "#7b7f9c",
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
    trasactionType: {
        marginTop: 10,
    },
});

const ItemForm = ({ type, itemData = {}, editForm = false, navigation = null }) => {
    const now = itemData.datetime ? new Date(Number(itemData.datetime)) : new Date();
    const formattedDate = Functions.getFormattedDate(now);
    const formattedTime = Functions.getFormattedTime(now);
    const monthYear = Functions.getMonthYear(now);
    const date = Functions.getDate(now);

    const [item, setItem] = useState({
        datetime: now.getTime(),
        formattedDate: formattedDate,
        formattedTime: formattedTime,
        month: monthYear,
        date: date,
        amount: itemData.amount ? itemData.amount.toString() : "",
        description: itemData.description ? itemData.description : "",
        type: type == "income" ? "income" : "expense",
    });

    const emptyItem = () => {
        setItem({
            datetime: now.getTime(),
            formattedDate: formattedDate,
            formattedTime: formattedTime,
            month: monthYear,
            date: date,
            amount: "",
            description: "",
            type: type == "income" ? "income" : "expense",
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
            temp['datetime'] = new Date(selectedDate).getTime();
            temp['formattedDate'] = Functions.getFormattedDate(new Date(selectedDate));
            temp['date'] = Functions.getDate(new Date(selectedDate));
            temp['month'] = Functions.getMonthYear(new Date(selectedDate));
            setItem({ ...temp });
        }
    }

    const setTime = (event, selectedTime) => {
        setTimePicker(false);
        if(event.type == "set") {
            const temp = item;
            temp['datetime'] = new Date(selectedTime).getTime();
            temp['formattedTime'] = Functions.getFormattedTime(new Date(selectedTime));
            setItem({ ...temp });
        }
    }

    const handleSubmit = () => {
        if(item.amount == "") {
            Functions.showToastMessage("Please enter amount");
        }
        else {
            if(editForm) {
                Functions.updateItem(itemData.id, item).then(() => {
                    Functions.showToastMessage("Item saved");
                    navigation.goBack();
                }).catch(error => {
                    Functions.showToastMessage(error);
                });
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
    }

    const deleteItem = () => {
        Functions.deleteItem(itemData.id)
            .then(() => {
                Functions.showToastMessage("Item deleted");
                navigation.goBack();
            })
            .catch(error => {
                Functions.showToastMessage(error);
            });
    }

    return (
        <View style={style.form}>
            {editForm && <Text style={style.trasactionType}>Transaction type: {type}</Text>}
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
                        value={item.datetime}
                        onChange={setDate}
                    />}
                    <Button block transparent style={style.dateBtn} onPress={() => setDatePicker(true)}>
                        <Fontisto name="date" size={20} style={style.icon} />
                        <Text uppercase={false} style={style.dateText}>{item.formattedDate}</Text>
                    </Button>
                </Item>
                <Item regular style={[style.formItem, style.noBorder]}>
                    {showTimePicker && <DatePicker
                        value={item.datetime}
                        onChange={setTime}
                        mode="time"
                        display="clock"
                        is24Hour={false}
                    />}
                    <Button block transparent style={style.dateBtn} onPress={() => setTimePicker(true)}>
                        <Ionicons name="time-outline" size={24} style={[style.icon, { marginRight: 6 }]} />
                        <Text uppercase={false} style={style.dateText}>{item.formattedTime}</Text>
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
                    <Button style={[style.submitBtn, style.saveBtn]} onPress={handleSubmit}>
                        <Text uppercase={false} style={style.submitText}>Save</Text>
                    </Button>
                </Item>
                {editForm &&
                    <Item regular style={[style.formItem, style.noBorder]}>
                        <Button danger style={style.submitBtn} onPress={deleteItem}>
                            <Text uppercase={false} style={style.submitText}>Delete</Text>
                        </Button>
                    </Item>
                }
            </Form>
        </View>
    )
}

export default ItemForm;

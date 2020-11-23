import React from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content } from 'native-base';
import ItemForm from './ItemForm';

const style = StyleSheet.create({
    container: {
        backgroundColor: "#eee",
        flex: 1,
    },
});

const Income = ({ navigation, route }) => {
    const addIncome = item => {
        console.log(item);
    }

    return (
        <Container style={style.container}>
            <Content>
                <ItemForm type="income" onSubmit={addIncome} />
            </Content>
        </Container>
    )
}

export default Income;

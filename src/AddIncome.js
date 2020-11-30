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

const Income = () => {
    return (
        <Container style={style.container}>
            <Content>
                <ItemForm type="income" />
            </Content>
        </Container>
    )
}

export default Income;

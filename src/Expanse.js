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

const AddExpanse = ({ navigation, route }) => {
    return (
        <Container style={style.container}>
            <Content>
                <ItemForm type="expanse" />
            </Content>
        </Container>
    )
}

export default AddExpanse;

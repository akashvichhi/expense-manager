import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content } from 'native-base';
import ItemForm from './ItemForm';
import Functions from './Functions';

const style = StyleSheet.create({
    container: {
        backgroundColor: "#eee",
        flex: 1,
    },
});

const EditExpanse = props => {
    const [item, setItem] = useState({});
    
    useEffect(() => {
        const { itemId } = props.route.params;
        Functions.getItem(itemId)
            .then(result => {
                setItem({ ...result });
            })
            .catch(error => console.error(error));
    }, []);


    return (
        <Container style={style.container}>
            <Content>
                {Object.keys(item).length > 0 ? 
                    <ItemForm type={item.type} itemData={item} editForm={true} navigation={props.navigation} />
                : null}
            </Content>
        </Container>
    )
}

export default EditExpanse;

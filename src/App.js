import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Root, Button, Container, Content, Text, Grid, Row, Col } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddIncome from './AddIncome';
import AddExpanse from './AddExpanse';
import EditExpanse from './EditExpanse';
import ViewExpanses from './ViewExpanses';
import Functions from './Functions';

const windowWidth = Dimensions.get("window").width;

const style = StyleSheet.create({
    container: {
        backgroundColor: "#eee",
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    typeExpanse: {
        color: "#f00",
    },
    typeIncome: {
        color: "#008000"
    },
    typeBalance: {
        color: "#debe07"
    },
    itemAmount: {
        textAlign: "right",
    },
    button: {
        backgroundColor: "#7b7f9c",
        borderRadius: 5,
        marginTop: 15,
    },
    buttonText: {
        fontSize: 16,
    },
    header: {
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: "row",
        elevation: 2,
    },
    headerBack: {
        borderRadius: 50,
        padding: 10,
    },
    headerTitle: {
        fontSize: 20,
        padding: 10,
    },
});

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [balance, setBalance] = useState(0);

    const currentMonth = Functions.getMonthYear(new Date());

    const loadSummary = () => {
        Functions.getThisMonthSummary().then(result => {
            setIncome(result.income);
            setExpense(result.expense);
            setBalance(result.balance);
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            loadSummary();
        }, [])
    );
    
    const addIncome = () => {
        navigation.navigate("AddIncome");
    }
    const addExpanse = () => {
        navigation.navigate("AddExpanse");
    }
    const viewTransations = () => {
        navigation.navigate("ViewExpanses");
    }
    return (
        <Container style={style.container}>
            <Content>
                <Text note style={{ marginBottom: 5 }}>Statistics for current month: {currentMonth}</Text>
                <Grid>
                    <Row>
                        <Col>
                            <Text style={[style.typeIncome, style.itemTitle]}>Income</Text>
                        </Col>
                        <Col>
                            <Text style={[style.typeIncome, style.itemAmount]}>{income}</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col>
                            <Text style={[style.typeExpanse, style.itemTitle]}>Expense</Text>
                        </Col>
                        <Col>
                            <Text style={[style.typeExpanse, style.itemAmount]}>{expense}</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 10 }}>
                        <Col>
                            <Text style={[style.typeBalance, style.itemTitle]}>Balance</Text>
                        </Col>
                        <Col>
                            <Text style={[style.typeBalance, style.itemAmount]}>{balance}</Text>
                        </Col>
                    </Row>
                </Grid>
                <View style={style.buttonContainer}>
                    <Button block style={style.button} onPress={addIncome}>
                        <Text uppercase={false} style={style.buttonText}>Add Income</Text>
                    </Button>
                    <Button block style={style.button} onPress={addExpanse}>
                        <Text uppercase={false} style={style.buttonText}>Add Expense</Text>
                    </Button>
                    <Button block style={style.button} onPress={viewTransations}>
                        <Text uppercase={false} style={style.buttonText}>View All Transactions</Text>
                    </Button>
                </View>
            </Content>
        </Container>
    )
}

const App = () => {
    return (
        <Root>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        cardStyleInterpolator:({ current, next, layouts }) => {
                            return {
                                cardStyle: {
                                    transform: [{
                                        translateX: current.progress.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [layouts.screen.width, 0],
                                        }),
                                    },{
                                        scale: next ? 
                                            next.progress.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [1, 0.9],
                                            }) : 1,
                                    }],
                                },
                            };
                        },
                        header: ({ scene, previous, navigation }) => {
                            const { options } = scene.descriptor;
                            const title =
                                options.headerTitle !== undefined
                                ? options.headerTitle
                                : options.title !== undefined
                                ? options.title
                                : scene.route.name;
                            
                            return (
                                <View style={style.header}>
                                    {previous ? 
                                        <TouchableHighlight
                                            underlayColor="#ccc"
                                            onPress={() => navigation.goBack()}
                                            style={style.headerBack}
                                        >
                                            <Ionicons name="arrow-back" size={24} />
                                        </TouchableHighlight>
                                    : null }
                                    <Text style={style.headerTitle}>{title}</Text>
                                </View>
                            );
                        },
                        gestureEnabled: true,
                        gestureDirection: "horizontal",
                        gestureResponseDistance: {
                            horizontal: windowWidth / 2,
                        }
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{
                            title: "Exapense Manager"
                        }}
                    />
                    <Stack.Screen
                        name="AddExpanse"
                        component={AddExpanse}
                        options={{
                            title: "Add Expanse"
                        }}
                    />
                    <Stack.Screen
                        name="AddIncome"
                        component={AddIncome}
                        options={{
                            title: "Add Income"
                        }}
                    />
                    <Stack.Screen
                        name="ViewExpanses"
                        component={ViewExpanses}
                        options={{
                            title: "View Expenses"
                        }}
                    />
                    <Stack.Screen
                        name="EditExpanse"
                        component={EditExpanse}
                        options={{
                            title: "Edit Transaction"
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Root>
    )
}

export default App;

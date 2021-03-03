import React, { useState } from 'react';
import { View, StyleSheet, Modal, ActivityIndicator, Alert } from 'react-native';
import { Container, Content, Text, Button, ListItem, List, Body, Icon, Left, Right, Grid, Row, Col, Footer } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Functions from './Functions';
import { useFocusEffect } from '@react-navigation/native';
import * as XLSX from 'xlsx';

const style = StyleSheet.create({
    container: {
        backgroundColor: "#eee",
        flex: 1,
    },
    sortBtn: {
        backgroundColor: "#808080",
        borderRadius: 0,
    },
    modalContainer: {
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        flex: 1,
        justifyContent: "center",
    },
    modalBlock: {
        backgroundColor: "#fff",
        borderRadius: 5,
        elevation: 3,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        width: 250,
    },
    smallModalBlock: {
        width: 60,
        height: 60,
        justifyContent: "center",
    },
    optionItem: {
        borderBottomWidth: 1,
    },
    option: {
        color: "#222",
        fontSize: 14,
    },
    optionIcon: {
        color: "#333",
        fontSize: 20,
    },
    applyBtn: {
        backgroundColor: "#7b7f9c",
        borderRadius: 0,
    },
    title: {
        backgroundColor: "#7b7f9c",
        color: "#fff",
        fontSize: 16,
        padding: 10,
        marginTop: 5,
    },
    emptyText: {
        marginTop: 10,
        textAlign: "center",
    },
    expensesList: {
        marginTop: 10,
    },
    monthTitle: {
        backgroundColor: "#7b7f9c",
    },
    transaction: {
        borderBottomWidth: 1,
        paddingLeft: 0,
    },
    transactionDateWrap: {
        borderRightWidth: 1,
        borderColor: '#c9c9c9',
    },
    transactionDate: {
        fontSize: 20,
    },
    amountIcon: {
        fontSize: 16,
    },
    typeexpense: {
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
    summary: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    transactionDetailDate: {
        borderRightWidth: 1,
        borderColor: "#c9c9c9",
        justifyContent: "center",
        width: 50,
    },
    footer: {
        height: "auto",
    },
    footerBtn: {
        backgroundColor: "#808080",
        borderRadius: 0,
    },
    secondBtn: {
        borderLeftWidth: 1,
        borderColor: "#fff",
    },
});

const sortOptions = {
    all: "All",
    today: "Today",
    yesterday: "Yesterday",
    lastWeek: "Last 7 Days",
    lastMonth: "Last Month",
    thisMonth: "This Month",
};

const SortOptionsModal = ({ visible, onClose, onApply }) => {
    const options = Object.values(sortOptions);
    const [selectedOption, setSelectedOption] = useState(sortOptions.all);

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={style.modalContainer}>
                <View style={style.modalBlock}>
                    <List>
                        {options.map(o => {
                            return (
                                <ListItem icon noIndent button key={o}
                                    onPress={() => setSelectedOption(o)}
                                    style={style.optionItem}
                                >
                                    <Left style={{ paddingRight: 5 }}>
                                        <Icon name={selectedOption == o ? "check-circle" : "circle-thin"} type="FontAwesome" style={style.optionIcon} />
                                    </Left>
                                    <Body>
                                        <Text style={style.option}>{o}</Text>
                                    </Body>
                                </ListItem>
                            )
                        })}
                    </List>
                    <Button block style={style.applyBtn} onPress={() => onApply(selectedOption)}>
                        <Text uppercase={false}>Apply</Text>
                    </Button>
                </View>
            </View>
        </Modal>
    )
}

const Renderexpenses = ({ expenses, selectedDateRange, editExpense }) => {
    let totalIncome = 0;
    let totalexpense = 0;
    let totalBalance = 0;

    // count total income, expense and balance
    Object.keys(expenses).map(date => {
        const transaction = expenses[date];
        transaction.map(t => {
            if(t.type == "income") {
                totalIncome += t.amount;
            }
            else {
                totalexpense += t.amount;
            }
        });
    });

    totalBalance = totalIncome - totalexpense;

    const dateRangeText = selectedDateRange == sortOptions.all ? "" : " for " + selectedDateRange;

    return (
        <>
            <Text style={style.title}>All transactions{dateRangeText}</Text>
            <Grid style={style.summary}>
                <Row>
                    <Col>
                        <Text style={[style.typeIncome, style.itemTitle]}>Total Income</Text>
                    </Col>
                    <Col>
                        <Text style={[style.typeIncome, style.itemAmount]}>{totalIncome}</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col>
                        <Text style={[style.typeexpense, style.itemTitle]}>Total expense</Text>
                    </Col>
                    <Col>
                        <Text style={[style.typeexpense, style.itemAmount]}>{totalexpense}</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: 10 }}>
                    <Col>
                        <Text style={[style.typeBalance, style.itemTitle]}>Total Balance</Text>
                    </Col>
                    <Col>
                        <Text style={[style.typeBalance, style.itemAmount]}>{totalBalance}</Text>
                    </Col>
                </Row>
            </Grid>
            {Object.keys(expenses).length > 0 ?
                <List style={style.expensesList}>
                    {Object.keys(expenses).map(monthYear => {
                        const transactions = expenses[monthYear];
                        return (
                            <React.Fragment key={monthYear}>
                                <ListItem itemDivider style={style.monthTitle}>
                                    <Text style={{ color: "#fff" }}>{monthYear}</Text>
                                </ListItem>
                                {transactions.map(t => {
                                    return (
                                        <ListItem key={t.datetime} noIndent style={style.transaction}>
                                            <Body>
                                                <Row>
                                                    <Col style={style.transactionDetailDate}>
                                                        <Text style={style.transactionDate}>{t.date}</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text style={t.type == 'expense' ? style.typeexpense : style.typeIncome}>
                                                            <Icon
                                                                name="rupee"
                                                                type="FontAwesome"
                                                                style={[style.amountIcon, t.type == 'expense' ? style.typeexpense : style.typeIncome ]}
                                                            /> {t.amount}
                                                        </Text>
                                                        <Text note>{t.description}</Text>
                                                    </Col>
                                                </Row>
                                            </Body>
                                            <Right>
                                                <Button
                                                    transparent icon
                                                    style={style.transactionAction}
                                                    onPress={() => editExpense(t.id)}
                                                >
                                                    <Icon name="edit" type="Feather" style={{ color: "#808080" }} />
                                                </Button>
                                            </Right>
                                        </ListItem>
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}
                </List>
            :
                <Text style={style.emptyText}>No expenses</Text>
            }
        </>
    )
}

const Viewexpenses = ({ navigation }) => {
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState(sortOptions.all);
    const [screenLoading, setScreenLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [expenses, setExpenses] = useState({});

    const loadItems = (sort = sortOptions.all) => {
        let startDate = "";
        let endDate = "";
        let where = "";

        switch (sort) {
            case sortOptions.today:
                [startDate, endDate] = Functions.getTodayDates();
                break;
            case sortOptions.yesterday:
                [startDate, endDate] = Functions.getYesterdayDates();
                break;
            case sortOptions.lastWeek:
                [startDate, endDate] = Functions.getLastWeekDates();
                break;
            case sortOptions.lastMonth:
                [startDate, endDate] = Functions.getLastMonthDates();
                break;
            case sortOptions.thisMonth:
                [startDate, endDate] = Functions.getThisMonthDates();
                break;
        }
        
        if(startDate != "" && endDate != "") {
            where = "datetime >= '" + startDate + "' AND datetime < '" + endDate + "'";
        }
        
        Functions.getItems(where).then(result => {
            setExpenses(result);
            setLoading(false);
        }).catch(error => {
            setLoading(false);
            console.error(error);
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            setSelectedOption(sortOptions.all);
            loadItems(selectedOption);
        }, [])
    );

    const applyOption = option => {
        setShowSortOptions(false);
        loadItems(option);
        setSelectedOption(option);
    }

    const editExpense = id => navigation.navigate("EditExpense", { itemId: id })

    const savePdf = () => {
        setScreenLoading(true);
        Functions.savePdf(expenses)
            .then(filename => {
                setScreenLoading(false);
                Alert.alert(
                    "Expense Manager",
                    "File Downloaded as " + filename,
                    [{
                        text: "Ok",
                    },{
                        text: "Open",
                        onPress: () => Functions.openFile(filename),
                    }],
                    { cancelable: true }
                );
            })
            .catch(error => console.error(error))
    }

    const saveCSV = () => {
        setScreenLoading(true);
        Functions.saveCSV(expenses).then(filename => {
            setScreenLoading(false);
            Alert.alert(
                "Expense Manager",
                "File Downloaded as " + filename,
                [{
                    text: "Ok",
                },{
                    text: "Open",
                    onPress: () => Functions.openFile(filename),
                }],
                { cancelable: true }
            );
        }).catch(e => {
            setScreenLoading(false);
            console.log(e);
        });
    }

    return (
        <Container style={style.container}>
            {screenLoading && 
                <Modal
                    visible={true}
                    transparent={true}
                    onRequestClose={() => { setScreenLoading(false) }}
                >
                    <View style={style.modalContainer}>
                        <View style={[style.modalBlock, style.smallModalBlock]}>
                            <ActivityIndicator color="#7b7f9c" size="large" />
                        </View>
                    </View>
                </Modal>
            }
            <View style={style.header}>
                <Button block style={style.sortBtn} onPress={() => setShowSortOptions(true)}>
                    <FontAwesome name="sort" size={16} color="#fff" />
                    <Text uppercase={false} style={{ fontSize: 16, paddingLeft: 6, }}>Sort</Text>
                </Button>
            </View>
            <Content>
                <SortOptionsModal
                    visible={showSortOptions}
                    onClose={() => setShowSortOptions(false)}
                    onApply={applyOption}
                />
                {!loading ?
                    <Renderexpenses
                        expenses={expenses}
                        selectedDateRange={selectedOption}
                        editExpense={editExpense}
                    />
                : <View style={{ marginTop: 15 }}><ActivityIndicator color="#000" /></View>}
            </Content>
            <Footer style={style.footer}>
                <Body>
                    <Row>
                        <Col>
                            <Button block style={style.footerBtn} onPress={savePdf}>
                                <Text uppercase={false}>Save as PDF</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button block style={[style.footerBtn, style.secondBtn]} onPress={saveCSV}>
                                <Text uppercase={false}>Save as CSV</Text>
                            </Button>
                        </Col>
                    </Row>
                </Body>
            </Footer>
        </Container>
    )
}

export default Viewexpenses;

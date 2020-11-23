/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import MainApp from './src/App';

// var SQLite = require("react-native-sqlite-storage");

// var DB = SQLite.openDatabase({
//   name: "expansemanager",
//   location: 'default',
//   createFromLocation: "~database/expanse-manager.sqlite"
// }, () => console.log("DB connected."), error => console.error(error));


const App =() => {
	// // const sql = "INSERT INTO expanses ('amount', 'description', 'date', 'type') VALUES (50, 'Test entry', '22/11/2020', 'expanse');";
	// const sql = "SELECT * FROM expanses";
	// DB.transaction((tx) => {
	//   tx.executeSql(sql, [], (tx, results) => {
	//     const data = results.rows.item(0);
	//     for(let i = 0; i < results.rows.length; i++) {
	//       const item = results.rows.item(i);
	//       console.log(item);
	//     }
	//   });
	// });
	return (
		<>
			<StatusBar barStyle="dark-content" />
			<SafeAreaView style={{ flex: 1 }}>
				<MainApp />
			</SafeAreaView>
		</>
	);
}

export default App;

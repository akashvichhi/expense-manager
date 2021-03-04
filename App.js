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

const App =() => {
	return (
		<>
			<StatusBar backgroundColor="#808080" barStyle="light-content" />
			<SafeAreaView style={{ flex: 1 }}>
				<MainApp />
			</SafeAreaView>
		</>
	);
}

export default App;

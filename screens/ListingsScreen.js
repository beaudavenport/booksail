import React from 'react';
import { Text, Button, View } from 'react-native';
import { AuthSession } from 'expo';
import config from '../config';

export default class ListingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  state = {
    tokenResult: null,
  };

 handleLogin = () => {
   AuthSession.startAsync({
     authUrl: config.authUrl,
   }).then((result) => {
     this.setState({ tokenResult: result });
   });
 }

 render() {
   return (
     <View>
       <Text>Sign in with Ebay to get started</Text>
       <Button title="Sign in" onPress={this.handleLogin} />
       <Text>{JSON.stringify(this.state.tokenResult)}</Text>
     </View>
   );
 }
}

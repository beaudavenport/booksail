import React from 'react';
import { Text, Button, ScrollView } from 'react-native';
import { AuthSession } from 'expo';
import config from '../config';

export default class ListingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  state = {
    requestTokenResult: null,
    accessToken: null,
    refreshToken: null,
  };

 handleLogin = () => {
   AuthSession.startAsync({
     authUrl: config.authUrl,
   }).then((requestTokenResponse) => {
     console.log({ requestTokenResponse });
     this.setState({ requestTokenResult: requestTokenResponse.params.code });
     return fetch(config.accessTokenUrl, {
       headers: {
         code: requestTokenResponse.params.code,
       },
     });
   }).then(accessTokenResponse => accessTokenResponse.json())
     .then((accessTokenResult) => {
       console.log({ accessTokenResult });
       this.setState({
         accessToken: accessTokenResult.access_token,
         refreshToken: accessTokenResult.refresh_token,
       });
     })
     .catch((err) => {
       console.log(err);
     });
 }

 refreshToken = () => {
   fetch(config.refreshTokenUrl, {
     headers: {
       rfToken: this.state.refreshToken,
     },
   }).then(refreshTokenResponse => refreshTokenResponse.json())
     .then((refreshTokenResult) => {
       console.log({ refreshTokenResult });
       this.setState({ accessToken: refreshTokenResult.access_token });
     })
     .catch((err) => {
       console.log(err);
     });
 }

 render() {
   return (
     <ScrollView>
       <Text>Sign in with Ebay to get started</Text>
       <Button title="Sign in" onPress={this.handleLogin} />
       <Text>{JSON.stringify(this.state.requestTokenResult)}</Text>
       <Text>{JSON.stringify(this.state.accessToken)}</Text>
       <Text>{JSON.stringify(this.state.refreshToken)}</Text>
       <Button title="Call to refresh" onPress={this.refreshToken} />
     </ScrollView>
   );
 }
}

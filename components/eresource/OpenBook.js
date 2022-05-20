import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Linking,
} from 'react-native';

import {WebView} from 'react-native-webview';

import {Appbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
// import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class OpenBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      booktitle: '',
      fullpage: '',
    };
  }

  async componentDidMount() {
    const Booktitle = JSON.parse(await AsyncStorage.getItem('Booktitle'));
    const fullurl = JSON.parse(await AsyncStorage.getItem('fulltexturl'));
    console.log('fulltexturl : ', fullurl, 'Booktitle : ', Booktitle);

    this.setState({
      booktitle: Booktitle,
      fullpage: fullurl,
    });

    console.log(this.state.fullpage);
    this.openBrower();

    
  }

  openBrower() {
    Linking.openURL(`${this.state.fullpage}`);
  }

  getnextUrl(url){
    console.log('url : ',url.url)
    // if(this.state.fullpage != url  ){
    //   this.webref.stopLoading()
    // }
  }

  render() {
    return (
      <View style={styles.container} animation="fadeInUpBig">
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="close-sharp" color="#05375a" size={25} />
          </TouchableOpacity>

          <Appbar.Content title={this.state.booktitle} />
        </Appbar.Header>

        <>
          <View style={{width: '100%', height: '100%'}}>
            <WebView
              setSupportMultipleWindows={true}
              source={{uri: `${this.state.fullpage}`}}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              setJavaScriptCanOpenWindowsAutomatically={true}
              thirdPartyCookiesEnabled={true}
              injectedJavaScript={INJECTED_JAVASCRIPT}
              onMessage={onMessage}
              ref={r=>(this.webref= r)}
              onNavigationStateChange={this.getnextUrl}
              onLoadStart={() =>
                this.setState({
                  loader: true,
                })
              }
              onLoadEnd={() =>
                this.setState({
                  loader: false,
                })
              }
            />
          </View>
        </>

        {this.state.loader && (
          <View style={styles.activityIndicatorStyle}>
            <ActivityIndicator color="#57A3FF" size="large" />
          </View>
        )}
      </View>
    );
  }
}

const INJECTED_JAVASCRIPT = `(function() {
  const tokenLocalStorage = window.localStorage.getItem('userId');
  window.ReactNativeWebView.postMessage(tokenLocalStorage);
})();`;

const onMessage = (payload, async) => {
  console.log('payload', payload);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityIndicatorStyle: {
    flex: 1,
    position: 'absolute',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    // elevation: 3,
  },
  ttl: {
    backgroundColor: '#fff',
  },
});

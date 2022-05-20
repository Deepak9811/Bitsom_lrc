import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';

import {WebView} from 'react-native-webview';

import {Appbar} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class OpacNext extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      pageUrl: '',
      opacNextAuthor: 'Open Public Access Catalog',
      showpage: true,
    };
  }

  async componentDidMount() {
    const da = JSON.parse(await AsyncStorage.getItem('opacNext'));
    const opacNextAutho = JSON.parse(
      await AsyncStorage.getItem('opacNextAuthor'),
    );
    console.log('data : ', da, opacNextAutho);

    if (da !== null && opacNextAutho !== null) {
      console.log('null');
      this.state.pageUrl = da;
      this.state.opacNextAuthor = opacNextAutho;
      this.setState({
        showpage: true,
      });
    } else {
      this.setState({
        message: 'Sorry, the requested page is not available',
        showpage: false,
      });
    }
  }

  render() {
    return (
      <>
      <Appbar.Header style={styles.ttl}>
              <TouchableOpacity
                style={{paddingLeft: '2%'}}
                onPress={() => this.props.navigation.goBack()}>
                <AntDesign name="arrowleft" color="#05375a" size={25} />
              </TouchableOpacity>

              <Appbar.Content title={this.state.opacNextAuthor} />
            </Appbar.Header>
        {this.state.showpage ? (
          <View style={styles.container}>
            

            <>
              <View style={{width: '100%', height: '100%'}}>
                <WebView
                  source={{
                    uri: `http://65.1.153.238/cgi-bin/koha/opac-detail.pl?biblionumber=${this.state.pageUrl}`,
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
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
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={
                {
                  fontSize:16,
                }
              }>
              {this.state.message}
            </Text>
          </View>
        )}
      </>
    );
  }
}

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

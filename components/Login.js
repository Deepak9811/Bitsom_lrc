import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
// import * as Animatable from 'react-native-animatable';
import {Appbar} from 'react-native-paper';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  ClientId:
    '48774575517-o9j0crni6shsal3jnoerm1o19pdqkg05.apps.googleusercontent.com',
  // offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGoogleInfo: {},
      image: '',
      email: '',
      name: '',
      loader: false,
    };
  }

  signIn = async () => {
    this.setState({loader: true});
    try {
      // console.warn('hello');
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // this.setState({ userInfo });
      // await AsyncStorage.clear()
      await AsyncStorage.setItem('image', JSON.stringify(userInfo.user.photo));
      await AsyncStorage.setItem('name', JSON.stringify(userInfo.user.name));
      await AsyncStorage.setItem('email', JSON.stringify(userInfo.user.email));

      const eimage = JSON.parse(await AsyncStorage.getItem('email'));
      // console.log("eimage : ",eimage)

      this.setState({
        userGoogleInfo: userInfo,
        image: userInfo.user.photo,
        email: userInfo.user.email,
        name: userInfo.user.name,
      });
      if (eimage !== null) {
        // this.props.navigation.push('Home');
        this.getUserAllData();
        console.log(eimage);
      } else {
        console.log('helo');
      }

      // console.log('user name =>', userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.warn('SIGN IN CANCELLED', error.message);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.warn('IN PROGRESS', error.message);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.warn('play services not available or outdated', error.message);
      } else {
        console.warn('Meassage', error.message);
        this.setState({
          loader:false
        })
      }
    }
  };

  getUserAllData() {
    fetch(
      `http://65.1.153.238:8080/cgi-bin/koha/svc/report?name=LIBCON-PATINFO&userid=libcon&password=Admin@123&sql_params=${this.state.email}`,
      {
        method: 'GET',
        headers: {
          Accepts: 'application/json',
          'content-type': 'application/json',
        },
      },
    )
      .then(result => {
        result.json().then(async resp => {
          console.log(resp)
          if (resp.length !== 0) {
            await AsyncStorage.setItem('userId', JSON.stringify(resp[0][0]));
            await AsyncStorage.setItem('sName', JSON.stringify(resp[0][2]));
            await AsyncStorage.setItem('sNameLast', JSON.stringify(resp[0][3]));

            const sname = JSON.parse(await AsyncStorage.getItem('email'));
            console.log('resp : ', sname);
            this.setState({
              loader: false,
            });
            this.props.navigation.push('Home');
          }else{
            alert('No user found.')
            this.setState({
              loader: false,
            });
          }
        });
      })
      .catch(error => {
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>
          <Appbar.Content title="Welcome!" />
        </Appbar.Header>

        {/* <StatusBar backgroundColor="#009387" barStyle="light-content"/> */}
        {/* <View style={styles.header}>
          <Text style={styles.text_header}> Welcome! </Text>
        </View> */}

        {this.state.loader ? (
          <>
            <View
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                elevation: 4,
                backgroundColor: 'rgba(0,0,0,0.2)',
              }}></View>
            <View
              style={{
                flex: 1,
                width: '100%',
                position: 'absolute',
                elevation: 5,
                top: '50%',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="large" color="#0d6efd" />
            </View>
          </>
        ) : null}

        <View style={{flex: 1}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.footer}>
              <Text style={styles.text_footer}> Mobile </Text>
              <View style={styles.action}>
                <FontAwesome name="mobile" color="#BDBDBD" size={25} />

                <TextInput
                  returnKeyType="next"
                  placeholder="Your Mobile"
                  style={styles.textInput}
                  maxLength={10}
                  keyboardType="numeric"
                  // onChangeText={val => this.textInputchange(val)}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.push('VerifyNum')}>
                <LinearGradient
                  colors={['#f68823', '#b03024']}
                  style={styles.signIn}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#fff',
                      },
                    ]}>
                    Verify
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.signIn()}
                style={{marginTop: 50, marginBottom: 30}}
                // onPress={() => this.props.navigation.push('Home')}
              >
                <View style={styles.google}>
                  <View style={styles.googleStyle}>
                    <View style={{marginRight: '5%'}}>
                      <Image
                        source={require('./image/google.png')}
                        style={{width: 30, height: 30}}
                      />
                    </View>
                    <Text style={styles.googleFontStyle}>Google</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* <GoogleSigninButton onPress={() => this.signIn()} /> */}

              {/* <Text style={{margin: '5%'}}>email : {this.state.email}</Text>
              <Text style={{margin: '5%'}}>name : {this.state.name}</Text>
              <Image
                style={{width: 320, height: 300}}
                source={{uri: this.state.image}}
              /> */}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    // backgroundColor: '#ddd',
    // flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 5,
    backgroundColor: '#fff',
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    // color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  google: {
    textAlign: 'left',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f68823',
  },
  googleStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: '4%',
    // paddingBottom: '4%',
    height: 50,
  },
  googleFontStyle: {fontSize: 16, fontWeight: 'bold', color: '#ea4235'},
  ttl: {
    backgroundColor: '#ffffff',
  },
});
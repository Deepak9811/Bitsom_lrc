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
  ToastAndroid,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Picker as SelectPicker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BcryptReactNative from 'bcrypt-react-native';
import {API_URL} from '@env';
import {windowHeight} from './utils/Dimensions';

import {authorize, refresh, AuthConfiguration} from 'react-native-app-auth';
import {AuthConfig} from './microsoft/AuthConfig';
import moment from 'moment';
// import {GraphManager} from './microsoft/GraphManager';
// import {User} from '@microsoft/microsoft-graph-types';

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//   webClientId:
//     '842785997270-q7jqk66e76ctb8qrh1l7fmcoqgv483j3.apps.googleusercontent.com',
//   offlineAccess: true,
//   // forceCodeForRefreshToken: true,
// });

// const config: AuthConfiguration = {
//   clientId: AuthConfig.appId,
//   redirectUrl: 'graph-tutorial://react-native-auth/',
//   scopes: AuthConfig.appScopes,
//   additionalParameters: {prompt: 'select_account'},
//   serviceConfiguration: {
//     authorizationEndpoint:
//       'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
//     tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
//   },
// };

export default class LogInNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      pass: '',
      purposeValue: '',
      purposeIndexValue: '',
      terminalData: [],
      check_textInputChange: false,
      secureTextEntry: true,
      loader: false,
      showPage: false,
      userData: '',
      other_LogIN: false,
    };
  }

  // signIn = async () => {
  //   this.setState({loader: false});
  //   try {
  //     console.warn('hello :- ',await GoogleSignin.hasPlayServices());
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();

  //     this.setState({
  //       userGoogleInfo: userInfo,
  //       email: userInfo.user.email,
  //       other_LogIN: true,
  //       loaderGoogle: true,
  //     });
  //     if (this.state.email !== null) {
  //       await AsyncStorage.setItem("googleSignTrue",JSON.stringify(true))
  //       this.getUserAllData();
  //     } else {
  //       console.log('helo');
  //     }

  //     console.log('user name =>', userInfo.user.email);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //       console.warn('SIGN IN CANCELLED', error.message);
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //       console.warn('IN PROGRESS', error.message);
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //       console.warn('play services not available or outdated', error.message);
  //     } else {
  //       ToastAndroid.showWithGravity(
  //         'Something went wrong. Please try again',
  //         ToastAndroid.LONG,
  //         ToastAndroid.CENTER,
  //       );
  //       alert(error.message);
  //       console.warn('Meassage', error.message);
  //     }
  //   }
  // };

  textInputchange(val) {
    if (val.length !== 0) {
      this.setState({
        email: val,
        check_textInputChange: true,
      });
    } else {
      this.setState({
        email: val,
        check_textInputChange: false,
      });
    }
  }

  handlePasswordChange(val) {
    this.setState({
      password: val,
    });
  }

  updateSecureTextEntry() {
    this.setState({
      secureTextEntry: false,
    });
  }

  async componentDidMount() {
    const email = JSON.parse(await AsyncStorage.getItem('email'));
    console.log('email : ', email," api :- ",`${API_URL}`);
    if (email !== null) {
      this.props.navigation.navigate('Home');
    } else {
      this.setState({
        showPage: true,
      });
    }
  }

  onPickerValueChange = (value, index, label) => {
    this.setState({
      purposeValue: value,
      // purposeName: this.state.terminalData[index].p_name,
    });
  };

  check() {
    if (this.state.email === '' || this.state.pass === '') {
      console.log(this.state.pass);
      Alert.alert('', 'Please enter your account details to login.');
    } else if (this.state.email !== '' && this.state.pass !== '') {
      console.log(this.state.pass);
      this.getUserAllData();
    } else {
      Alert.alert('', 'Please enter your correct account details to login.');
    }
  }

  getUserAllData() {
    if (
      this.state.loaderMicrosoft === true ||
      this.state.loaderGoogle === true
    ) {
      this.setState({loader: false});
    } else {
      this.setState({loader: true});
    }
    // console.log(this.state.email, this.state.pass, this.state.purposeValue);

    let emails = this.state.email;

    fetch(`${API_URL}LIBCON-PATINFO&parameter=${emails}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(async resp => {
          // console.log('resp : ', resp.data.response[0]);
          if (resp.status === 'success') {
            if (resp.length !== 0) {
              if (this.state.other_LogIN === true) {
                if (this.state.email === resp.data.response[0][4]) {
                  try {
                    await AsyncStorage.setItem(
                      'userId',
                      JSON.stringify(resp.data.response[0][0]),
                    );
                    await AsyncStorage.setItem(
                      'sName',
                      JSON.stringify(resp.data.response[0][2]),
                    );
                    await AsyncStorage.setItem(
                      'sNameLast',
                      JSON.stringify(resp.data.response[0][3]),
                    );
                    await AsyncStorage.setItem(
                      'email',
                      JSON.stringify(resp.data.response[0][4]),
                    );

                    this.setState({
                      userData: resp.data.response[0],
                    });

                    this.props.navigation.push('Home');
                  } catch (error) {
                    console.log('try : ', error);
                  }
                } else {
                  let key = 'googleSignTrue'
                  await AsyncStorage.removeItem(key)
                  Alert.alert(
                    '',
                    'Please enter your correct account details to login.',
                    [{text: 'Okay'}],
                    {cancelable: true},
                  );
                  this.setState({
                    loader: false,
                    loaderMicrosoft: false,
                    loaderGoogle: false,
                    other_LogIN: false,
                  });
                }
              } else {
                this.setState({
                  other_LogIN: false,
                });

                try {
                  let key = 'googleSignTrue'
                  await AsyncStorage.removeItem(key)
                  
                  await AsyncStorage.setItem(
                    'userId',
                    JSON.stringify(resp.data.response[0][0]),
                  );
                  await AsyncStorage.setItem(
                    'sName',
                    JSON.stringify(resp.data.response[0][2]),
                  );
                  await AsyncStorage.setItem(
                    'sNameLast',
                    JSON.stringify(resp.data.response[0][3]),
                  );
                } catch (error) {
                  console.log('try : ', error);
                }

                const sname = resp.data.response[0][4];
                // console.log('resp : ', sname);

                if (this.state.email === sname) {
                  try {
                    const salt = await BcryptReactNative.getSalt(10);
                    const hash = (salt, resp.data.response[0][5]);
                    const isSame = await BcryptReactNative.compareSync(
                      this.state.pass,
                      hash,
                    );

                    if (isSame === true) {
                      await AsyncStorage.setItem(
                        'email',
                        JSON.stringify(resp.data.response[0][4]),
                      );

                      this.setState({
                        userData: resp.data.response[0],
                      });

                      this.props.navigation.push('Home');
                    } else {
                      Alert.alert(
                        '',
                        'Please enter your correct account details to login.',
                        [{text: 'Okay'}],
                        {cancelable: true},
                      );
                      this.setState({
                        loader: false,
                        other_LogIN: false,
                        loaderGoogle: false,
                        loaderMicrosoft: false,
                      });
                    }

                    this.setState({
                      loader: false,
                      other_LogIN: false,
                      loaderGoogle: false,
                      loaderMicrosoft: false,
                    });
                  } catch (e) {
                    console.log({e});
                  }
                } else {
                  Alert.alert(
                    '',
                    'Please enter your correct account details to login.',
                    [{text: 'Okay'}],
                    {cancelable: true},
                  );
                  this.setState({
                    loader: false,
                    other_LogIN: false,
                    loaderGoogle: false,
                    loaderMicrosoft: false,
                  });
                }
              }
            }
          } else {
            // await GoogleSignin.revokeAccess();
            // await GoogleSignin.signOut();
            this.setState({
              loader: false,
              other_LogIN: false,
              loaderGoogle: false,
              loaderMicrosoft: false,
            });
            Alert.alert(
              '',
              'Please enter your correct account details to login.',
              [{text: 'Okay'}],
              {cancelable: true},
            );
            // ToastAndroid.show(
            //   'Please enter your correct account details to login.',
            //   ToastAndroid.LONG,
            //   ToastAndroid.CENTER,
            // );
          }
        });
      })
      .catch(error => {
        ToastAndroid.show(
          'There has been a problem with your fetch operation. Please try again',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
        this.setState({
          loader: false,
          loaderMicrosoft: false,
          loaderGoogle: false,
        });
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
      });

    // setTimeout(() => {
    //   console.log(this.state.userData.length);
    //   if (this.state.userData.length > 0) {
    //     console.log('null');
    //   } else {
    //     ToastAndroid.showWithGravity(
    //       'ERROR: API Not Reachable. There seemed to be an error while reaching the server, please try again some time later.',
    //       ToastAndroid.LONG,
    //       ToastAndroid.CENTER,
    //     );
    //     this.setState({
    //       loader: false,
    //     });
    //   }
    // }, 9000);
  }

  // microsoftLogIn = async () => {
  //   try {
  //     let key = 'googleSignTrue'
  //     console.log("clear : - ",await AsyncStorage.removeItem(key))
  //     this.setState({loaderMicrosoft: true});
  //     const result = await authorize(config);
  //     // console.log('result :- ', result);

  //     await AsyncStorage.setItem('userToken', result.accessToken);
  //     await AsyncStorage.setItem('refreshToken', result.refreshToken);
  //     await AsyncStorage.setItem(
  //       'expireTime',
  //       result.accessTokenExpirationDate,
  //     );
  //     const user: User = await GraphManager.getUserAsync();
  //     // console.log('result :- ', result);
  //     this.setState({
  //       email: user.userPrincipalName,
  //       other_LogIN: true,
  //     });
  //     this.getUserAllData();
  //     console.log(user.userPrincipalName);
  //   } catch (error) {
  //     this.setState({loaderMicrosoft: false});
  //     console.log('error :- ', error);
  //   }
  // };

  render() {
    return (
      <>
        {this.state.showPage ? (
          <View style={styles.container}>
            <StatusBar backgroundColor="#fff9" barStyle="dark-content" />

            <View
              style={{
                justifyContent: 'center',
                flex: 1,
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 5,
              }}>
              <Image source={require('./image/bitsom.png')} />
            </View>

            {/* {this.state.loader ? (
              <>
                <View
                  style={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    elevation: 3,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  }}></View>
                <View
                  style={{
                    flex: 1,
                    width: '100%',
                    position: 'absolute',
                    elevation: 3,
                    top: '50%',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#0d6efd" />
                </View>
              </>
            ) : null} */}

            <Animatable.View
              style={[styles.footer,{flex:2.5}]}
              animation="fadeInUpBig"
              duration={1000}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  {/* --------Email-------------------- */}

                  <View>
                    <Text style={[styles.text_footer, {marginTop: 20}]}>
                      {' '}
                      Email{' '}
                    </Text>
                    <View style={styles.action}>
                      <FontAwesome name="user-o" color="#05375a" size={20} />

                      <TextInput
                        returnKeyType="next"
                        placeholder="Your Email"
                        placeholderTextColor="#7F7F7F"
                        keyboardType="email-address"
                        style={styles.textInput}
                        value={this.state.email}
                        onChangeText={val => {
                          this.textInputchange(val);
                          this.setState({
                            email: val.trim(),
                          });
                        }}
                      />
                      {this.state.check_textInputChange ? (
                        <Animatable.View animation="bounceIn">
                          <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                          />
                        </Animatable.View>
                      ) : null}
                    </View>
                  </View>

                  {/* ------------Password------------- */}
                  <Text style={[styles.text_footer, {marginTop: 20}]}>
                    Password
                  </Text>
                  <View style={styles.action}>
                    <Feather name="lock" color="#05375a" size={20} />

                    <TextInput
                      secureTextEntry={
                        this.state.secureTextEntry ? true : false
                      }
                      placeholderTextColor="#7F7F7F"
                      returnKeyType="next"
                      placeholder="Your Password"
                      style={styles.textInput}
                      value={this.state.pass}
                      onChangeText={val => {
                        this.handlePasswordChange(val);
                        this.setState({
                          pass: val,
                        });
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => this.updateSecureTextEntry()}>
                      {this.state.secureTextEntry ? (
                        <Feather name="eye-off" color="grey" size={20} />
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.setState({
                              secureTextEntry: true,
                            })
                          }>
                          <Feather name="eye" color="green" size={20} />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    disabled={this.state.loader ? true : false}
                    style={styles.button}
                    onPress={() => this.check()}>
                    <LinearGradient
                      colors={['#f68823', '#b03024']}
                      style={styles.signIn}>
                      {!this.state.loader ? (
                        <Text
                          style={[
                            styles.textSign,
                            {
                              color: '#fff',
                            },
                          ]}>
                          Sign In
                        </Text>
                      ) : (
                        <ActivityIndicator size="large" color="#fff" />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* <View style={styles.orBorder}></View> */}
                  {/* <View style={styles.or}>
                    <Text>OR</Text>
                  </View> */}

                  {/* <TouchableOpacity
                    onPress={() => this.signIn()}
                    style={[
                      styles.buttonContainer,
                      {backgroundColor: '#f5e7ea'},
                    ]}>
                    <View style={styles.iconWrapper}>
                      <FontAwesome
                        style={styles.icon}
                        name={'google'}
                        size={22}
                        color={'#de4d41'}
                      />
                    </View>
                    <View>

                      {!this.state.loaderGoogle ? (
                        <View
                          style={{
                            marginLeft: '27%',
                            justifyContent: 'center',
                            marginTop: '2%',
                          }}>
                          <Text style={[styles.buttonText, {color: '#de4d41'}]}>
                            Log In With Google
                          </Text>
                        </View>
                      ) : (
                        <View style={{marginLeft: '45%'}}>
                          <ActivityIndicator size="large" color="#de4d41" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity> */}

                  {/* <View>
          <GoogleSigninButton onPress={() => this.signIn()} />
        </View> */}

                  {/* <TouchableOpacity
                    onPress={() => this.microsoftLogIn()}
                    style={[
                      styles.buttonContainer,
                      {
                        backgroundColor: '#0078d4',
                        marginTop: '5%',
                        // marginBottom: '30%',
                      },
                    ]}>
                    <View style={styles.iconWrapper}>
                      <Fontisto
                        style={styles.icon}
                        name={'microsoft'}
                        size={20}
                        color={'#fff'}
                      />
                    </View>
                    <View style={[styles.btnTxtWrapper]}>
                      {!this.state.loaderMicrosoft ? (
                        <View style={{marginLeft: '19%'}}>
                          <Text style={[styles.buttonText, {color: '#fff'}]}>
                            Log In With Microsoft
                          </Text>
                        </View>
                      ) : (
                        <View style={{marginLeft: '-9%'}}>
                          <ActivityIndicator size="large" color="#fff" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity> */}

                  <View
                    style={{
                      paddingHorizontal: 5,
                      paddingVertical: 15,
                      position:"relative",
                      marginTop: windowHeight / 3,
                      // bottom:0
                    }}>
                    <TouchableOpacity
                      onPress={() => Linking.openURL('https://libcon.in/')}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text>Powered by</Text>
                      <Text style={{color: '#f68823'}}> LIBCON</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </Animatable.View>
          </View>
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
  },
  text_header: {
    color: '#fff',
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
    borderBottomColor: '#f68823',
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
    marginTop: 30,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    height: windowHeight / 15,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 3,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  iconWrapper: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontWeight: 'bold',
  },

  btnTxtWrapper: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  or: {
    position: 'relative',
    left: '45%',
    top: -11,
    backgroundColor: '#fff',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orBorder: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: '10%',
  },
});

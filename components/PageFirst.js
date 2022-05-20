import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  StatusBar,
  ActivityIndicator
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  ClientId:
    '48774575517-o9j0crni6shsal3jnoerm1o19pdqkg05.apps.googleusercontent.com',
  // offlineAccess: true,
  forceCodeForRefreshToken: true,
});

export default class PageFirst extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPage: false,
      userGoogleInfo: {},
      image: '',
      email: '',
      name: '',
      loader: false,
    };
  }

  async componentDidMount() {
    const email = JSON.parse(await AsyncStorage.getItem('email'));
    if (email !== null) {
      this.props.navigation.navigate('Home');
    } else {
    this.setState({
      showPage: true,
    });
    }
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
      <>
        {this.state.showPage ? (
          <View style={styles.container}>
            <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
            <View style={styles.imageCen}>
              <Image source={require('./image/bitsom.png')} />

              <Text style={{fontSize: 17, color: '#003f5c', marginTop: '5%'}}>
                Greeting from Learning Resource Center
              </Text>
            </View>

            {this.state.loader ? (
          <>
            <View
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                elevation: 1,
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
        ) : null}

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 14, color: '#6b6b6b'}}>
                Let’s personalise this space by click on Proceed
              </Text>
            </View>

            <View style={styles.info}>
              <TouchableOpacity
                onPress={() => this.signIn()}
                style={{marginTop: 10, marginBottom: 30}}
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
            </View>

            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 5,
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
        ) : null}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {height: '100%', width: '100%', backgroundColor: '#fff'},
  imageCen: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    flex: 1,

    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    marginTop: 10,
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
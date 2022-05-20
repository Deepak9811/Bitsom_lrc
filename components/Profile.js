import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Appbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
// import * as Animatable from 'react-native-animatable';
import RenderHtml from 'react-native-render-html';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import { windowHeight } from './utils/Dimensions';

export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userEmail: 'NaN',
      validUpto: 'NaN',
      userData: [],
      userMemberShip: 'NaN',
      userPrimaryPhone: 'NaN',
      // userSecondaryPhone: 'NaN',
      fine: '0.00',
      userAddress: 'India',
      userDOB: '00/00/0000',
      userGender: 'Gender',
      emailUser: [],
      loader: true,
      image: require('./image/cat.jpg.png'),
      visibleImage1New: false,
      showpage: true,
      name: '',
      email: '',
      id: '',
    };
  }

  async componentDidMount() {
    try {
      console.log('profile data :- ', this.props.route.params.profileData);
      const email = JSON.parse(await AsyncStorage.getItem('email'));
      const userId = JSON.parse(await AsyncStorage.getItem('userId'));
      const sName = JSON.parse(await AsyncStorage.getItem('sName'));
      const sNameLast = JSON.parse(await AsyncStorage.getItem('sNameLast'));

      this.setState({
        name: sName + ' ' + sNameLast,
        id: userId,
        email: email,
      });
      this.userDetails();
      // console.log('email : ', this.state.name);
    } catch (error) {
      console.log('There has problem in AsyncStorage : ' + error.message);
    }
  }

  userDetails() {
    console.log('email : ', this.state.email);
    fetch(`${API_URL}LIBCON-PATINFO&parameter=${this.state.email}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          // console.log('userAddress : ', resp.data.response[0][2]);

          if (resp.length !== 0) {
            this.setState({
              userData: resp.data.response[0],
              userName:
                resp.data.response[0][2] + ' ' + resp.data.response[0][3],
              userEmail: resp.data.response[0][4],
              userMemberShip: resp.data.response[0][1],
              validFrom: resp.data.response[0][7],
              validUpto: resp.data.response[0][8],
              userPrimaryPhone: resp.data.response[0][6],
              fine: resp.data.response[0][12],
              visibleImage1New: true,
              image: resp.data.response[0][13],
              userDOB: resp.data.response[0][10],
              userAddress: resp.data.response[0][11],
              userGender: resp.data.response[0][9],
              loader: false,
            });
          } else {
            this.setState({
              loader: false,
            });
            ToastAndroid.showWithGravity(
              'Something wents wrong.',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
        });
      })
      .catch(error => {
        this.setState({
          loader: false,
        });
        // Alert.alert('Error', error.message, [{text: 'Okay'}],{cancelable:true});
        console.log(this.state.userData.length);
        if (this.state.userData.length > 0) {
          console.log('null');
        } else {
          this.setState({
            message: 'Something went wrong. Please try again.',
            showpage: false,
            loader: false,
          });
        }
      });

    setTimeout(() => {
      console.log(this.state.userData.length);
      if (this.state.userData.length > 0) {
        console.log('null');
      } else {
        this.setState({
          message: 'Sorry, the requested page is not available',
          showpage: false,
          loader: false,
        });
      }
    }, 10000);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>
          <Appbar.Content title="Your Profile Details" />
        </Appbar.Header>

        {!this.state.loader ? (
          <View style={{flex: 1}}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}>
              {this.state.showpage ? (
                <View style={{flex: 1}}>
                  {/* ===============INFO======================= */}
                  <View style={{margin: '5%'}}>
                    <View style={styles.uDetail}>
                      <Text style={styles.uNme}>Hello</Text>
                      <Text style={styles.uNme}>{this.state.userName}</Text>

                      {/* <Text style={{marginTop: 10, color: '#8A8A8A'}}>
                        Welcome to Learning Resource Center, BITSoM
                      </Text> */}

                      <RenderHtml
                        contentWidth={{width: 100}}
                        source={{
                          html: `${this.props.route.params.profileData}`,
                        }}
                      />
                    </View>

                    {/* ==============IMAGE==================== */}
                    <View style={styles.profImgage}>
                      <Image
                        source={
                          this.state.visibleImage1New
                            ? {
                                uri: `data:${this.state.mime};base64,${this.state.image}`,
                              }
                            : require('./image/cat.jpg.png')
                        }
                        style={[styles.shadows,{height: windowHeight/3, width: 320,borderRadius:5}]}
                      />
                    </View>

                    <LinearGradient
                      colors={['#f7f6ff', '#eff3fe']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Username :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <Feather name="user" color="#191919" size={20} />
                          </View>
                          <View>
                            <Text style={styles.fillDetails}>
                              {this.state.userName}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Email===================== */}
                    <LinearGradient
                      colors={['#eff7ee', '#eff7ee']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Email Id :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <MaterialCommunityIcons
                              name="email-outline"
                              color="#77aa69"
                              size={20}
                            />
                          </View>

                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#77aa69'}]}>
                              {this.state.userEmail}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Membership id====================== */}

                    <LinearGradient
                      colors={['#fce5e5', '#f5ddde']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Membership Id :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <Feather
                              name="user-check"
                              color="#e1495e"
                              size={20}
                            />
                          </View>
                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#e1495e'}]}>
                              {this.state.userMemberShip}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Fine ===================== */}
                    <LinearGradient
                      colors={['#f7f6ff', '#eff3fe']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Fine :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <FontAwesome
                              name="rupee"
                              color="#191919"
                              size={20}
                            />
                          </View>
                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#191919'}]}>
                              {this.state.fine}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Date Of Birth====================== */}
                    <LinearGradient
                      colors={['#fff6e7', '#fff6e7']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Date Of Birth :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <AntDesign
                              name="calendar"
                              color="#da8d0b"
                              size={20}
                            />
                          </View>
                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#da8d0b'}]}>
                              {this.state.userDOB}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Gender====================== */}
                    <LinearGradient
                      colors={['#f7fcff', '#f7fcff']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Gender :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <Feather name="user" color="#3860cc" size={20} />
                          </View>

                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#3860cc'}]}>
                              {this.state.userGender}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Address===================== */}
                    <LinearGradient
                      colors={['#f7f6ff', '#f7f6ff']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Address :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <Fontisto
                              name="world-o"
                              color="#969697"
                              size={20}
                            />
                          </View>
                          <View style={{width: '87%'}}>
                            <Text
                              style={[styles.fillDetails, {color: '#969697'}]}>
                              {this.state.userAddress}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Primary Phone====================== */}
                    <LinearGradient
                      colors={['#eff7ee', '#eff7ee']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Primary Phone :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <AntDesign name="phone" color="#77aa69" size={20} />
                          </View>
                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#77aa69'}]}>
                              {this.state.userPrimaryPhone}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Secondary Phone====================== */}
                    {/* <LinearGradient
                    colors={['#fce5e5', '#f5ddde']}
                    style={[styles.commonGradient,styles.shadows]}>
                    <View style={{marginBottom: '4%'}}>
                      <Text style={styles.text_footer}>Secondary Phone :</Text>

                      <View style={styles.editInfo}>
                        <View style={styles.iconC}>
                          <AntDesign name="phone" color="#e1495e" size={20} />
                        </View>
                        <View>
                          <Text
                            style={[styles.fillDetails, {color: '#e1495e'}]}>
                            {this.state.userSecondaryPhone}
                          </Text>
                        </View>
                        
                      </View>
                    </View>
                  </LinearGradient> */}

                    {/* ================Valid from====================== */}
                    <LinearGradient
                      colors={['#fff6e7', '#fff6e7']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Valid from :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <AntDesign
                              name="calendar"
                              color="#da8d0b"
                              size={20}
                            />
                          </View>
                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#da8d0b'}]}>
                              {this.state.validFrom}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ================Valid Upto====================== */}
                    <LinearGradient
                      colors={['#f7f6ff', '#eff3fe']}
                      style={[styles.commonGradient,styles.shadows]}>
                      <View style={{marginBottom: '4%'}}>
                        <Text style={styles.text_footer}>Valid Upto :</Text>

                        <View style={styles.editInfo}>
                          <View style={styles.iconC}>
                            <AntDesign
                              name="calendar"
                              color="#191919"
                              size={20}
                            />
                          </View>
                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#191919'}]}>
                              {this.state.validUpto}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* ============================================== */}
                    <View style={{marginTop: '5%'}}>
                      <Text style={{color: '#8A8A8A'}}>
                        These details are taken from your existing Profile with
                        the Library. In case you need to update them, please
                        contact the helpdesk at the Library.
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    // flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('./image/reading.png')}
                    style={{padding: 5, height: 250, width: 300, marginTop: 10}}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'red',
                      marginTop: 20,
                      textAlign: 'center',
                    }}>
                    {this.state.message}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.activityIndicatorStyle}>
            <ActivityIndicator color="#57A3FF" size="large" />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffffff'},
  ttl: {
    backgroundColor: '#ffffff',
  },
  text_footer: {
    color: '#BDBDBD',
    fontSize: 16,
    marginBottom: '2%',
    marginTop: 5,
  },
  fillDetails: {
    flexDirection: 'row',
    fontSize: 17,
    color: '#0B0B0B',
    marginBottom: '3%',
  },
  rightIcon: {
    marginTop: 4,
    flex: 1,
    width: '100%',
  },
  rightM: {
    textAlign: 'right',
    marginRight: 20,
  },
  editInfo: {
    flexDirection: 'row',
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
  commonGradient: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 10,

    // borderRadius: 10,
    
  },
  iconC: {
    marginTop: 3,
    marginRight: 10,
  },
  uDetail: {
    marginBottom: 10,
  },
  uNme: {
    fontSize: 30,
  },
  profImgage: {
    width: '100%',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
  },

  shadows:{
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  }
});

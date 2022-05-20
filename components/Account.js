import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {Appbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '@env';
import RenderHtml from 'react-native-render-html';

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      validUpto: 'NaN',
      userData: [],
      userMemberShip: 'NaN',
      userGender: 'Gender',
      currentIssued: [],
      oldIssued: [],
      loader: true,
      showCurrentBook: false,
      showOldBook: false,
      email: '',
      name: '',
      id: '',
      mssage: '',
      pmssage: '',
    };
  }

  async componentDidMount() {
    try {
      console.log('account data :- ', this.props.route.params.accountData);
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
      console.log('email : ', this.state.name);
    } catch (error) {
      console.log('There has problem in AsyncStorage : ' + error.message);
    }
  }

  userDetails() {
    console.log(`${API_URL}`)
    fetch(`${API_URL}LIBCON-PATINFO&parameter=${this.state.email}`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          console.log('userDetails : ', resp);
          this.currentIssuedBook();
          this.oldIssuedBook();
          this.setState({
            userData: resp.data.response[0],
            userName: resp.data.response[0][2] + ' ' + resp.data.response[0][3],
            userMemberShip: resp.data.response[0][1],
            validFrom: resp.data.response[0][7],
            validUpto: resp.data.response[0][8],
            // loader: false,
          });

        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          loader: false,
          showpage: false,
          message: 'Something went wrong. Please try again.',
        });
      });
  }

  currentIssuedBook() {
    console.log('check id:0------------', this.state.id);
    fetch(`${API_URL}LIBCON-ISSUED&parameter=${this.state.id}`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          if (resp.status === 'success') {
            if (resp.data.response.length > 0) {
              this.setState({
                currentIssued: resp.data.response,
              });
            }
          } else {
            this.setState({
              mssage: 'There has no current issued books.',
              showEmpty: true,
            });
          }
        });
      })
      .catch(error => {
        this.setState({
          loader: false,
        });
        Alert.alert('Error', error, [{text: 'Okay'}], {cancelable: true});
      });
  }

  oldIssuedBook() {
    console.log(this.state.id);
    fetch(`${API_URL}LIBCON-OLDISSUED&parameter=${this.state.id}`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          if (resp.status === 'success') {
            if (resp.data.response.length > 0) {
              this.setState({
                oldIssued: resp.data.response,
              });
            }
          } else {
            this.setState({
              pmssage: 'There has no previously issued books.',
              showEmpty: true,
              loader: false,
            });
          }
        });
      })
      .catch(error => {
        this.setState({
          loader: false,
        });
        Alert.alert('Error', error, [{text: 'Okay'}], {cancelable: true});
      });

    setTimeout(() => {
      console.log(
        'this.state.userData.length :----',
        this.state.userData.length,
      );
      if (this.state.userData.length > 0) {
        this.setState({
          showpage: true,
          loader: false,
        });
      } else {
        this.setState({
          message: 'Sorry, the requested page is not available',
          showpage: false,
          loader: false,
        });
      }
    }, 8000);
  }

  showCBook() {
    this.setState((prevState)=>({
      showCurrentBook: !prevState.showCurrentBook
    }))
    // this.setState({showCurrentBook: true});
  }

  HideCBook() {
    this.setState({showCurrentBook: false});
  }

  showOldBooks() {
    this.setState((prevState)=>({
      showOldBook: !prevState.showOldBook
    }))
    // this.setState({showOldBook: true});
  }

  HideOldBook() {
    this.setState({showOldBook: false});
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
          <Appbar.Content title="Your Account Details" />
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
                          html: `${this.props.route.params.accountData}`,
                        }}
                      />
                    </View>

                    {/* ================Membership id====================== */}

                    <LinearGradient
                      colors={['#fce5e5', '#f5ddde']}
                      style={styles.commonGradient}>
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

                    {/* ================Valid Upto====================== */}
                    <LinearGradient
                      colors={['#f7f6ff', '#eff3fe']}
                      style={styles.commonGradient}>
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

                    {/* ================Current Issued Books====================== */}
                    <LinearGradient
                      colors={['#f7fcff', '#f7fcff']}
                      style={[styles.commonGradient]}>
                      <View>
                        {/* <Text style={styles.text_footer}>Current Issued Books :</Text> */}

                        <TouchableOpacity
                          onPress={() => this.showCBook()}
                          style={[
                            styles.editInfo,
                            {marginTop: '5%', marginBottom: '5%'},
                          ]}>
                          <View style={styles.iconC}>
                            <AntDesign name="book" color="#3860cc" size={20} />
                          </View>
                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#3860cc'}]}>
                              Current Issued Books
                            </Text>
                          </View>
                          {this.state.showCurrentBook ? (
                            <TouchableOpacity
                              style={styles.rightIcon}
                              onPress={() => this.HideCBook()}>
                              <Feather
                                name="chevron-up"
                                color="#5ec6e9"
                                size={25}
                                style={styles.rightM}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={styles.rightIcon}
                              onPress={() => this.showCBook()}>
                              <Feather
                                name="chevron-down"
                                color="#3860cc"
                                size={25}
                                style={styles.rightM}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>

                        {this.state.showCurrentBook ? (
                          <View
                            style={{
                              marginTop: '5%',
                              paddingRight: 10,
                              marginBottom: '1%',
                            }}>
                            {this.state.showEmpty ? (
                              <>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '5%',
                                  }}>
                                  <Text>{this.state.mssage}</Text>
                                </View>
                              </>
                            ) : null}
                            {this.state.currentIssued.map((item, i) => {
                              return (
                                <React.Fragment>
                                  <>
                                    <View
                                      style={{
                                        marginBottom: 10,
                                        borderRadius: 5,
                                      }}>
                                      <LinearGradient
                                        colors={['#fff', '#fff']}
                                        style={[
                                          styles.commonGradient,
                                          {paddingTop: 10, paddingBottom: 10},
                                        ]}>
                                        <View
                                          style={{
                                            paddingLeft: 15,
                                            paddingRight: 5,
                                          }}>
                                          <Text style={styles.bookTitle}>
                                            {item[6]}
                                          </Text>
                                        </View>

                                        <View
                                          style={[
                                            styles.oldBookStyle,
                                            {marginTop: 10},
                                          ]}>
                                          <Text
                                            style={
                                              styles.currentIssuesDetailsMap
                                            }>
                                            By :{' '}
                                            <Text style={styles.bookAuther}>
                                              {item[5]}
                                            </Text>
                                          </Text>
                                        </View>

                                        <View style={styles.oldBookStyle}>
                                          <Text
                                            style={
                                              styles.currentIssuesDetailsMap
                                            }>
                                            Publisher :{' '}
                                            <Text
                                              style={{
                                                width: '60%',
                                                marginTop: 5,
                                              }}>
                                              {item[7]}
                                            </Text>
                                          </Text>
                                        </View>

                                        <View style={styles.oldBookStyle}>
                                          <Text
                                            style={
                                              styles.currentIssuesDetailsMap
                                            }>
                                            Issued on :{' '}
                                            <Text
                                              style={{
                                                width: '100%',
                                                marginTop: 5,
                                              }}>
                                              {item[2]}
                                            </Text>
                                          </Text>
                                        </View>

                                        <View style={styles.oldBookStyle}>
                                          <Text
                                            style={
                                              styles.currentIssuesDetailsMap
                                            }>
                                            Please return by :{' '}
                                            <Text
                                              style={{
                                                width: '100%',
                                                marginTop: 5,
                                              }}>
                                              {item[3].slice(0, 16)}
                                            </Text>
                                          </Text>
                                        </View>
                                      </LinearGradient>
                                    </View>
                                  </>
                                </React.Fragment>
                              );
                            })}
                          </View>
                        ) : null}
                      </View>
                    </LinearGradient>

                    {/* =======================Old Issued============================= */}

                    <LinearGradient
                      colors={['#eff7ee', '#eff7ee']}
                      style={[styles.commonGradient]}>
                      <View>
                        {/* <Text style={styles.text_footer}>Old Issued :</Text> */}

                        <TouchableOpacity
                          onPress={() => {
                            this.showOldBooks();
                          }}
                          style={[
                            styles.editInfo,
                            {marginTop: '5%', marginBottom: '5%'},
                          ]}>
                          <View style={styles.iconC}>
                            <AntDesign name="book" color="#77aa69" size={20} />
                          </View>
                          <View>
                            <Text
                              style={[styles.fillDetails, {color: '#77aa69'}]}>
                              Previously Issued Books
                            </Text>
                          </View>
                          {this.state.showOldBook ? (
                            <TouchableOpacity
                              style={styles.rightIcon}
                              onPress={() => this.HideOldBook()}>
                              <Feather
                                name="chevron-up"
                                color="#77aa69"
                                size={25}
                                style={styles.rightM}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={styles.rightIcon}
                              onPress={() => this.showOldBooks()}>
                              <Feather
                                name="chevron-down"
                                color="#77aa69"
                                size={25}
                                style={styles.rightM}
                              />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>

                        {this.state.showOldBook ? (
                          <View
                            style={{
                              marginTop: '2%',
                              paddingRight: 10,
                              marginBottom: '1%',
                            }}>
                            {this.state.showEmpty ? (
                              <>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: '2%',
                                  }}>
                                  <Text>{this.state.pmssage}</Text>
                                </View>
                              </>
                            ) : null}

                            {this.state.oldIssued.map((item, i) => {
                              console.log('item : ', item[3].slice(0, 16));
                              return (
                                <React.Fragment key={i}>
                                  <>
                                    <View
                                      style={{
                                        marginBottom: 10,
                                        borderRadius: 5,
                                      }}>
                                      <LinearGradient
                                        colors={['#fff', '#fff']}
                                        style={[
                                          styles.commonGradient,
                                          {paddingTop: 10, paddingBottom: 10},
                                        ]}>
                                        <View
                                          style={{
                                            paddingLeft: 15,
                                            paddingRight: 5,
                                          }}>
                                          <Text style={styles.bookTitle}>
                                            {item[7]}
                                          </Text>
                                        </View>

                                        <View
                                          style={[
                                            styles.oldBookStyle,
                                            {marginTop: 10},
                                          ]}>
                                          <Text
                                            style={
                                              styles.currentIssuesDetailsMap
                                            }>
                                            By :{' '}
                                            <Text style={styles.bookAuther}>
                                              {item[6]}
                                            </Text>
                                          </Text>
                                        </View>

                                        <View style={styles.oldBookStyle}>
                                          <Text
                                            style={
                                              styles.currentIssuesDetailsMap
                                            }>
                                            Publisher :{' '}
                                            <Text
                                              style={{
                                                width: '60%',
                                                marginTop: 5,
                                              }}>
                                              {item[8]}
                                            </Text>
                                          </Text>
                                        </View>

                                        <View style={styles.oldBookStyle}>
                                          <Text
                                            style={
                                              styles.currentIssuesDetailsMap
                                            }>
                                            Issued on :{' '}
                                            <Text
                                              style={{
                                                width: '100%',
                                                marginTop: 5,
                                              }}>
                                              {item[2]}
                                            </Text>
                                          </Text>
                                        </View>
                                        <View style={styles.oldBookStyle}>
                                          <Text
                                            style={
                                              styles.currentIssuesDetailsMap
                                            }>
                                            Please return by :{' '}
                                            <Text
                                              style={{
                                                width: '100%',
                                                marginTop: 5,
                                              }}>
                                              {item[3].slice(0, 16)}
                                            </Text>
                                          </Text>
                                        </View>
                                      </LinearGradient>
                                    </View>
                                  </>
                                </React.Fragment>
                              );
                            })}
                          </View>
                        ) : null}
                      </View>
                    </LinearGradient>

                    {/* ============================================== */}
                    <View style={{marginTop: '5%'}}>
                      <Text style={{color: '#8A8A8A'}}>
                        These details are taken from your existing Account with
                        the Library. In case of any concerns, please contact the
                        helpdesk at the Library.
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    // flex: 1,
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
    fontWeight: '700',
  },
  rightIcon: {
    marginTop: 2,
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
  },
  commonGradient: {
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,

    paddingLeft: 10,
    marginBottom: 10,
  },
  iconC: {
    marginTop: 3,
    marginRight: 10,
  },
  uDetail: {
    marginBottom: 20,
  },
  uNme: {
    fontSize: 30,
  },
  currentIssuesDetails: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    fontSize: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  currentIssuesDetailsMap: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oldBookStyle: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  bookTitle: {
    width: '100%',
    marginTop: 5,
    fontSize: 17,
    color: '#005580',
    fontWeight: '700',
  },
  bookAuther: {
    width: '60%',
    marginTop: 5,
    fontSize: 16,
  },
});

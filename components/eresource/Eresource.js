import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Linking,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';

const win = Dimensions.get('window');
import RenderHtml from 'react-native-render-html';

import {Appbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
// import * as Animatable from 'react-native-animatable';

import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ALL} from '@env';
import IconAntDesign from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publisherData: [],
      searchquery: '',
      label: '',
      loader: true,
      showData: false,
      searchBook: '',
      listArray: [],
      showSearchContent: false,
      searchBk: '',
      loaderSearch: false,
      showSearchBtn: true,
      showError: false,
      name: '',
      pageDetails:''
    };
  }

  async componentDidMount() {

    
    try {
      const sName = JSON.parse(await AsyncStorage.getItem('sName'));
      const sNameLast = JSON.parse(await AsyncStorage.getItem('sNameLast'));


      this.setState({
        name: sName + ' ' + sNameLast,
        pageDetails:this.props.route.params.eresourceData
      });
      // console.log('name : ', this.state.name);
    } catch (error) {
      console.log('There has problem in AsyncStorage : ' + error.message);
    }

    console.log('component');
    this.getApiResponse();
  }

  getApiResponse() {
    fetch(`${API_ALL}`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        console.log("result :- ",result)
        result.json().then(resp => {
          // console.log('get Api  Response : ', resp.data[0].Endpoint);
          if (resp.status === 'success') {
            const api = resp.data[0].Endpoint;
            this.setState({
              searchBk: resp.data[2].Endpoint,
              docmt: resp.data[1].Endpoint,
            });
            this.getPublicerList(api);
          } else {
            Alert.alert('Error', resp.message, [{text: 'Okay'}], {
              cancelable: true,
            });
          }
        });
      })
      .catch(error => {
        this.setState({
          loader: false,
        });
        Alert.alert('Error!', error.message, [{text: 'Okay'}], {
          cancelable: true,
        });
      });
  }

  getPublicerList(api) {
    RNFetchBlob.config({
      trusty: true,
    })
      .fetch('GET', `${api}`)
      .then(resp => {
        const strig = resp.data;

        const splt = JSON.parse(strig);

        // const publics = JSON.stringify(splt.details);

        // console.log(splt.details[1].label);

        this.setState({
          publisherData: splt.details,
          loader: false,
          showData: true,
        });
      })
      .catch((error, statusCode) => {
        console.log('statusCode :', statusCode);
        // alert("Something went wrong. Please try again.")
        Alert.alert('Error', "There has been a problem. Please try again.", [{text: 'Okay'}], {
          cancelable: true,
        });

        this.setState({
          loader: false,
        });

        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
      });
  }

  getDetails(item) {
    console.log('label : ', item.label);

    (this.state.searchquery = item.searchQuery),
      (this.state.label = item.label),
      console.log('state : ', this.state.searchquery);

    if (this.state.searchquery !== '' && this.state.label !== '') {
      this.nextPageDetails(item.searchQuery);
    } else {
      console.log('Something wents wrong.');
    }
  }

  async nextPageDetails(searchquer) {
    try {
      await AsyncStorage.setItem('searchquery', JSON.stringify(searchquer));
      await AsyncStorage.setItem(
        'labelLocal',
        JSON.stringify(this.state.label),
      );
      await AsyncStorage.setItem(
        'documentList',
        JSON.stringify(this.state.docmt),
      );

      const documentList = JSON.parse(
        await AsyncStorage.getItem('documentList'),
      );
      const labelLocal = JSON.parse(await AsyncStorage.getItem('labelLocal'));

      this.props.navigation.navigate('PublicerDetails');

      // console.log('searchquery local : ', documentList);
    } catch (error) {
      console.log(error);
    }
  }

  checkbooks() {
    if (this.state.searchBook === '') {
      Alert.alert(
        'Wrong Action',
        'Please Select Search Criteria.',
        [{text: 'Okay'}],
        {cancelable: true},
      );
    } else {
      // console.log("bookType data :---", this.state.bookType)
      this.setState({
        loaderSearch: true,
      });
      this.searchBooks();
    }
  }

  async searchBooks(value) {
    this.setState({
      listArray: [],
    });

    if (this.state.searchBook.length > 0) {
      this.setState({listArray: [], showSearchContent: false});

      this.setState({
        searchLoader: true,
      });

      // let sParameter = value;
      // sParameter = encodeURIComponent(sParameter.trim());

      const searchqueryLocal = JSON.parse(
        await AsyncStorage.getItem('searchquery'),
      );
      const email = JSON.parse(await AsyncStorage.getItem('email'));
      const userId = JSON.parse(await AsyncStorage.getItem('userId'));
      const sName = JSON.parse(await AsyncStorage.getItem('sName'));
      const sNameLast = JSON.parse(await AsyncStorage.getItem('sNameLast'));
      const labelLocal = JSON.parse(await AsyncStorage.getItem('labelLocal'));

      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({
          searchQuery: this.state.searchBook,
          searchField: 'title',
          startPage: 0,
          userEmail: email,
        // userEmail: "vijender.pandita@celect.in",
          searchType: 'fieldSearch',
        }),
        path = `${this.state.searchBk}`;

      RNFetchBlob.config({
        trusty: true,
      })
        .fetch('POST', path, headers, body)
        .then(resp => {
          // console.log('resp : ', resp.data);
          const detail = resp.data;
          const prs = JSON.parse(detail);

          if (prs.refreadDocumentList.length != 0) {
            // console.log("prs :- ", prs)
            this.setState({
              listArray: prs.refreadDocumentList,
              showSearchContent: true,
              showData: false,
              loaderSearch: false,
              showSearchBtn: false,
            });
          } else {
            this.setState({
              showError: true,
              message:
                'Sorry, We could not find any results for your search criteria. Please try again.',
            });
          }
        })
        .catch((error, statusCode) => {
          // console.log('statusCode :', statusCode);
          console.log(
            'There has been a problem with your fetch operation: ' +
              error.message,
          );
          Alert.alert(
            'Error',
            'Something went wrong. Please try again.',
            [{text: 'Okay'}],
            {
              cancelable: true,
            },
          );

          this.setState({
            loaderSearch: false,
          });
        });
    } else {
      this.setState({
        showSearchContent: false,
      });
      Alert.alert('', 'Please enter search text.', [{text: 'Okay'}], {
        cancelable: true,
      });
    }
  }

  cancellSearch() {
    this.setState({
      searchBook: '',
      listArray: [],
      showSearchContent: false,
      showData: true,
      loaderSearch: false,
      showSearchBtn: true,
    });
  }

  async getTextValue(item) {
    console.log('get item : ', item.fulltexturl, item.publisher);

    if (item.fulltexturl.length !== 0) {
      await AsyncStorage.setItem('Booktitle', JSON.stringify(item.title));
      await AsyncStorage.setItem(
        'fulltexturl',
        JSON.stringify(item.fulltexturl),
      );

      const Booktitle = JSON.parse(await AsyncStorage.getItem('Booktitle'));
      const fullurl = JSON.parse(await AsyncStorage.getItem('fulltexturl'));

      if (Booktitle !== '' && fullurl !== '') {
        this.props.navigation.navigate('OpenBook');
      } else {
        alert('Something wents wrong.');
      }
    }
  }

  render() {
    return (
      <View style={{backgroundColor: '#ffffff', flex: 1}}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>

          <Appbar.Content title="BITSoM DIGITAL LIBRARY" />
        </Appbar.Header>

        {this.state.loader ? (
          <>
            <View
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                elevation: 3,
                // backgroundColor: 'rgba(0,0,0,0.2)',
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

        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <>
              {/* <View style={[styles.commonGradient, { marginBottom: "5%" }]}>

                <Text style={styles.library}>BITSoM DIGITAL LIBRARY</Text>
              </View> */}

              {/* ===============INFO======================= */}
              <View style={styles.uDetail}>
                <Text style={styles.uNme}>Hello</Text>
                <Text style={styles.uNme}>{this.state.name}</Text>
                <RenderHtml
                contentWidth={{width: 100}}
                source={{
                  html: `${this.state.pageDetails}`,
                }}
              />
              </View>

              <Text
                style={{marginTop: 10, color: '#8A8A8A', marginBottom: '7%'}}>
                You can search digital library through free text search or
                browse different publisher.
              </Text>

              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: '#DEDEDE',
                }}>
                <Text
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: 5,
                    backgroundColor: '#fff',
                    paddingHorizontal: 5,
                  }}>
                  Free text search
                </Text>

                <View style={styles.searchSt}>
                  <TextInput
                    placeholder="Enter text here..."
                    style={styles.searchInputStyle}
                    value={this.state.searchBook}
                    placeholderTextColor={"#7F7F7F"}
                    onChangeText={value => {
                      this.setState({searchBook: value});
                    }}
                  />

                  {this.state.loaderSearch && (
                    <View
                      style={{
                        width: '100%',
                        position: 'absolute',
                        elevation: 3,
                        marginTop: '2%',
                        justifyContent: 'center',
                      }}>
                      <ActivityIndicator size="large" color="#0d6efd" />
                    </View>
                  )}

                  {this.state.showSearchBtn ? (
                    <>
                      <TouchableOpacity
                        disabled={this.state.loaderSearch ? true : false}
                        onPress={value => this.checkbooks(value)}
                        style={{
                          borderWidth: 1,
                          padding: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderTopRightRadius: 5,
                          borderBottomRightRadius: 5,
                        }}>
                        <IconAntDesign
                          name="search"
                          size={30}
                          color="#696969"
                          style={{marginLeft: '5%'}}
                        />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        onPress={() => this.cancellSearch()}
                        style={{
                          borderWidth: 1,
                          padding: 5,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderTopRightRadius: 5,
                          borderBottomRightRadius: 5,
                        }}>
                        <Entypo
                          name="cross"
                          size={30}
                          color="#696969"
                          style={{marginLeft: '5%'}}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>

              <View>
                {this.state.showSearchContent ? (
                  <LinearGradient
                    colors={['#fff', '#fff']}
                    style={[styles.dropdown, {marginBottom: '30%'}]}>
                    <Text
                      style={
                        (styles.dropdown, {color: '#8A8A8A', marginBottom: 15})
                      }>
                      Following is the list of titles we found based on your
                      search criteria. You can click on individual title for a
                      detailed view.
                    </Text>

                    <View
                      style={{
                        paddingTop: '5%',
                        width: '100%',
                        backgroundColor: '#eff7ee',
                        paddingLeft: '3%',
                        paddingRight: '3%',
                      }}>
                      <View style={styles.flatstyles}>
                        <View
                          style={{
                            marginTop: '1%',
                            marginBottom: '5%',
                            width: '100%',
                          }}>
                          {this.state.listArray.map((item, i) => {
                            {
                              console.log(item.title);
                            }
                            if (item.author != null) {
                              // console.log("item.author.length 2 :- ", item.author[0])
                              // if (item.author.length > 0) {
                              //   console.log("item.author.length 2 :- ", item.author[0])
                              this.state.showitem = true;
                              // }else{
                              //   this.state.showitem = false
                              // }
                            } else {
                              this.state.showitem = false;
                              // console.log("cheking size")
                            }

                            if (item.access_type[0] === 'Subscribed') {
                              // console.log("Subscribed")
                              this.state.lock = true;
                            } else {
                              // console.log("Open Access")
                              this.state.lock = false;
                            }
                            return (
                              <React.Fragment key={i}>
                                <TouchableOpacity
                                  value={this.state.mName}
                                  style={{
                                    // paddingTop: 10,
                                    // paddingBottom: 10,
                                    marginBottom: 10,
                                    borderRadius: 10,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.18,
                                    shadowRadius: 1.0,
                                    elevation: 1,
                                  }}
                                  onPress={() => this.getTextValue(item)}>
                                  <View
                                    style={{
                                      // marginBottom: 10,
                                      borderRadius: 10,
                                    }}>
                                    <LinearGradient
                                      colors={['#fff', '#fff']}
                                      style={{borderRadius: 10,paddingTop: 10,
                                        paddingBottom: 10,}}
                                      >
                                      <View
                                        style={{
                                          
                                          borderRadius: 10,
                                          paddingLeft: 15,
                                          paddingRight: 5,
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                        }}>
                                        <Text style={styles.bookTitle}>
                                          {item.title.replace('<span>', ' ')}
                                        </Text>

                                        {this.state.lock ? (
                                          <Feather
                                            name="lock"
                                            size={20}
                                            color="#FF3A00"
                                            style={{marginRight: 5}}
                                          />
                                        ) : (
                                          <Feather
                                            name="unlock"
                                            size={20}
                                            color="#DEDEDE"
                                            style={{marginRight: 5}}
                                          />
                                        )}

                                        {/* <RenderHtml
                                          contentWidth={{ width: win.width / 1, height: win.width / 1, }}
                                          source={{ html: `${item.title}` }}
                                        /> */}

                                        {/* <Text style={{ display: this.state.showitem ? "flex" : "none" }}>
                                          {item[2]}
                                        </Text> */}
                                      </View>

                                      <View
                                        style={[
                                          styles.oldBookStyle,
                                          {
                                            marginTop: 10,
                                            display: this.state.showitem
                                              ? 'flex'
                                              : 'none',
                                          },
                                        ]}>
                                        <Text
                                          style={
                                            styles.currentIssuesDetailsMap
                                          }>
                                          By :{' '}
                                          <Text
                                            style={{
                                              display: this.state.showitem
                                                ? 'flex'
                                                : 'none',
                                            }}>
                                            {item.author}
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
                                            {item.publisher}
                                          </Text>
                                        </Text>
                                      </View>
                                    </LinearGradient>
                                  </View>
                                </TouchableOpacity>
                              </React.Fragment>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                ) : (
                  <>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '10%',
                        display: this.state.showError ? 'flex' : 'none',
                      }}>
                      <Text>{this.state.message}</Text>
                    </View>
                  </>
                )}
              </View>

              {/* ------------------------------------------------------------------------------------------------------- */}

              {this.state.showData ? (
                <View
                  style={{
                    marginBottom: '35%',
                    borderWidth: 1,
                    marginTop: '10%',
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    borderColor: '#DEDEDE',
                    paddingBottom: '5%',
                  }}>
                  <Text
                    style={{
                      position: 'absolute',
                      top: -10,
                      left: 5,
                      backgroundColor: '#fff',
                      paddingHorizontal: 5,
                    }}>
                    Browse by publisher
                  </Text>

                  {this.state.publisherData.map((item, i) => {
                    return (
                      <React.Fragment key={i}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => this.getDetails(item)}>
                          <LinearGradient
                            colors={['#f7f6ff', '#eff3fe']}
                            style={styles.commonGradient}>
                            <View style={{flexDirection: 'row'}}>
                              <View style={styles.iconC}>
                                <Image
                                  style={{width: 25, height: 25}}
                                  source={{
                                    uri: `${item.url}`,
                                  }}
                                />
                              </View>

                              <View>
                                <Text
                                  style={[
                                    styles.textCommon,
                                    {color: '#191919', marginTop: '5%'},
                                  ]}>
                                  {item.label}
                                </Text>
                              </View>

                              <View style={styles.rightIcon}>
                                <Feather
                                  name="chevron-right"
                                  color="#5ec6e9"
                                  size={15}
                                  style={styles.rightM}
                                />
                              </View>
                            </View>
                          </LinearGradient>
                        </TouchableOpacity>
                      </React.Fragment>
                    );
                  })}
                </View>
              ) : null}
            </>
          </ScrollView>
        </View>

        <View
          style={{
            paddingBottom: 8,
            paddingTop: 5,
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#fff',
            width: '100%',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>In Association with </Text>
            <Text style={{color: '#f68823'}}> Refread</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ttl: {
    backgroundColor: '#fff',
  },
  container: {
    marginLeft: '5%',
    marginRight: '5%',
  },

  button: {
    alignItems: 'center',
    marginTop: 13,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  commonGradient: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    
  },
  textCommon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconC: {
    marginTop: 4,
    marginRight: 10,
    marginLeft: 20,
  },
  rightIcon: {
    justifyContent: 'center',
    marginTop: 4,
    flex: 1,
  },
  rightM: {
    textAlign: 'right',
    marginRight: 20,
  },
  scrollView: {
    flexGrow: 1,
    flex: 1,
  },
  library: {
    color: '#6f6f6f',
    fontSize: 18,
    fontWeight: '700',
    marginTop: '5%',
    borderBottomColor: '#f68823',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  searchSt: {
    // marginTop: 15,
    width: '100%',
    // backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    // borderWidth: 1,
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
    fontWeight: '700',
  },
  searchInputStyle: {
    flex: 1,
    width: '100%',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    margin: 0,
    color: 'black',
  },
  dropdown: {
    marginTop: '10%',
    borderRadius: 5,
    marginBottom: '5%',
  },
  bookTitle: {
    width: '85%',
    marginTop: 5,
    fontSize: 17,
    color: '#005580',
    fontWeight: '700',
    marginBottom: 6,
  },
  bookAuther: {
    width: '60%',
    marginTop: 5,
    fontSize: 15,
  },
  currentIssuesDetailsMap: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uDetail: {
    marginTop: 10,
    marginBottom: 10,
  },
  uNme: {
    fontSize: 25,
  },
});

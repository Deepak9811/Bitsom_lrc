import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TextInput,
  ScrollView,
  Alert,
  ToastAndroid,
  Linking,
  BackHandler,
  StatusBar,
} from 'react-native';

import {Appbar} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import {Picker as SelectPicker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {API_URL} from '@env';
import RenderHtml from 'react-native-render-html';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      loader: false,
      purposeIndexValue: '',
      pickerIndex: '',
      searchMeeting: '',
      listArray: [],
      purposeData: [
        {type: 'Title', id: '1'},
        {type: 'Author', id: '2'},
        {type: 'Keyword', id: '3'},
        {type: 'ISBN', id: '4'},
      ],
      searchLoader: false,
      showSearchContent: false,
      hidePubliser: true,
      bookType: '',
      animation: true,
    };
  }

  async componentDidMount() {
    try {
      const sName = JSON.parse(await AsyncStorage.getItem('sName'));
      const sNameLast = JSON.parse(await AsyncStorage.getItem('sNameLast'));

      this.setState({
        name: sName + ' ' + sNameLast,
      });
    } catch (error) {
      console.log('There has problem in AsyncStorage : ' + error.message);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.setState({
        animation: false,
      }),
    );
  }

  checkCatalog() {
    if (this.state.bookType === '') {
      Alert.alert(
        'Wrong Action',
        'Please Select Search Criteria.',
        [{text: 'Okay'}],
        {cancelable: true},
      );
    } else {
      // console.log("bookType data :---", this.state.bookType)
      this.searchVisitor();
    }
  }

  async searchVisitor(value) {
    this.setState({
      message: '',
    });
    this.setState({
      listArray: [],
    });

    if (this.state.searchMeeting.length > 0) {
      this.setState({listArray: [], showSearchContent: false});

      this.setState({
        searchLoader: true,
      });

      fetch(
        `${API_URL}LIBCON-OPAC-${this.state.bookType}&parameter=${this.state.searchMeeting}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'content-type': 'application/json',
          },
        },
      )
        .then(data => {
          data.json().then(resp => {
            console.log('searcher =>', resp.data);

            if (resp.status === 'success') {
              if (resp.data.response.length > 0) {
                // console.log('search =>', resp);
                this.setState({
                  searchLoader: false,
                  listArray: resp.data.response,
                  showSearchContent: true,
                });
              }
            } else {
              this.setState({
                searchLoader: false,
                message:
                  'Sorry, We could not find any results for your search criteria. Please try again.',
              });
            }
          });
        })
        .catch(error => {
          ToastAndroid.show(
            error.message,
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
          this.setState({
            searchLoader: false,
          });
        });
    } else {
      this.setState({
        showSearchContent: false,
      });
      Alert.alert('Alert!', 'Please enter search text.', [{text: 'Okay'}], {
        cancelable: true,
      });
    }
  }

  async getTextValue(item) {
    console.log('get item : ', item[0]);
    if (item[0].length !== 0) {
      await AsyncStorage.setItem('opacNext', JSON.stringify(item[0]));
      await AsyncStorage.setItem('opacNextAuthor', JSON.stringify(item[1]));
      const da = JSON.parse(await AsyncStorage.getItem('opacNext'));
      const opacNextAutho = JSON.parse(
        await AsyncStorage.getItem('opacNextAuthor'),
      );
      console.log('data : ', da, opacNextAutho);
      this.props.navigation.push('OpacNext');
    } else {
      console.log('no data');
    }
  }

  // onPickerValue(value, index) {
  //   this.state.bookType = this.state.purposeData[index - 1].type;

  //   this.setState({
  //     purposeIndexValue: value,
  //     // bookType: this.state.purposeData[index - 1].type,
  //     disble: true,
  //   });

  //   // , () => {
  //   console.log('purpose data :---', this.state.bookType);
  //   // }

  //   // this.state.pickerIndex = index;
  // }

  onPickerValue(value, index) {
    console.log(index);
    if (index === 0) {
      console.log(index);
      this.setState({
        indexOfSelection: index,
      });
    } else {
      this.state.bookType = this.state.purposeData[index - 1].type;
      this.state.disble = true;
    }
    this.state.indexOfSelection = index;
    this.setState({
      purposeIndexValue: value,
      // bookType: this.state.purposeData[index - 1].type,
      disble: true,
      // indexOfSelection:index
    });

    // , () => {
    console.log(
      "purpose data :---",
      this.state.bookType,
      value,
      index,
      this.state.disble,
      this.state.indexOfSelection
    );
    // }

    // this.state.pickerIndex = index;
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={'#fff'} barStyle="dark-content" />
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>

          <Appbar.Content title="Search Book (OPAC)" />
        </Appbar.Header>

        {this.state.loader && (
          <View style={styles.activityIndicatorStyle}>
            <ActivityIndicator color="#57A3FF" size="large" />
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{margin: 10, marginLeft: '5%', marginRight: '5%'}}>
            {/* ===============INFO======================= */}
            <View style={styles.uDetail}>
              <Text style={styles.uNme}>Hello</Text>
              <Text style={styles.uNme}>{this.state.name}</Text>
              {/* <Text style={{marginTop: 10, color: '#8A8A8A'}}>
                Welcome to Learning Resource Center, BITSoM
              </Text> */}
              <RenderHtml
                contentWidth={{width: 100}}
                source={{
                  html: `${this.props.route.params.opacData}`,
                }}
              />
            </View>

            <Text style={{marginTop: 10, color: '#8A8A8A'}}>
              Use the following form to search your library catalog.
            </Text>

            <View style={styles.pkr}>
            <SelectPicker
                style={{ width: "100%" }}
                selectedValue={this.state.purposeIndexValue}
                onValueChange={(value, index) => {
                  this.onPickerValue(value, index);
                }}
              >
                <SelectPicker.item
                  label="Search Criteria"
                  color="#6f6f6f"
                  value="0"
                  style={{ display: this.state.disble ? "flex" : "none" }}
                  enabled={this.state.disble ? false : true}
                />

                {this.state.purposeData.map((item, i) => (
                  <SelectPicker.item
                    label={item.type}
                    color="#000"
                    value={item.id}
                  />
                ))}
              </SelectPicker>
            </View>

            <View style={styles.searchSt}>
              <TextInput
                placeholder="Search..."
                style={styles.searchInputStyle}
                placeholderTextColor={'#7F7F7F'}
                value={this.state.searchMeeting}
                onChangeText={value => {
                  this.setState({searchMeeting: value});
                }}
              />
            </View>

            <View style={{marginTop: '5%'}}>
              <TouchableOpacity
                onPress={value => this.checkCatalog(value)}
                disabled={this.state.searchLoader ? true : false}>
                <LinearGradient
                  colors={['#f68823', '#b03024']}
                  style={styles.signIn}>
                  {this.state.searchLoader ? (
                    <ActivityIndicator size="large" color="#fff" />
                  ) : (
                    <Text style={styles.textSign}>Search</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {this.state.showSearchContent ? (
              <LinearGradient colors={['#fff', '#fff']} style={styles.dropdown}>
                <Text
                  style={
                    (styles.dropdown, {color: '#8A8A8A', marginBottom: 15})
                  }>
                  Following is the list of titles we found based on your search
                  criteria. You can click on individual title for a detailed
                  view.
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
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <View
                        style={{
                          marginTop: '1%',
                          marginBottom: '5%',
                          width: '100%',
                        }}>
                        {this.state.listArray.map((item, i) => {
                          {
                            if (item[2] === null) {
                              this.state.showitem = false;
                            } else {
                              this.state.showitem = true;
                            }
                          }
                          return (
                            <React.Fragment key={i}>
                              <TouchableOpacity
                                style={styles.commonGradient}
                                value={this.state.mName}
                                onPress={() => this.getTextValue(item)}>
                                <View
                                  style={{
                                    borderRadius: 10,
                                  }}>
                                  <LinearGradient
                                    colors={['#fff', '#fff']}
                                    style={{
                                      borderRadius: 10,
                                      paddingBottom: 10,
                                    }}>
                                    <View
                                      style={{
                                        paddingLeft: 15,
                                        paddingRight: 5,
                                        paddingTop: 10,
                                        borderRadius: 10,
                                      }}>
                                      <Text style={styles.bookTitle}>
                                        {item[1]}
                                      </Text>

                                      <Text
                                        style={{
                                          display: this.state.showitem
                                            ? 'flex'
                                            : 'none',
                                        }}>
                                        {item[2]}
                                      </Text>
                                    </View>

                                    <View
                                      style={[
                                        styles.oldBookStyle,
                                        {marginTop: 10},
                                      ]}>
                                      <Text
                                        style={styles.currentIssuesDetailsMap}>
                                        By :{' '}
                                        <Text style={styles.bookAuther}>
                                          {item[3]}
                                        </Text>
                                      </Text>
                                    </View>

                                    <View style={styles.oldBookStyle}>
                                      <Text
                                        style={styles.currentIssuesDetailsMap}>
                                        Publisher :{' '}
                                        <Text
                                          style={{
                                            width: '60%',
                                            marginTop: 5,
                                          }}>
                                          {item[4]}
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
                    </ScrollView>
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
                  }}>
                  <Text>{this.state.message}</Text>
                </View>
              </>
            )}
          </View>
        </ScrollView>

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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
  },
  ttl: {
    backgroundColor: '#fff',
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

  searchSt: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#f1f1f1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
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
    color: '#fff',
  },
  pkr: {
    width: '100%',
    marginTop: 8,
    marginLeft: 20,
    marginRight: 20,
    borderColor: 'black',
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#f3f3f3',
  },

  oldBookStyle: {
    flexDirection: 'row',
    paddingRight: 10,
  },
  currentIssuesDetailsMap: {
    fontSize: 16,
    paddingVertical: 2,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    marginTop: '10%',
    borderRadius: 5,
    marginBottom: '5%',
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
    fontSize: 15,
  },

  uDetail: {
    marginBottom: 10,
  },
  uNme: {
    fontSize: 25,
  },
  commonGradient: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    marginBottom: 10,
  },
});

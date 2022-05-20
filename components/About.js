import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ActivityIndicator,
  ToastAndroid,
  Text,
  ScrollView,
  Image,
} from 'react-native';

import {WebView} from 'react-native-webview';

import {Appbar} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { windowWidth } from './utils/Dimensions';

export default class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: true,
      dataAbout: [],
      showError: false,
      subContentData: [],
      moreContent: false,
      newDataAbout: [],
      gateOpen: false,
    };
  }

  async componentDidMount() {
    try {
      const libraryID = JSON.parse(await AsyncStorage.getItem('libraryID'));
      const token = JSON.parse(await AsyncStorage.getItem('libraryToken'));

      this.setState({
        libraryCode: libraryID,
        token: token,
      });

      this.getContent();
    } catch (error) {
      console.log(error.message);
    }
  }

  getContent() {
    console.log(this.state.libraryCode, ' :- ', this.state.token);

    fetch(`https://bitsomapi.libcon.in/api/getContent`, {
      method: 'GET',
      headers: {
        Accepts: 'application/json',
        'content-type': 'application/json',
      },
    })
      .then(result => {
        result.json().then(resp => {
          // console.log('response :- ', resp);

          if (resp.status === 'success') {
            this.setState({
              dataAbout: resp.data,
            });

            var id = this.state.dataAbout.map(t => t.id);
            var sortOrder = this.state.dataAbout.map(t => t.sortOrder);
            var heading = this.state.dataAbout.map(t => t.heading);
            var imageUrl = this.state.dataAbout.map(t => t.imageUrl);
            var bodyText = this.state.dataAbout.map(t => t.bodyText);
            var childContent = this.state.dataAbout.map(t => t.childContent);

            let addString = [];

            for (let i = 0; i < id.length; i++) {
              addString.push({
                id: id[i],
                sortOrder: sortOrder[i],
                heading: heading[i],
                imageUrl: imageUrl[i],
                bodyText: bodyText[i],
                childContent: childContent[i],
                show: false,
              });
            }

            this.setState({
              newDataAbout: addString,
              loader: false,
            });

            // console.log("addString :- ",addString)
          } else {
            this.setState({
              loader: false,
            });
            ToastAndroid.show(
              resp.message,
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
          }
        });
      })
      .catch(error => {
        console.log(
          'There has been a problem with your fetch operation: ' +
            error.message,
        );
        this.setState({
          loader: false,
          showError: true,
          message: 'Something went wrong. Please try again.',
        });
      });
  }

  async getDetailsAbout(item) {
    console.log(item.id, item.heading, item.imageUrl);
    try {
      await AsyncStorage.setItem('headingAbout', JSON.stringify(item.heading));
      this.props.navigation.navigate('AboutNext', {itemData: item});
    } catch (error) {
      console.log(error);
    }
  }

  morecontentShow(item, i) {
    // this.setState(prevState => ({
    //   moreContent: !prevState.moreContent,
    // }));
    // alert(item.show)

    if (item.show === false) {
      const {newDataAbout} = this.state;
      const trueShow = [...newDataAbout];
      trueShow[i].show = true;

      this.setState({
        newDataAbout: trueShow,
        gateOpen: true,
      });


      console.log(trueShow)

    } else {
      const {newDataAbout} = this.state;
      const trueShow = [...newDataAbout];

      trueShow[i].show = false;

      this.setState({
        newDataAbout: trueShow,
        gateOpen: false,
      });
    }
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: this.state.showError ? '#fff' : ''},
        ]}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>
          <Appbar.Content title="More About The Library" />
        </Appbar.Header>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '5%',
              marginBottom: '12%',
            }}>
            {this.state.newDataAbout.map((item, i) => {
              
              // console.log(item);

              // if (this.state.gateOpen === true) {
                if (item.show === false) {
                  this.state.moreContent = false;
                } else {
                  this.state.moreContent = true;
                }
              // } else {
              //   // this.state.moreContent = false;
              // }

              if (item.childContent.length !== 0) {
                this.state.showSubContent = true;
                this.state.subContentData = item.childContent;
                // console.log('checking here');

                
              } else {
                // console.log('else :- ');
                this.state.subContentData = [];
                this.state.showSubContent = false;
              }
              return (
                <React.Fragment key={i}>
                  {/* <Text>{item.heading}</Text> */}

                  <View style={styles.button}>
                    <LinearGradient
                      colors={['#fff', '#fff']}
                      style={styles.commonGradient}>
                      <View style={[styles.contentRow]}>
                        <TouchableOpacity
                          style={{width: windowWidth / 1.3, justifyContent: 'center',paddingVertical: 10,}}
                          onPress={() => this.getDetailsAbout(item)}>
                          <Text style={[styles.textCommon, {color: '#e1495e'}]}>
                            {item.heading.trim()}
                          </Text>
                        </TouchableOpacity>

                        <View style={styles.rightIcon}>
                          {this.state.showSubContent ? (
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              {this.state.moreContent ? (
                                <TouchableOpacity
                                  onPress={() => this.morecontentShow(item, i)}>
                                  <Feather
                                    name="minus-circle"
                                    color="#e1495e"
                                    size={24}
                                    style={styles.rightM}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => this.morecontentShow(item, i)}>
                                  <Ionicons
                                    name="add-circle-outline"
                                    color="#e1495e"
                                    size={25}
                                    style={styles.rightM}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          ) : (
                            <Feather
                              name="chevron-right"
                              color="#e1495e"
                              size={20}
                              style={styles.rightM}
                            />
                          )}
                        </View>
                      </View>

                      {this.state.moreContent ? (
                        <>
                          {this.state.subContentData.map((subItem, i) => {
                            return (
                              <React.Fragment key={i}>
                                <View
                                  style={{paddingHorizontal: 10, marginTop: 5}}>
                                  <TouchableOpacity
                                    onPress={() => this.getDetailsAbout(subItem)}
                                    style={[
                                      styles.contentRow,
                                      {paddingHorizontal: 10,paddingVertical: 10,},
                                    ]}>
                                    <View style={{width: '80%'}}>
                                      <Text
                                        style={[
                                          styles.textCommon,
                                          {color: '#e1495e'},
                                        ]}>
                                        {subItem.heading.trim()}
                                      </Text>
                                    </View>

                                    <View style={styles.rightIcon}>
                                      <Feather
                                        name="chevron-right"
                                        color="#e1495e"
                                        size={20}
                                        style={styles.rightM}
                                      />
                                    </View>
                                  </TouchableOpacity>

                                  <View
                                    style={{
                                      paddingHorizontal: 5,
                                    }}>
                                    <View
                                      style={{
                                        borderTopWidth: 1,
                                        borderColor: '#ddd',
                                      }}></View>
                                  </View>
                                </View>
                              </React.Fragment>
                            );
                          })}
                        </>
                      ) : null}
                    </LinearGradient>
                  </View>
                </React.Fragment>
              );
            })}
          </View>


          {this.state.showError && (
            <View
              style={{
                flex: 1,
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

        {this.state.loader && (
          <View style={styles.activityIndicatorStyle}>
            <ActivityIndicator color="#57A3FF" size="large" />
          </View>
        )}
      </View>
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
  },
  ttl: {
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'center',
    marginTop: '5%',
    width: '90%',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  commonGradient: {
    width: '100%',
    // paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 10,
  },
  textCommon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    textAlign: 'left',
  },
  rightIcon: {
    marginTop: 4,
    marginRight: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
});

import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
// import * as Animatable from 'react-native-animatable';
import {Appbar} from 'react-native-paper';

export default class VerifyNum extends Component {
  render() {
    return (
      <View style={{backgroundColor: '#ffffff', flex: 1}}>
        <Appbar.Header style={styles.ttl}>
          <TouchableOpacity
            style={{paddingLeft: '2%'}}
            onPress={() => this.props.navigation.goBack()}>
            <AntDesign name="arrowleft" color="#05375a" size={25} />
          </TouchableOpacity>
          <Appbar.Content title="Verfiy" />
        </Appbar.Header>

        <View style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginLeft: '5%', marginRight: '5%'}}>
              <View style={{marginTop: '10%', marginBottom: '10%'}}>
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{fontSize: 16, fontWeight: '700', color: '#707070'}}>
                    Enter the One Time Password{' '}
                  </Text>
                  <Text
                    style={{fontSize: 16, fontWeight: '700', color: '#707070'}}>
                    (OTP) send to your mobile
                  </Text>
                  <Text
                    style={{fontSize: 16, fontWeight: '700', color: '#707070'}}>
                    number
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  style={{fontSize: 16, fontWeight: '700', color: '#707070'}}>
                  Enter OTP
                </Text>
              </View>
              <View style={styles.inp}>
                <View style={styles.action}>
                  <TextInput
                    returnKeyType="next"
                    placeholder="0"
                    maxLength={1}
                    keyboardType="numeric"
                    style={styles.textInput}
                    //   onChangeText={val => this.textInputchange(val)}
                  />
                </View>

                <View style={styles.action}>
                  <TextInput
                    returnKeyType="next"
                    placeholder="0"
                    maxLength={1}
                    keyboardType="numeric"
                    style={styles.textInput}
                    //   onChangeText={val => this.textInputchange(val)}
                  />
                </View>

                <View style={styles.action}>
                  <TextInput
                    returnKeyType="next"
                    placeholder="0"
                    maxLength={1}
                    keyboardType="numeric"
                    style={styles.textInput}
                    //   onChangeText={val => this.textInputchange(val)}
                  />
                </View>

                <View style={styles.action}>
                  <TextInput
                    returnKeyType="next"
                    placeholder="0"
                    maxLength={1}
                    keyboardType="numeric"
                    style={styles.textInput}
                    //   onChangeText={val => this.textInputchange(val)}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  marginRight: '9%',
                  marginTop: 10,
                  padding: 5,
                  paddingHorizontal: 0,
                }}>
                <Text style={{textAlign: 'right', fontWeight: '700'}}>
                  Resend OTP
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.push('Home')}>
                <LinearGradient
                  colors={['#f68823', '#b03024']}
                  style={styles.signIn}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={{marginTop: 4, marginRight: 10}}>
                      <Feather name="check-circle" color="white" size={20} />
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.textSign,
                          {
                            color: '#fff',
                          },
                        ]}>
                        Proceed
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ttl: {
    backgroundColor: '#fff',
  },
  inp: {
    flexDirection: 'row',
    // paddingLeft: '5%',
    // paddingRight: '5%',
  },
  textInput: {
    //    width:"20%",
    flex: 1,
    paddingLeft: 30,
    color: '#05375a',
    paddingBottom: 2,
    fontSize: 20,
  },
  action: {
    width: '20%',
    flexDirection: 'row',
    borderBottomColor: '#f68823',
    paddingBottom: 5,
    marginRight: '4%',
    borderBottomWidth: 1,
  },
  button: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom:50
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
});
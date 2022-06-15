import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {Appbar} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {SafeAreaView} from 'react-native-safe-area-context';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {TextInput, Button} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import RenderHtml from 'react-native-render-html';
import { windowHeight } from './utils/Dimensions';

const Contact = ({props,navigation}) => {
  const [loader, setloader] = useState(false);
  const [name, setname] = useState('');
  const [description, setdescription] = useState('');
  const [showThank, setshowThank] = useState(true);
  const [hideThnk, sethideThnk] = useState(true);
  const [responseMsg, setresponseMsg] = useState('Thank You');
  const [showError, setshowError] = useState(true);
  const [details, setdetails] = useState('')

  useEffect(async () => {
    try {
      const sName = JSON.parse(await AsyncStorage.getItem('sName'));
      const sNameLast = JSON.parse(await AsyncStorage.getItem('sNameLast'));
      const details = JSON.parse(await AsyncStorage.getItem('contactTextData'));

      console.log(details)

      setdetails(details)
      

      setname(sName + ' ' + sNameLast);
    } catch (error) {
      console.log('There has problem in AsyncStorage : ' + error.message);
    }
  }, []);

  const handleEmail = () => {
    if (description !== '') {
      setloader(true);
      let receiverEmail = 'Library.helpdesk@bitsom.edu.in';
      // let receiverEmail = 'theartistnw@gmail.com';
      let enquiry = 'BITSoM Applicatin Contact Enquiry';
      // let url = `https://bitsomapi.libcon.in/api/sendEmail?toId=library.helpdesk@bitsom.edu.in&subject=${enquiry}&bodyText=${description}`;
      let url = `https://bitsomapi.libcon.in/api/sendEmail?toId=${receiverEmail}&subject=${enquiry}&bodyText=${description}`;
      fetch(url, {
        method: 'POST',
        headers: {
          Accepts: 'application/json',
          'content-type': 'application/json',
        },
      })
        .then(result => {
          result.json().then(resp => {
            console.log(resp);
            if (resp.status === 'success') {
              setdescription('Thank you');
              setshowThank(false);
              setloader(false);
              setresponseMsg('Thank you.')

              setTimeout(() => {
                sethideThnk(false);
              }, 5000);
            } else {
              setshowThank(false);
              setloader(false);
              setshowError(false);
              setresponseMsg('Something went wrong. Please try again.');
              setTimeout(() => {
                setshowThank(true);
                setshowError(true);
              }, 4000);
            }
          });
        })
        .catch(error => {
          setshowThank(false);
          setloader(false);
          setshowError(false);
          setresponseMsg('Something went wrong. Please try again.');
          setTimeout(() => {
            setshowThank(true);
            setshowError(true);
          }, 4000);
        });
    } else {
      Alert.alert('Alert!', 'Please Fill The Field Below.', [{text: 'Okay'}], {
        cancelable: true,
      });
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.ttl}>
        <TouchableOpacity
          style={{paddingLeft: '2%'}}
          onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" color="#05375a" size={25} />
        </TouchableOpacity>
        <Appbar.Content title="Contact US" />
      </Appbar.Header>

      <>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' :''}>
       <ScrollView
          ref={ref => (scrollView = ref)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.mainContainer}>
            {/* ===============INFO======================= */}
            <View style={styles.uDetail}>
              <Text style={styles.uNme}>Hello</Text>
              <Text style={styles.uNme}>{name}</Text>
              

            </View>

            <View style={styles.info}>
              {/* <Text style={styles.fontInfo}>Dr. Sanjay Kataria</Text>
              <Text style={styles.fontInfo}>Librarian,</Text>
              <Text style={styles.fontInfo}>BITS- School of Management,</Text>
              <Text style={styles.fontInfo}>
                E-mail: sanjay.kataria@bitsom.edu.in
                E-mail: Library.Helpdesk@bitsom.edu.in
              </Text> */}

              <RenderHtml
                contentWidth={{width: 100}}
                source={{
                  html: `${details}`,
                }}
              />
            </View>

            {hideThnk && (
              <>
                {showThank ? (
                  <>
                    <View
                      style={{
                        marginTop: 20,
                      }}>
                      <TextInput
                        mode="outlined"
                        style={{height:windowHeight/5}}
                        value={description}
                        numberOfLines={10}
                        placeholder="Please enter your Feedback
                                   /Suggestion/General Contact message"
                        underlineColorAndroid="transparent"
                        multiline={true}
                        onChangeText={e => setdescription(e)}
                      />
                    </View>

                    <View style={styles.buttonMap}>
                      {loader ? (
                        <>
                          <TouchableOpacity
                            style={styles.buttonStyle}
                            disabled={loader ? true : false}>
                            <ActivityIndicator color="#57A3FF" size="large" />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          onPress={handleEmail}
                          style={styles.buttonStyle}>
                          <Text style={{fontSize: 20, color: '#252a60'}}>
                            Submit
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </>
                ) : (
                  <LinearGradient
                    colors={['#fff', '#fff']}
                    style={styles.thnks}>
                    <View style={styles.thnkRow}>
                      <Animatable.Text
                        animation={'rubberBand'}
                        style={styles.thnksText}>
                        {responseMsg}
                      </Animatable.Text>
                      <Animatable.View
                        style={styles.successIcon}
                        animation={'bounceIn'}>
                        {showError ? (
                          <Feather
                            name="check-circle"
                            color="green"
                            size={28}
                          />
                        ) : (
                          <MaterialIcons
                            name="error-outline"
                            color="#f66"
                            size={28}
                          />
                        )}
                      </Animatable.View>
                    </View>
                  </LinearGradient>
                )}
              </>
            )}
          </View>
        </ScrollView>
       </KeyboardAvoidingView>
      </>

      <View
        style={{
          paddingHorizontal: 5,
          paddingVertical: 8,
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
    </SafeAreaView>
  );
};

export default Contact;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffffff'},
  ttl: {
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    marginTop: '5%',
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: '50%',
  },
  fontInfo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: '1%',
  },
  buttonMap: {
    marginTop: 10,
    padding: 5,
    paddingHorizontal: 0,
    marginLeft: '10%',
    marginRight: '10%',
    marginBottom: '10%',
  },
  buttonStyle: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 50,
    borderColor: '#f68d2c',
  },

  uDetail: {
    marginBottom: 20,
  },
  uNme: {
    fontSize: 25,
  },

  thnks: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    marginTop: '15%',
  },
  thnkRow: {
    flexDirection: 'row',
    padding: '5%',
    marginLeft: '5%',
    justifyContent: 'center',
  },
  thnksText: {
    fontWeight: 'bold',
    marginRight: '4%',
    marginTop: '1%',
    fontSize: 18,
    width: '80%',
    textAlign: 'center',
  },
  successIcon: {
    justifyContent: 'center',
  },
});

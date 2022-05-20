import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appbar} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import RenderHtml from 'react-native-render-html';
import {windowHeight, windowWidth} from '../utils/Dimensions';

export default class About extends Component {
  constructor(props) {
    super(props);

    this.state = {
      header: '',
      image: '',
      bodyText: '',
      loader: false,
    };
  }

  async componentDidMount() {
    try {
      const headingAbout = JSON.parse(
        await AsyncStorage.getItem('headingAbout'),
      );


      if (this.props.route.params.itemData.imageUrl !== '') {
        this.setState({
          loader: false,
        });
      } else {
        this.setState({
          loader: false,
          ShowImage: true,
        });
      }

      console.log(this.props.route.params.itemData.imageUrl);
    } catch (error) {
      console.log(error.message);
    }
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
          <Appbar.Content title={this.props.route.params.itemData.heading} />
        </Appbar.Header>

        {this.state.loader && (
          <View style={styles.activityIndicatorStyle}>
            <ActivityIndicator color="#57A3FF" size="large" />
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.body}>
            <Image
              // source={require('../image/template_1.png')}
              source={{
                uri:
                  `${this.props.route.params.itemData.imageUrl}` +
                  '?' +
                  new Date(),
              }}
              resizeMode="contain"
              style={[
                styles.imageStyle,
                styles.shadow,
                {display: this.state.ShowImage ? 'none' : 'flex',resizeMode:'cover'},
              ]}
            />
            {/* <Text style={{}}>{this.state.bodyText}</Text> */}
            {/* <WebView style={{  width: 800, height: "100%" }}
                            source= {{html: `${this.state.bodyText}`}} /> */}

            <View style={styles.shadow}>
              <View
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: '#fff',
                }}>
                <RenderHtml
                  contentWidth={{width: 100}}
                  source={{
                    html: `${this.props.route.params.itemData.bodyText}`,
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* <View style={{ margin: 0 }}>
                <WebView
                  scalesPageToFit={true}
                  bounces={false}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  frameBorder="0"
                  style={{ border: 0, width: 800, height: 300 }}
                  allowFullScreen=""
                  aria-hidden="false"
                  zoomEnabled={true}
                  zoomControlEnabled={true}
                  onLoadStart={() =>
                    this.setState({
                      loader: true,
                    })
                  }
                  onLoadEnd={() =>
                    this.setState({
                      loader: false,
                    })
                  }
                  source={{html: '<p>Here I am</p>'}}
                  automaticallyAdjustContentInsets={false}
                />
              </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  ttl: {
    backgroundColor: '#fff',
  },
  body: {
    marginLeft: '5%',
    marginRight: '5%',
    marginTop: '5%',
    marginBottom: '10%',
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
  imageStyle: {
    height: windowHeight / 3,
    width: windowWidth / 1.1,
    marginBottom: '1%',
  },
  shadow: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    marginTop: '5%',
    paddingBottom: 0,
  },
});

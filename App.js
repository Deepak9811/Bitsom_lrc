import React, {Component} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// import SplashScreen from 'react-native-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import Home from './components/Home';
import Eresource from './components/eresource/Eresource';
import Opac from './components/Opac';
import About from './components/About';
import Contact from './components/Contact';
import Profile from './components/Profile';
import PublicerDetails from './components/eresource/PublicerDetails';
import Account from './components/Account';
import LogInNew from './components/LogInNew';
import OpenBook from './components/eresource/OpenBook';
import OpacNext from './components/opac/OpacNext';
import Pagination from './components/pagination/Pagination';
import Posts from './components/pagination/Post';

import AboutNext from './components/aboutNext/About'
import EventDetails from './components/EventDetails';

import AsyncStorage from '@react-native-async-storage/async-storage';

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      routeName: 'LogInNew',
    };
  }

  async componentDidMount() {
    const email = JSON.parse(await AsyncStorage.getItem('email'));
    console.log('email : ', email);
    if (email !== null) {
      this.setState({
        routeName: 'Home',
      });
    }
    // SplashScreen.hide();
  }

  render() {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
          initialRouteName={this.state.routeName}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="LogInNew" component={LogInNew} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Eresource" component={Eresource} />
            <Stack.Screen name="PublicerDetails" component={PublicerDetails} />
            <Stack.Screen name="OpenBook" component={OpenBook} />
            <Stack.Screen name="Opac" component={Opac} />
            <Stack.Screen name="OpacNext" component={OpacNext} />
            <Stack.Screen name="About" component={About} />
            
            <Stack.Screen name="AboutNext" component={AboutNext} />
            <Stack.Screen name="EventDetails" component={EventDetails} />

            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Accountss" component={Account} />
            
            <Stack.Screen name="Pagination" component={Pagination} />
            <Stack.Screen name="Post" component={Posts} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}

const Stack = createNativeStackNavigator();
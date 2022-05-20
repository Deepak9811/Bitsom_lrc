import React, { Component } from 'react'
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, Image, Dimensions, Linking } from 'react-native'
import { Appbar } from 'react-native-paper'
import AntDesign from 'react-native-vector-icons/AntDesign';
import RenderHtml from 'react-native-render-html';

const win = Dimensions.get('window');

export default class EventDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            eventDeail: [],
            image: '',
            eventName: this.props.route.params.eventDetails.eventName
        }
    }


    componentDidMount() {
        const eventDeails = this.props.route.params.eventDetails
        console.log("events details :- ", eventDeails)
    }


    render() {
        return (
            <View style={styles.container}>
                <Appbar.Header style={styles.ttl}>
                    <TouchableOpacity
                        style={{ paddingLeft: '2%' }}
                        onPress={() => this.props.navigation.goBack()}>
                        <AntDesign name="arrowleft" color="#05375a" size={25} />
                    </TouchableOpacity>
                    <Appbar.Content title={this.state.eventName} />
                </Appbar.Header>

                <View style={{ flex: 1 }}>
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                        <View style={{ marginBottom: "15%" }}>
                            <Image resizeMode="contain" style={{
                                width: win.width / 1,
                                height: win.width / 1,
                            }} source={{ uri: `${this.props.route.params.eventDetails.image}` }} />



                            <View style={styles.scontent}>
                                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                                    <Text style={styles.txt}>{this.props.route.params.eventDetails.validFrom.replace("T", " ")}</Text>
                                    <Text>To</Text>
                                    <Text style={styles.txt}>{this.props.route.params.eventDetails.validUpto.replace("T", " ")}</Text>

                                </View>

                                <View style={styles.rgsv}>
                                    <TouchableOpacity style={styles.rgs} onPress={() =>
                                        Linking.openURL(`${this.props.route.params.eventDetails.registrationLink}`)
                                    }>
                                        <Text style={{ color: "#242960" }}>REGISTER</Text>
                                    </TouchableOpacity>
                                </View>

                                <RenderHtml
                                    contentWidth={{ width: win.width / 1, height: win.width / 1, }}
                                    source={{ html: `${this.props.route.params.eventDetails.description}` }}
                                />

                                <Text style={{ color: "#1289FF" }}>{this.props.route.params.eventDetails.location}</Text>


                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    ttl: {
        backgroundColor: '#fff',
    },
    rgs: {
        padding: "5%",
        borderWidth: 1,
        borderRadius: 50, width: "40%",
        alignItems: "center", paddingVertical: 10,
        borderColor: "#f68823"
    },
    rgsv: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5%",
        marginBottom: "5%"
    },
    scontent: {
        marginTop: "2%",
        marginLeft: "5%",
        marginRight: "5%"
    },
    txt: {
        fontWeight: "700"
    },
})

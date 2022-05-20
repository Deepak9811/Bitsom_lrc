import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, StyleSheet, ScrollView } from 'react-native';
import { Picker as SelectPicker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';

const Pagination = ({ postsPerPage, totalPosts, paginate, showPages, postsPerPages }) => {
    const [purposeData, setPurposeData] = useState([{ type: "20", id: "1" }, { type: "50", id: "2" }, { type: "100", id: "3" }]);

    const [purposeIndexValue, setPurposeIndexValue] = useState("")
    const [opacityIndicator, setopacityIndicator] = useState(true)
    const [greaterIndicator, setgreaterIndicator] = useState(false)
    const [purposeName, setpurposeName] = useState(20)
    const [disble, setdisble] = useState(false)
    const [count, setcount] = useState(1)

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    const onPickerValue = (value, index) => {

        setPurposeIndexValue(value)
        setdisble(true)
        postsPerPages(Number(purposeData[index - 1].type))

        if (Number(purposeData[index - 1].type) === 20) {
            setgreaterIndicator(false)
            paginate(1)
        } else if (Number(purposeData[index - 1].type) === 50) {

            if (totalPosts === Number(purposeData[index - 1].type)) {
                setopacityIndicator(true)
                setgreaterIndicator(true)
                paginate(index - 1)
            } else {
                setgreaterIndicator(false)
            }
        } else if (Number(purposeData[index - 1].type) === 100) {
            setopacityIndicator(true)
            setgreaterIndicator(true)
            paginate(1)
        }

    }


    const getNumberLess = () => {
        const lessCount = Number(count) - 1
        if (count === 1) {
            setcount(count)
            paginate(count)
            setopacityIndicator(true)
        } else {
            setcount(lessCount)
            setgreaterIndicator(false)
            paginate(count - 1)
            checkLess(lessCount)
        }
    }

    const checkLess = (lessCount) => {
        if (lessCount === 1) {
            setopacityIndicator(true)
            console.log("counting :-- ", count)
        }else{
            console.log("cheking so sad ",count)
        }
    }

    const getNumber = () => {
        const adCount = Number(count) + 1
        if (count === Number(pageNumbers.length)) {
            setopacityIndicator(false)
            setgreaterIndicator(true)
        } else {
            setcount(adCount);
            paginate(Number(count) + 1)
            setopacityIndicator(false)
            checkGreater(adCount)
        }
    }

    const checkGreater = (adCount) => {
        if (adCount === (pageNumbers.length)) {
            setopacityIndicator(false)
            setgreaterIndicator(true)
        }else{
            console.log("cheking so sad ",count)
        }
    }




    return (
        <View style={styles.container}>
            {showPages ? (
                <>
                    <View style={styles.pagination}>

                        <TouchableOpacity disabled={opacityIndicator ? true : false} style={styles.leftI} onPress={() => getNumberLess()}>
                            <Feather
                                name="chevrons-left"
                                color="#FF5733"
                                size={35}
                                style={{ opacity: opacityIndicator ? 0.1 : 1 }}

                            />
                        </TouchableOpacity>



                        <View style={styles.pkr}>
                            <SelectPicker
                                style={{ width: '100%' }}
                                selectedValue={purposeIndexValue}
                                onValueChange={(value, index) => {
                                    onPickerValue(value, index);
                                }}>
                                <SelectPicker.item
                                    label="Page size"
                                    color="#6f6f6f"
                                    value="0"
                                    enabled={disble ? false : true}
                                />
                                {purposeData.map((item, i) => (
                                    <SelectPicker.item label={item.type} color="#000" value={item.id} />
                                ))}
                            </SelectPicker>
                        </View>

                        <TouchableOpacity disabled={greaterIndicator ? true : false} style={styles.leftI} onPress={() => getNumber()}>
                            <Feather
                                name="chevrons-right"
                                color="#FF5733"
                                size={35}
                                style={[styles.leftI, { opacity: greaterIndicator ? 0.1 : 1 }]}
                            />
                        </TouchableOpacity>

                    </View>
                    {pageNumbers.map((item, i) => {
                        console.log("page number :- ", item.toString(), ", ", i + 1)
                    })}
                </>

            ) : null}

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginLeft: "5%",
        marginRight: "5%"
    },
    pagination: {
        flexDirection: "row",
        marginBottom: "10%",
        paddingVertical: 10,
        justifyContent: "space-between"
    },
    page_link: {
        color: "#0d6efd",
        borderBottomWidth: 1,
        borderBottomColor: "#FF3A00"
    },
    page_item: {
        margin: 5,
        marginRight: 15
    },
    pkr: {
        width: '68%',
        marginTop: 8,
        borderRadius: 5,
        alignSelf: 'center',
        backgroundColor: '#f3f3f3',
        marginRight: "5%",
        marginLeft: "5%"
    },
    leftI: {
        marginTop: "5%",
        marginRight: 5
    }
});

export default Pagination;

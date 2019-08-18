import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class PublishedList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { item, onPressBack } = this.props;
        const listPublish = item.map(item => item.source.name)
        const countname = new Map([...new Set(listPublish)].map(
            x => [x, listPublish.filter(y => y === x).length]
        ));
        let arrayPublished = [];
        let objectPublished = {}
        countname.forEach((val, key) => {
            objectPublished = { key, val }
            arrayPublished.push(objectPublished);
        })
        return (
            <View style={styles.container}>
                <View style={styles.wrapperButton}>
                    <TouchableOpacity onPress={onPressBack}>
                        <Ionicons name="md-arrow-round-back" size={30} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Publishers List</Text>
                </View>
                <View style={styles.namePublish}>
                    <Text style={styles.textNamePublish}>Publisher</Text>
                    <Text style={styles.textNamePublish}>Articles</Text>
                </View>
                <View style={styles.wrapperText}>
                    <ScrollView>
                        {arrayPublished.map(item => {
                            return (
                                <View key={item.key} style={styles.groupText}>
                                    <Text style={styles.textPublished}>{item.key}</Text>
                                    <Text style={styles.textPublished}>{item.val}</Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 5,
        paddingHorizontal: 10
    },
    wrapperButton: {
        flex: 0.08,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 70,
        alignItems: 'center'
    },
    namePublish: {
        flex: 0.06,
        marginVertical: 2,
        flexDirection: 'row',
        justifyContent: 'space-around', 
        alignItems: 'center'
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    wrapperText: {
        flex: 0.84,
        borderWidth: 1
    },
    groupText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderWidth: 1
    },
    textPublished: {
        fontSize: 20,
        fontWeight: '500'
    },
    textNamePublish: {
        fontSize: 25,
        fontWeight: '700'
    }  
})

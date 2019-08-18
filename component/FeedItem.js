import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import moment from "moment";

export default class FeedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  onPressReadMore = () => {
    const { item: { url } } = this.props;
    Linking.openURL(url).catch((err) => console.error('An error occurred', err));
  }
  render() {
    const { item: { title, urlToImage, source: { name }, content, publishedAt } } = this.props;
    const published = moment({ publishedAt }).startOf('hour').fromNow();
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Image source={{ uri: urlToImage }} style={styles.image} />
        <Text style={{fontWeight: 'bold'}}>Source: <Text style={{fontWeight: 'normal'}}>{name}</Text></Text>
        <Text style={{fontWeight: 'bold'}}>Content: <Text style={{fontWeight: 'normal'}}>{content}</Text></Text>
        <Text style={{fontWeight: 'bold'}}>Published: <Text style={{fontWeight: 'normal'}}>{published}</Text></Text>
        <TouchableOpacity style={styles.button} onPress={this.onPressReadMore} >
          <Text style={styles.buttonText}>READ MORE</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    marginHorizontal: 10,
    marginTop: 5
  },
  title: {
    textAlign: 'center',
    marginBottom: 3,
    fontWeight: '600',
    fontSize: 20
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 3
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    width: 150,
    height: 50,
    backgroundColor: 'blue',
    marginTop: 5,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold', 
    color: 'white'
  }
})
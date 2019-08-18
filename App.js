import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, TextInput } from 'react-native';
import FeedItem from './component/FeedItem';
import PublishedList from './component/PublishedList';
import { AntDesign, Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isLoading: false,
      isFreshing: false,
      listArticles: [],
      totalResults: 0,
      page: 1,
      hasMoreArticles: false,
      hasError: false,
      publishedList: false,
      inputText: '',
      searching: false
    })
  }
  componentDidMount = async () => {
    const { page } = this.state;
    this.setState({ isLoading: true, hasMoreArticles: true });
    this.callAPI(page);
  }
  callAPI = async page => {
    const { listArticles, totalResults } = this.state;
    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=bdf9a3e7a183493abf1c29b343d80fb9&page=${page}`);
      const responseJson = await response.json();
      if (responseJson.articles.length > 0) {
        this.setState({
          page: page + 1,
          isFreshing: false,
          isLoading: false,
          listArticles: listArticles.concat(responseJson.articles),
          totalResults: totalResults + responseJson.articles.length
        });
      }
      else {
        this.setState({ hasMoreArticles: false });
      }
    } catch (error) {
      console.log(error);
      this.setState({ hasError: true, isLoading: false })
    }
  }
  renderItem = ({ item }) => {
    return <FeedItem item={item} />
  }
  onRefresh = async () => {
    const newpage = 1;
    await this.setState({
      isLoading: false,
      isFreshing: true,
      listArticles: [],
      page: newpage,
      totalResults: 0,
      hasError: false,
      hasMoreArticles: true,
      searching: false,
      inputText: ''
    })
    setTimeout(() => {
      this.callAPI(newpage)
    }, 2000);
  }
  onEndReached = () => {
    const { page, hasMoreArticles } = this.state;
    if(hasMoreArticles == true)
      this.callAPI(page);
    else
      console.log("End")
  }
  onChange = text => {
    this.setState({
      inputText: text
    });
  }
  SearchFilterFunction = () => {
    const { inputText, listArticles } = this.state;
    const newData = listArticles.filter(function (item) {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = inputText.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      listArticles: newData,
      totalResults: newData.length,
      hasMoreArticles: false,
      searching: true,
      inputText: '',
    });
  }
  renderFooter = () => {
    const { isFreshing, hasMoreArticles, searching } = this.state;
    if (isFreshing || searching)
      return <ActivityIndicator size='large' color='black' animating={false} />
    if (hasMoreArticles && !isFreshing && !searching)
      return <ActivityIndicator size='large' color='black' animating={true} />
    else
      return (
        <View>
          <Text style={styles.noMoreText}>No More</Text>
          <TouchableOpacity style={styles.buttonEnd} onPress={this.goIndex}>
            <Text>
              <AntDesign style={{ marginRight: 20 }} name='caretup' size={27} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
      )
  }


  goIndex = () => {
    this.flatListRef.scrollToIndex({ animated: true, index: 0 });
  };
  onPressPublished = () => {
    this.setState({ publishedList: true })
  }
  onPressBack = () => {
    this.setState({ publishedList: false })
  }
  render() {
    const { isLoading, listArticles, totalResults, isFreshing, hasError, publishedList, inputText } = this.state;
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size='large' color='black' animating={isLoading} />
        </View>
      )
    }
    if (hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.error}>Not Found 404</Text>
        </View>
      )
    }
    if (publishedList) {
      return (
        <PublishedList onPressBack={this.onPressBack} item={listArticles} />
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.headerGroup}>
          <Text style={styles.title}>ListNews({totalResults})</Text>
          <View style={styles.searchGroup}>
            <TouchableOpacity onPress={() => this.onPressPublished(listArticles)} style={styles.buttonPublish}>
              <Ionicons name='md-person' size={27} color='white' />
            </TouchableOpacity>
            <TextInput style={styles.input} onChangeText={text => this.onChange(text)} value={inputText} placeholder='Search some things ...' />
            <TouchableOpacity style={styles.btnSearch} onPress={this.SearchFilterFunction} style={styles.buttonSearch}>
              <AntDesign name='search1' size={27} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.contentGroup}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            ref={(ref) => { this.flatListRef = ref; }}
            data={listArticles}
            renderItem={this.renderItem}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={this.renderFooter()}
            onRefresh={this.onRefresh}
            refreshing={isFreshing}
          />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGroup: {
    flex: 0.15,
    flexDirection: 'column',
    marginTop: 15,
    alignItems: 'center',
    marginRight: 3
  },
  contentGroup: {
    flex: 0.85,
    marginTop: 5
  },
  searchGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 40,
    fontWeight: 'bold'
  },
  noMoreText: {
    fontWeight: 'bold',
    color: 'red',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5
  },
  buttonEnd: {
    alignSelf: "center",
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'black',
    marginTop: 5,
    borderRadius: 5,
    paddingVertical: 6,
    marginBottom: 5,
  },
  buttonSearch: {
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 5,
    paddingVertical: 6,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 2
  },
  buttonPublish: {
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 5,
    paddingVertical: 6,
    marginBottom: 5,
    marginLeft: 5,
    marginRight: 5
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 15,
    color: 'black',
    width: '69%',
  },
});

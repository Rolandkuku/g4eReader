import React from "react";
import { StyleSheet, View, SafeAreaView, FlatList } from "react-native";
import { H1, Container, ListItem, Text, Spinner } from "native-base";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import * as rssParser from "react-native-rss-parser";
import { Font } from "expo";
import { Ionicons } from "@expo/vector-icons";

async function getData(type) {
  const url =
    type === "articles"
      ? "http://www.girondins4ever.com/feed"
      : "http://www.girondins4ever.com/breves/feed";
  try {
    const data = await fetch(url);
    const text = await data.text();
    const parsed = await rssParser.parse(text);
    return parsed.items;
  } catch (e) {
    throw new Error("Couldn’t load data.");
  }
}

// UI

const Header = ({ children }) => (
  <View
    style={{
      backgroundColor: "blue",
      padding: 10
    }}
  >
    <H1
      style={{
        color: "white",
        textAlign: "center"
      }}
    >
      {children}
    </H1>
  </View>
);

class ScreenWrapper extends React.PureComponent {
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      ...Ionicons.font
    });
  }

  render() {
    const { children, title } = this.props;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "blue" }}>
        <Header>{title}</Header>
        {children}
      </SafeAreaView>
    );
  }
}

//

class News extends React.PureComponent {
  willFocusListener = this.props.navigation.addListener("didFocus", () => {
    if (this.state.news.length === 0) {
      this.getNews();
    }
  });

  state = {
    loading: false,
    news: [],
    error: ""
  };

  getNews = async () => {
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          const news = await getData("news");
          this.setState({
            news,
            loading: false
          });
        } catch (error) {
          this.setState({
            loading: false,
            error
          });
        }
      }
    );
  };

  render() {
    const { news, loading } = this.state;
    return (
      <ScreenWrapper title="News">
        <Container>
          {news.length === 0 && loading ? <Spinner color="grey" /> : null}
          {news.length > 0 ? (
            <FlatList
              data={news}
              renderItem={({ item, index }) => {
                return (
                  <ListItem>
                    <Text ellipsizeMode="tail" numberOfLines={1}>
                      {item.title}
                    </Text>
                  </ListItem>
                );
              }}
              keyExtractor={({ id }) => id}
              refreshing={loading}
              onRefresh={this.getNews}
            />
          ) : null}
        </Container>
      </ScreenWrapper>
    );
  }
}

class Articles extends React.PureComponent {
  willFocusListener = this.props.navigation.addListener("didFocus", () => {
    if (this.state.articles.length === 0) {
      this.getArticles();
    }
  });

  state = {
    loading: false,
    articles: [],
    error: ""
  };

  getArticles = async () => {
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          const articles = await getData("articles");
          this.setState({
            articles,
            loading: false
          });
        } catch (error) {
          this.setState({
            loading: false,
            error
          });
        }
      }
    );
  };

  render() {
    const { articles, loading } = this.state;
    return (
      <ScreenWrapper title="Articles">
        <Container>
          {articles.length === 0 && loading ? <Spinner color="grey" /> : null}
          {articles.length > 0 ? (
            <FlatList
              data={articles}
              renderItem={({ item, index }) => {
                return (
                  <ListItem>
                    <Text ellipsizeMode="tail" numberOfLines={1}>
                      {item.title}
                    </Text>
                  </ListItem>
                );
              }}
              keyExtractor={({ id }) => id}
              refreshing={loading}
              onRefresh={this.getArticles}
            />
          ) : null}
        </Container>
      </ScreenWrapper>
    );
  }
}

const mainTabNavigator = createBottomTabNavigator({
  News,
  Articles
});

export default createAppContainer(mainTabNavigator);

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-elements";

import { Deck } from "./src";
import { DeckData } from "./src/models";

import DATA from "./assets/mockData/cards.json";

export default class App extends React.Component {
  renderCard(item: DeckData): JSX.Element {
    const { text, uri, id } = item;
    return (
      <Card title={text} image={{ uri }} key={id}>
        <Text style={{ marginBottom: 10 }}>Customizable Text right hurr.</Text>
        <Button
          title="Press Me."
          icon={{ name: "code" }}
          backgroundColor="#03A9F4"
          onPress={() => {}}
        />
      </Card>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck data={DATA} renderCard={this.renderCard} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

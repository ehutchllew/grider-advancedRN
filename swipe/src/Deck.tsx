import React, { Component } from "react";
import { View, Animated } from "react-native";

import { DeckData } from "./models";

interface Props {
  renderCard: () => void;
  renderNoMoreCards: () => void;
  data: Array<DeckData>;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

class Deck extends Component<Props> {
  static defaultProps: Props;

  render() {
    return <View />;
  }
}

Deck.defaultProps = {
  renderCard: () => {},
  renderNoMoreCards: () => {},
  data: [],
  onSwipeRight: () => {},
  onSwipeLeft: () => {}
};

export default Deck;

import React, { Component } from "react";
import {
  View,
  Animated,
  PanResponder,
  PanResponderInstance
} from "react-native";

import { DeckData } from "./models";

interface Props {
  renderCard: (item: DeckData) => Array<DeckData>;
  renderNoMoreCards: () => void;
  data: Array<DeckData>;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

class Deck extends Component<Props> {
  static defaultProps: Props;
  panResponder: PanResponderInstance;
  constructor(props: Props) {
    super(props);

    this.panResponder = PanResponder.create({});
  }

  renderCards() {
    const { data, renderCard } = this.props;
    return data.map(item => {
      return renderCard(item);
    });
  }

  render() {
    return <View>{this.renderCards()}</View>;
  }
}

Deck.defaultProps = {
  renderCard: ([]) => [],
  renderNoMoreCards: () => {},
  data: [],
  onSwipeRight: () => {},
  onSwipeLeft: () => {}
};

export default Deck;

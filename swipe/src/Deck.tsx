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
  position: Animated.AnimatedValueXY;
  constructor(props: Props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: e => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: () => {}
    });
  }

  renderCards() {
    const { data, renderCard } = this.props;
    return data.map(item => {
      return renderCard(item);
    });
  }

  render() {
    return (
      <Animated.View
        style={this.position.getLayout()}
        {...this.panResponder.panHandlers}
      >
        {this.renderCards()}
      </Animated.View>
    );
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

import React, { Component } from "react";
import {
  View,
  Animated,
  PanResponder,
  PanResponderInstance,
  Dimensions,
  NativeScrollEvent,
  PanResponderGestureState,
  GestureResponderEvent
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
  WIDTH: number;
  constructor(props: Props) {
    super(props);

    this.position = new Animated.ValueXY();
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: e => true,
      onPanResponderMove: (evt, gesture) => {
        this.position.setValue({
          x: gesture.dx,
          y: gesture.dy
        });
      },
      onPanResponderRelease: (evt, gesture) => {
        this.snapToPosition(evt, gesture);
      }
    });

    this.WIDTH = Dimensions.get("window").width;
  }

  getCardStyle(): any {
    const { position, WIDTH } = this;
    const rotate = position.x.interpolate({
      inputRange: [-WIDTH, 0, WIDTH],
      outputRange: ["-90deg", "0deg", "90deg"]
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    };
  }

  renderCards(): any {
    const { data, renderCard } = this.props;
    return data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...this.panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }
      return renderCard(item);
    });
  }

  snapToPosition(
    evt: GestureResponderEvent,
    gesture: PanResponderGestureState
  ): void {
    if (Math.abs(gesture.dx) > 150) {
      return Animated.spring(this.position, {
        toValue: {
          x: (this.WIDTH + 1) * (gesture.dx / Math.abs(gesture.dx)),
          y: 0
        }
      }).start();
    }
    return Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
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

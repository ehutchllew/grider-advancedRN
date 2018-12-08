import React, { Component } from "react";
import {
  View,
  Animated,
  LayoutAnimation,
  PanResponder,
  PanResponderInstance,
  Dimensions,
  PanResponderGestureState,
  GestureResponderEvent,
  StyleSheet,
  UIManager
} from "react-native";

import { DeckData } from "./models";

interface Props {
  renderCard: (item: DeckData) => Array<DeckData>;
  renderNoMoreCards: () => Array<JSX.Element>;
  data: Array<DeckData>;
  onSwipeRight: (item: DeckData) => void;
  onSwipeLeft: (item: DeckData) => void;
}

interface State {
  index: number;
}

class Deck extends Component<Props, State> {
  static defaultProps: Props;
  panResponder: PanResponderInstance;
  position: Animated.AnimatedValueXY;
  WIDTH: number;
  SWIPE_THRESHOLD: number;

  constructor(props: Props) {
    super(props);

    this.state = {
      index: 0
    };

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
    this.SWIPE_THRESHOLD = this.WIDTH / 3;
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.data !== this.props.data) {
      this.setState({ index: 0 });
    }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);

    LayoutAnimation.spring();
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

  onSwipeComplete(direction: number): void {
    const { data, onSwipeLeft, onSwipeRight } = this.props;
    const { index } = this.state;
    const activeItem = data[index];

    direction > 0 ? onSwipeRight(activeItem) : onSwipeLeft(activeItem);

    this.position.setValue({ x: 0, y: 0 });
    this.setState(prevState => ({
      index: prevState.index + 1
    }));
  }

  renderCards(): any {
    const { data, renderCard, renderNoMoreCards } = this.props;

    if (this.state.index >= data.length) return renderNoMoreCards();

    return data
      .map((item, ind) => {
        if (ind < this.state.index) return null;
        if (ind === this.state.index) {
          return (
            <Animated.View
              key={item.id}
              style={[this.getCardStyle(), styles.cardStyle]}
              {...this.panResponder.panHandlers}
            >
              {renderCard(item)}
            </Animated.View>
          );
        }
        return (
          <Animated.View
            key={item.id}
            style={[styles.cardStyle, { top: 10 * (ind - this.state.index) }]}
          >
            {renderCard(item)}
          </Animated.View>
        );
      })
      .reverse();
  }

  snapToPosition(
    evt: GestureResponderEvent,
    gesture: PanResponderGestureState
  ): void {
    const gestureClone = { ...gesture };
    if (Math.abs(gestureClone.dx) > this.SWIPE_THRESHOLD) {
      return Animated.timing(this.position, {
        toValue: {
          x: (this.WIDTH + 1) * (gestureClone.dx / Math.abs(gestureClone.dx)),
          y: 0
        },
        duration: 250
      }).start(() => this.onSwipeComplete(gestureClone.dx));
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

const styles: any = StyleSheet.create({
  cardStyle: {
    position: "absolute",
    width: Dimensions.get("window").width
  }
});

export default Deck;

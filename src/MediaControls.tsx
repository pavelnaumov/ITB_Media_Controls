import React, { useState, useEffect } from 'react';
import { View, Animated, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import styles from './MediaControls.style';
import { PLAYER_STATES } from './constants/playerStates';
import { Controls } from './Controls';
import { Slider } from './Slider';
import { Toolbar } from './Toolbar';

interface MediaControlsComposition {
  Toolbar: React.FC;
}

export type Props = {
  duration: number;
  fadeOutDelay?: number;
  isFullScreen: boolean;
  isLoading: boolean;
  mainColor: string;
  onFullScreen?: (event: GestureResponderEvent) => void;
  onPaused: (playerState: PLAYER_STATES) => void;
  onReplay: () => void;
  onSeek: (value: number) => void;
  onSeeking: (value: number) => void;
  playerState: PLAYER_STATES;
  progress: number;
  showOnStart?: boolean;
  showControls: boolean;
  sliderPosition: {}
};

const MediaControls: React.FC<Props> & MediaControlsComposition = (props) => {
  const {
    children,
    duration,
    fadeOutDelay = 5000,
    isLoading = false,
    mainColor = 'rgba(12, 83, 175, 0.2)',
    onFullScreen,
    onReplay: onReplayCallback,
    onSeek,
    onSeeking,
    playerState,
    progress,
    sliderPosition,
    showControls = true,
    showOnStart = true,
  } = props;
  const { initialOpacity, initialIsVisible } = (() => {
    if (showOnStart) {
      return {
        initialOpacity: 1,
        initialIsVisible: true,
      };
    }

    return {
      initialOpacity: 0,
      initialIsVisible: false,
    };
  })();

  const [opacity] = useState(new Animated.Value(initialOpacity));
  const [isVisible, setIsVisible] = useState(initialIsVisible);

  useEffect(() => {
    setIsVisible(showControls);
  }, [showControls]);

  // const fadeOutControls = (delay = 0) => {
  //   Animated.timing(opacity, {
  //     toValue: 0,
  //     duration: 300,
  //     delay,
  //     useNativeDriver: false,
  //   }).start((result) => {
  //     /* I noticed that the callback is called twice, when it is invoked and when it completely finished
  //     This prevents some flickering */
  //     if (result.finished) {
  //       setIsVisible(false);
  //     }
  //   });
  // };

  const fadeInControls = (loop = true) => {
    setIsVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: 0,
      useNativeDriver: false,
    }).start(() => {
      if (loop) {
        // fadeOutControls(fadeOutDelay);
      }
    });
  };

  const onReplay = () => {
    // fadeOutControls(fadeOutDelay);
    onReplayCallback();
  };

  const cancelAnimation = () => opacity.stopAnimation(() => setIsVisible(true));

  const onPause = () => {
    const { playerState, onPaused } = props;
    const { PLAYING, PAUSED } = PLAYER_STATES;

    const newPlayerState = playerState === PLAYING ? PAUSED : PLAYING;
    return onPaused(newPlayerState);
  };

  // const animationFade = () => {
  //   // value is the last value of the animation when stop animation was called.
  //   // As this is an opacity effect, I (Charlie) used the value (0 or 1) as a boolean
  //   opacity.stopAnimation((value: number) => {
  //     setIsVisible(!!value);
  //     return value ? fadeOutControls() : fadeInControls();
  //   });
  // };

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      {isVisible && (
        <View style={styles.container}>
          <View style={[styles.controlsRow, styles.toolbarRow]}>{children}</View>

          <Controls
            onPause={onPause}
            onReplay={onReplay}
            isLoading={isLoading}
            mainColor={mainColor}
            playerState={playerState}
          />
          <Slider
            progress={progress}
            duration={duration}
            mainColor={mainColor}
            onFullScreen={onFullScreen}
            playerState={playerState}
            onSeek={onSeek}
            onSeeking={onSeeking}
            onPause={onPause}
            sliderPosition={sliderPosition}
          />
        </View>
      )}
    </Animated.View>
  );
};

MediaControls.Toolbar = Toolbar;

export default MediaControls;

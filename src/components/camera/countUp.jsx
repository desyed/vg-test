/* eslint-disable react/no-object-type-as-default-prop */
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { View, Text } from "react-native";
function CountUp({
  isRunning = false,
  isReset = false,
  limit = 0,
  onLimitReached = _.noop
}) {
  // state to store time
  const [time, setTime] = useState(0);

  // Method to reset timer back to 0
  const reset = () => {
    setTime(0);
  };

  useEffect(() => {
    if (isReset) {
      reset();
    }
  }, [isReset]);

  // state to check stopwatch running or not

  useEffect(() => {
    let intervalId = null;

    if (isRunning) {
      if (Math.floor((time % 6000) / 100) === limit) {
        onLimitReached();
        // notifications.show({
        //     title: 'Time Limit Reached',
        //     message: 'Your time limit has been reached.'
        // })
      } else {
        intervalId = setInterval(() => setTime(time + 1), 10);
      }
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
    }

    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  // Hours calculation
  // const hours = Math.floor(time / 360000)

  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);

  // Milliseconds calculation
  // const milliseconds = time % 100

  // Method to start and stop timer

  return (
    <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{color: '#fff'}}>
        {minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </Text>
    </View>
  );
}

export default CountUp;

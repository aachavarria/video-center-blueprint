/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useRef, useState } from 'react';
import VideoDurationControl from './VideoDurationControl';
import BoundsControl from './BoundsControl';
import PlayBackTimeControl from './PlayBackTimeControl';
import { formatSeconds, usePlayer } from './util';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import FiberSmartRecordIcon from '@material-ui/icons/FiberSmartRecord';

export default function ClippingControlsVideoJSAdapter(props) {
  const player = usePlayer(props.id);
  const [duration, setDuration] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playBackTime, setPlayBackTime] = useState(0);
  const [workingBounds, setWorkingBounds] = useState({
    start: 0,
    end: null
  });
  const [clipBounds, setClipBounds] = useState({
    start: 0,
    end: null
  });

  const playTimeBounds = useRef({
    start: 0,
    end: null
  });

  useEffect(() => {
    player().on('loadedmetadata', () => {
      const _duration = player().duration();
      if (_duration === Infinity) {
        setIsLive(true);
      }
      setDuration(player().duration());
    });

    player().on('timeupdate', () => {
      const _currentTime = player().currentTime();
      if (playTimeBounds.current.end && _currentTime >= playTimeBounds.current.end) {
        player().pause();
      }
      setCurrentTime(_currentTime);
    });

  }, []);


  const onSetTime = (time) => {
    setCurrentTime(time);
    player().currentTime(time);
  };

  const onStartHere = (time) => {
    onSetClipBounds([clipBounds.start + time, clipBounds.end]);
  };

  const onEndHere = (time) => {
    onSetClipBounds([clipBounds.start, clipBounds.start + time]);
  };

  const onSetWorkingBounds = (value) => {
    const [start, end] = value;
    onSetClipBounds(value);
    setWorkingBounds({ start, end });
  };

  const onSetClipBounds = (value) => {
    const [start, end] = value;
    if (clipBounds.start !== start) {
      onSetTime(start);
    } else if (currentTime > end) {
      onSetTime(clipBounds.end - clipBounds.start);
    }
    playTimeBounds.current = { start, end };
    setClipBounds({ start, end });
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <section className={props.classes?.controls}>
        <div className={props.classes?.control}>
          <VideoDurationControl
            duration={isLive ? <span
              className={props.classes?.live}
            >Live <FiberSmartRecordIcon /></span> : formatSeconds(duration)}
          />
        </div>
        <div className={props.classes?.control}>
          <BoundsControl
            disabled={isLive}
            start={workingBounds.start}
            end={workingBounds.end ?? duration}
            max={duration}
            onChange={onSetWorkingBounds}
            label="Working bounds"
          />
        </div>
        <div className={props.classes?.control}>
          <PlayBackTimeControl
            disabled={isLive}
            currentTime={clipBounds.start > 0 ? currentTime - clipBounds.start : currentTime}
            max={isLive ? currentTime : (clipBounds.end ?? duration) - clipBounds.start}
            onChange={(value) => onSetTime(clipBounds.start + value)}
            onStartHere={onStartHere}
            onEndHere={onEndHere}
            label="Playback Time"
          />
        </div>
        <div className={props.classes?.control}>
          <BoundsControl
            disabled={isLive}
            start={clipBounds.start}
            end={clipBounds.end ?? duration}
            min={workingBounds.start}
            max={workingBounds.end ?? duration}
            onChange={onSetClipBounds}
            label="Clip bounds"
          />
        </div>
      </section>
    </MuiPickersUtilsProvider>
  );
}

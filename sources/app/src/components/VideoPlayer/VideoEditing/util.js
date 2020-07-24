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

import { useCallback } from 'react';
import videojs from 'video.js';
import moment from 'moment';

export function usePlayer(id) {
  return useCallback(() => videojs.getPlayer(id), [id]);
}

export const formatSeconds = (value) => {
  let duration = moment.duration(value, 'seconds');
  let days = duration.days();
  let hours = addZero(duration.hours());
  let minutes = addZero(duration.minutes());
  let seconds = addZero(duration.seconds());
  return days ? `${days}d ${hours}:${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
};

function addZero(number) {
  return (number < 10 ? '0' : '') + number;
}

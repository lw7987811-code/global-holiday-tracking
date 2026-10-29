/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { UserH5View } from './components/UserH5View';
import { OperationConsole } from './components/OperationConsole';
import {
  initialConfig,
  initialOverseasTrackers,
  initialAnalysts,
  initialNews,
  initialLiveStreams,
  initialCheckInDays,
} from './mockData';
import { AppConfig, OverseasTrackerItem, AnalystComment, HolidayNewsItem, LiveStreamItem, CheckInDay } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'h5' | 'admin'>('h5');

  // Application state
  const [config, setConfig] = useState<AppConfig>(initialConfig);
  const [publishedConfig, setPublishedConfig] = useState<AppConfig>(initialConfig);
  const [trackers, setTrackers] = useState<OverseasTrackerItem[]>(initialOverseasTrackers);
  const [analysts] = useState<AnalystComment[]>(initialAnalysts);
  const [news] = useState<HolidayNewsItem[]>(initialNews);
  const [liveStreams] = useState<LiveStreamItem[]>(initialLiveStreams);
  const [checkInDays] = useState<CheckInDay[]>(initialCheckInDays);
  const [userPoints, setUserPoints] = useState<number>(968);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === 'h5' && (
          <UserH5View
            config={publishedConfig}
            trackers={trackers}
            analysts={analysts}
            news={news}
            liveStreams={liveStreams}
            checkInDays={checkInDays}
            userPoints={userPoints}
            setUserPoints={setUserPoints}
            isCheckedIn={isCheckedIn}
            setIsCheckedIn={setIsCheckedIn}
          />
        )}

        {activeTab === 'admin' && (
          <OperationConsole
            config={config}
            setConfig={setConfig}
            trackers={trackers}
            setTrackers={setTrackers}
            onPublishConfig={(newConf) => setPublishedConfig(newConf)}
          />
        )}
      </main>
    </div>
  );
}

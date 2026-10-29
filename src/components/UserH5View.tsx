import React, { useState } from 'react';
import { AppConfig, OverseasTrackerItem, AnalystComment, HolidayNewsItem, LiveStreamItem, CheckInDay } from '../types';
import { Headphones, Check, Play, ChevronDown } from 'lucide-react';

interface UserH5ViewProps {
  config: AppConfig;
  trackers: OverseasTrackerItem[];
  analysts: AnalystComment[];
  news: HolidayNewsItem[];
  liveStreams: LiveStreamItem[];
  checkInDays: CheckInDay[];
  userPoints: number;
  setUserPoints: React.Dispatch<React.SetStateAction<number>>;
  isCheckedIn: boolean;
  setIsCheckedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserH5View: React.FC<UserH5ViewProps> = ({
  config,
  trackers,
  analysts,
  news,
  liveStreams,
  checkInDays,
  userPoints,
  setUserPoints,
  isCheckedIn,
  setIsCheckedIn,
}) => {
  const [newsTagFilter, setNewsTagFilter] = useState<string>('全部');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedEventIds, setExpandedEventIds] = useState<string[]>([]);
  const [activeAnalystIdx, setActiveAnalystIdx] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setUserPoints(prev => prev + 10);
      showToast('签到成功 +10 积分！已同步至积分商城');
    } else {
      showToast('今日已完成签到，请前往积分商城抽奖！');
    }
  };

  const handleReserveLive = (title: string) => {
    showToast(`已成功预约直播：《${title}》`);
  };

  const filteredNews = newsTagFilter === '全部' ? news : news.filter(n => n.tag === newsTagFilter);

  // Theme color mapping
  const themes = {
    blue: {
      gradStart: '#15233F',
      gradEnd: '#1B2A4E',
      accent: '#C8A063',
      badgeBg: 'rgba(200,160,99,0.12)',
      badgeBorder: 'rgba(200,160,99,0.35)',
      liveBadge: '#F86938',
      liveBg: '#FFF1E8',
    },
    red: {
      gradStart: '#7A1A27',
      gradEnd: '#9B1D2F',
      accent: '#E5A93B',
      badgeBg: 'rgba(229,169,59,0.12)',
      badgeBorder: 'rgba(229,169,59,0.35)',
      liveBadge: '#D9381E',
      liveBg: '#FDF2F2',
    },
    orange: {
      gradStart: '#A53818',
      gradEnd: '#D94E1B',
      accent: '#F4A261',
      badgeBg: 'rgba(244,162,97,0.12)',
      badgeBorder: 'rgba(244,162,97,0.35)',
      liveBadge: '#E07A5F',
      liveBg: '#FFF7F2',
    },
  };

  const currentTheme = themes[config.themeColor] || themes.blue;

  return (
    <div className="flex justify-center bg-[#EDE7DA] min-h-[calc(100vh-4rem)] py-6 px-4">
      {toastMessage && (
        <div className="fixed top-20 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-medium border border-amber-500/30 animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Mobile Device Container (375px width) */}
      <div className="w-[375px] bg-[#F7F4EC] rounded-[36px] shadow-[0_20px_50px_rgba(27,42,78,0.25)] overflow-hidden border-[8px] border-slate-900 flex flex-col relative font-sans">
        
        {/* Mobile Status Bar */}
        <div className="bg-[#15233F] text-white px-6 pt-3 pb-1 flex justify-between items-center text-[11px] font-mono select-none">
          <span>19:27</span>
          <div className="w-20 h-3.5 bg-black rounded-full mx-auto absolute left-1/2 transform -translate-x-1/2 top-2"></div>
          <div className="flex items-center space-x-1">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-white rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* ① Hero Banner / Custom Uploaded Banner */}
        {config.heroBannerImg ? (
          <div className="w-full relative overflow-hidden bg-slate-900 shadow-sm">
            <img
              src={config.heroBannerImg}
              alt="活动头图"
              className="w-full h-auto object-cover max-h-48 block"
            />
          </div>
        ) : null}

        {/* If no custom image or always showing title block depending on config, but user requested: "如果确实没有取到头图，就不展示头图" */}
        {/* If config.heroBannerImg is present, we show the image. If not present, we do not show the hero banner section or we show the default title block? User says: "如果确实没有取到头图，就不展示头图" */}

        <div className="flex-1 overflow-y-auto space-y-4 pb-10">
          
          {/* ② Overseas Futures Tracker */}
          <section className="px-4 pt-2">
            <div className="px-1 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-1 h-4 rounded-full mr-2" style={{ background: currentTheme.accent }}></span>
                <h3 className="text-base font-bold text-[#1B2A4E]">外盘追踪</h3>
              </div>
              <span className="text-[10px] font-medium cursor-pointer" style={{ color: currentTheme.accent }} onClick={() => showToast('已加载完整外盘行情数据库')}>查看完整外盘行情 →</span>
            </div>


            <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(27,42,78,0.08)] overflow-hidden">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="text-white" style={{ background: currentTheme.gradEnd }}>
                    <th className="py-2.5 px-3 text-left font-semibold">交易所</th>
                    <th className="py-2.5 px-3 text-left font-semibold">外盘品种</th>
                    <th className="py-2.5 px-3 text-right font-semibold">最新价</th>
                    <th className="py-2.5 px-3 text-right font-semibold">涨跌幅</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(() => {
                    const sorted = [...trackers].sort((a, b) => {
                      const pA = parseFloat(a.changePercent?.replace('%', '') || '0');
                      const pB = parseFloat(b.changePercent?.replace('%', '') || '0');
                      return pB - pA;
                    });
                    const displayTrackers = sorted.length > 6 
                      ? [...sorted.slice(0, 3), ...sorted.slice(-3)] 
                      : sorted;

                    return displayTrackers.map(t => {
                      const isUp = t.changePercent?.startsWith('+');
                      const isDown = t.changePercent?.startsWith('-');
                      const colorClass = isUp ? 'text-[#C8102E]' : isDown ? 'text-[#1A8754]' : 'text-slate-500';

                      return (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-3 text-[11px] text-slate-500 font-mono font-semibold">{t.exchange}</td>
                          <td className="py-3 px-3 font-bold text-[#1B2A4E] text-xs">{t.name}</td>
                          <td className={`py-3 px-3 text-right font-mono font-bold text-xs ${colorClass}`}>
                            {t.lastPrice || '--'}
                          </td>
                          <td className={`py-3 px-3 text-right font-mono font-bold text-xs ${colorClass}`}>
                            {t.changePercent || '0.00%'}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </section>

          {/* ③ Analyst Fast Comments */}
          <section className="px-4 pt-2">
            <div className="px-1 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-1 h-4 rounded-full mr-2" style={{ background: currentTheme.accent }}></span>
                <h3 className="text-base font-bold text-[#1B2A4E]">分析师快评</h3>
              </div>
            </div>


            <div 
              className="relative overflow-x-auto flex space-x-3 pb-4 no-scrollbar snap-x snap-mandatory px-1"
              onScroll={(e) => {
                const scrollLeft = e.currentTarget.scrollLeft;
                const width = 300 + 12; // card width + space-x-3
                const idx = Math.round(scrollLeft / width);
                if (idx !== activeAnalystIdx) setActiveAnalystIdx(idx);
              }}
            >
              {analysts.map((a, idx) => (
                <div
                  key={a.id}
                  className="snap-start shrink-0 w-[300px] bg-white rounded-2xl p-3.5 shadow-[0_8px_24px_rgba(27,42,78,0.10)] border border-slate-100 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded" style={{ background: currentTheme.gradStart }}>快评</span>
                      <span className="text-[10px] text-slate-400 font-mono">{a.time}</span>
                    </div>
                    <h4 className="font-bold text-sm text-[#1B2A4E] mt-1.5 line-clamp-1">{a.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{a.summary}</p>
                  </div>
                  
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[10px] text-slate-500">
                      <strong className="text-[#1B2A4E]">{a.author}</strong> · {a.authorRole}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${a.isUp ? 'bg-rose-50 text-[#C8102E]' : 'bg-emerald-50 text-[#1A8754]'}`}>
                        {a.symbol} {a.changeStr}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            {analysts.length > 1 && (
              <div className="flex justify-center space-x-1.5 mt-1 pb-2">
                {analysts.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${activeAnalystIdx === i ? 'w-4 bg-[#1B2A4E]' : 'w-1 bg-slate-300'}`}
                    style={activeAnalystIdx === i ? { background: currentTheme.accent } : {}}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ④ Global Events */}
          {config.globalEvents && config.globalEvents.length > 0 && (
            <section className="px-4 pt-2">
              <div className="px-1 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-1 h-4 rounded-full mr-2" style={{ background: currentTheme.accent }}></span>
                  <h3 className="text-base font-bold text-[#1B2A4E]">全球事件</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(27,42,78,0.08)] overflow-hidden border border-slate-100">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="text-white" style={{ background: currentTheme.gradEnd }}>
                      <th className="py-2.5 px-3 text-left font-semibold w-24">时间</th>
                      <th className="py-2.5 px-3 text-left font-semibold">事件</th>
                      <th className="py-2.5 px-3 text-right font-semibold w-28">影响品种</th>
                    </tr>
                  </thead>
                </table>
                <div className="max-h-[330px] overflow-y-auto no-scrollbar">
                  <table className="w-full text-xs border-collapse">
                    <tbody className="divide-y divide-slate-100">
                      {(config.globalEvents || []).map((ev, idx) => {
                        const isExpanded = expandedEventIds.includes(ev.id || String(idx));
                        return (
                          <React.Fragment key={ev.id || idx}>
                            <tr className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 text-[11px] text-slate-500 font-mono align-top w-24">{ev.time}</td>
                              <td className="py-2.5 px-3 align-top font-bold text-[#1B2A4E] text-xs">
                                {ev.event}
                              </td>
                              <td className="py-2.5 px-3 text-[11px] text-slate-600 align-top w-28 text-right">
                                <div className="leading-snug">{ev.impact}</div>
                                {ev.details && (
                                  <button
                                    onClick={() => {
                                      const id = ev.id || String(idx);
                                      setExpandedEventIds(prev => 
                                        prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
                                      );
                                    }}
                                    className="mt-1 inline-flex items-center text-[10px] font-medium text-[#1B6EEB] hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                                  >
                                    <span>要点</span>
                                    <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                )}
                              </td>
                            </tr>
                            {isExpanded && ev.details && (
                              <tr className="bg-slate-50">
                                <td colSpan={3} className="px-3 py-2.5 text-[11px] text-slate-700 leading-relaxed border-t border-b border-slate-100">
                                  <span className="font-bold text-[#1B2A4E] mr-1">【关注要点】</span>
                                  {ev.details}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-2 px-1 text-[10px] text-[#3B4A6B]">
                *以上时间均为北京时间，具体时间仅供参考，以实际公布时间为准
              </div>
            </section>
          )}

          {/* ④ Holiday News */}
          <section className="px-4 pt-2">
            <div className="px-1 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-1 h-4 rounded-full mr-2" style={{ background: currentTheme.accent }}></span>
                <h3 className="text-base font-bold text-[#1B2A4E]">假期要闻</h3>
              </div>
              <span className="text-[11px] text-[#3B4A6B] cursor-pointer" onClick={() => showToast('正在跳转至完整要闻列表')}>更多 →</span>
            </div>


            <div className="relative pl-5 space-y-3 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-[#C8A063] before:to-[#C8A063]/20">
              {[...news].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className="relative bg-white rounded-xl p-3.5 shadow-[0_2px_12px_rgba(27,42,78,0.06)] border border-slate-50 before:absolute before:-left-[18.5px] before:top-5 before:w-2 before:h-2 before:rounded-full before:border-2 before:border-[#F7F4EC] before:bg-[#C8A063]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="flex-1 text-[13px] font-bold text-slate-900 leading-[1.4] line-clamp-2">
                      {n.title}
                    </h4>
                    {n.imageUrl && (
                      <div className="shrink-0 w-[72px] h-[48px] rounded-lg overflow-hidden bg-slate-100">
                        <img src={n.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2.5 flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-500">{n.source}</span>
                    <span>{n.time.split(' ')[1] || n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ⑤ Live Streams */}
          <section className="px-4 pt-2">
            <div className="px-1 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-1 h-4 rounded-full mr-2" style={{ background: currentTheme.accent }}></span>
                <h3 className="text-base font-bold text-[#1B2A4E]">直播直击</h3>
              </div>
            </div>

            {/* Live Streams Layout matching mockups */}
            {(() => {
              const mainUpcoming = liveStreams.find(l => l.type === 'upcoming') || liveStreams[0];
              const replayItem = liveStreams.find(l => l.type === 'replay') || liveStreams[1];
              const nextUpcoming = liveStreams.filter(l => l.type === 'upcoming')[1] || liveStreams[2] || liveStreams[0];

              return (
                <div className="space-y-3">
                  {/* Big Card - Upcoming */}
                  {mainUpcoming && (
                    <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(27,42,78,0.08)] border border-slate-100 flex flex-col">
                      {/* Top Blue Gradient Banner */}
                      <div className="relative bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 p-4 text-white overflow-hidden">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="bg-[#E67E22] text-white text-[10px] font-bold px-2 py-0.5 rounded">预告</span>
                          <span className="bg-black/30 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded font-mono">{mainUpcoming.startTime}</span>
                        </div>
                        <h4 className="text-2xl font-black tracking-wider drop-shadow-sm">{mainUpcoming.shortTitle}</h4>
                      </div>

                      {/* Bottom White Card Part */}
                      <div className="p-3.5 flex flex-col justify-between flex-1">
                        <h5 className="text-xs font-bold text-slate-800 line-clamp-2 leading-relaxed mb-3">
                          {mainUpcoming.title}
                        </h5>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div className="flex items-center space-x-1.5 text-slate-600 text-xs">
                            <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">
                              📺
                            </div>
                            <span className="font-medium">{mainUpcoming.speaker}</span>
                          </div>
                          <button
                            onClick={() => handleReserveLive(mainUpcoming.title)}
                            className="px-5 py-1.5 border border-[#E67E22] text-[#E67E22] text-xs rounded-full font-bold hover:bg-amber-50 transition-colors cursor-pointer"
                          >
                            预约
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Small Cards Grid (2 columns) */}
                  <div className="grid grid-cols-2 gap-3 items-stretch">
                    {/* Left Small Card - Replay */}
                    {replayItem && (
                      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(27,42,78,0.06)] border border-slate-100 flex flex-col justify-between h-full">
                        {/* Top Dark Banner */}
                        <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 p-3 text-white overflow-hidden flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center space-x-1">
                                <span className="bg-slate-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">回放</span>
                                <span className="text-[9px] text-slate-300 font-mono">{replayItem.startTime}</span>
                              </div>
                              <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">R3</span>
                            </div>
                            <h5 className="text-xs font-bold truncate">{replayItem.shortTitle}</h5>
                          </div>
                          <div className="mt-2 text-[9px] text-amber-400 font-mono flex items-center">
                            🔥 热度 {replayItem.heat || 1601}
                          </div>
                        </div>

                        {/* Bottom White Part */}
                        <div className="p-3 flex flex-col justify-between">
                          <h6 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mb-2 min-h-[2rem]">
                            {replayItem.title}
                          </h6>
                          <div className="text-[10px] text-slate-500 truncate flex items-center space-x-1 pt-1.5 border-t border-slate-100">
                            <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] shrink-0">📺</span>
                            <span className="truncate">{replayItem.speaker}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Right Small Card - Next Upcoming */}
                    {nextUpcoming && (
                      <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(27,42,78,0.06)] border border-slate-100 flex flex-col justify-between h-full">
                        {/* Top Blue Banner */}
                        <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 p-3 text-white overflow-hidden flex flex-col justify-between flex-1">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center space-x-1">
                                <span className="bg-[#E67E22] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">预告</span>
                                <span className="text-[9px] text-blue-100 font-mono">{nextUpcoming.startTime}</span>
                              </div>
                            </div>
                            <h5 className="text-xs font-bold truncate">{nextUpcoming.shortTitle}</h5>
                          </div>
                          <div className="mt-2 text-[9px] opacity-0 select-none">
                            占位
                          </div>
                        </div>

                        {/* Bottom White Part */}
                        <div className="p-3 flex flex-col justify-between">
                          <h6 className="text-[11px] font-bold text-slate-800 line-clamp-2 leading-tight mb-2 min-h-[2rem]">
                            {nextUpcoming.title}
                          </h6>
                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                            <div className="text-[10px] text-slate-500 truncate flex items-center space-x-1">
                              <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] shrink-0">📺</span>
                              <span className="truncate">{nextUpcoming.speaker}</span>
                            </div>
                            <button
                              onClick={() => handleReserveLive(nextUpcoming.title)}
                              className="px-2.5 py-0.5 border border-[#E67E22] text-[#E67E22] text-[10px] rounded-full font-bold hover:bg-amber-50 cursor-pointer shrink-0"
                            >
                              预约
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </section>

          {/* ⑥ Check-In & Points Mall */}
          <section className="px-4 pt-2">
            <div className="px-1 py-3 flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-1 h-4 rounded-full mr-2" style={{ background: currentTheme.accent }}></span>
                <h3 className="text-base font-bold text-[#1B2A4E]">假期打卡</h3>
              </div>
            </div>


            <div className="relative">
              {!isLoggedIn && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs z-30 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3 text-amber-400">
                    🔒
                  </div>
                  <p className="text-[11px] text-slate-300 mb-4 max-w-[220px] leading-relaxed">
                    参与假期打卡获取专属积分奖励！
                  </p>
                  <button
                    onClick={() => {
                      setIsLoggedIn(true);
                      showToast('登录成功！欢迎回来');
                    }}
                    className="bg-gradient-to-r from-[#C8A063] to-[#E6C58A] text-[#1B2A4E] text-xs font-bold px-6 py-2 rounded-full shadow-md hover:opacity-95 transition-all cursor-pointer"
                  >
                    立即登录打卡
                  </button>
                </div>
              )}

              <div className="bg-gradient-to-br from-[#2D2A32] to-[#1E1C22] rounded-3xl p-4 text-white shadow-[0_10px_30px_rgba(45,42,50,0.25)] border border-[#3C3742]">
              {/* Top Section: Points & Details */}
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-white/70">我的积分</span>
                  <span className="text-[10px] bg-[#3C3742] text-[#D8C4A9] border border-[#D8C4A9]/30 px-2 py-0.5 rounded-full">
                    4积分即将过期
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-black font-mono tracking-tight text-[#F3E8DB]">
                    {userPoints}
                  </div>
                  <button
                    onClick={() => showToast('正在跳转至积分商城抽奖专区')}
                    className="bg-[#E8D8C4] text-[#2D2A32] text-xs font-semibold px-4 py-1.5 rounded-full shadow-xs hover:bg-[#F3E8DB] transition-colors cursor-pointer"
                  >
                    积分抽奖赢好礼
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/15 my-3.5"></div>

              {/* Middle Section: Streak & Reminder Toggle */}
              <div className="flex justify-between items-center mb-3.5 text-xs">
                <span className="text-[#D8D2C9]">已连签3天，明日签到+4积分</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-white/70">签到提醒</span>
                  <div 
                    onClick={() => showToast('已为您开启签到提醒推送')}
                    className="w-9 h-5 bg-[#3C3742] rounded-full relative p-0.5 cursor-pointer transition-colors border border-white/10"
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-md transform translate-x-4 transition-transform"></div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: 7 Days Cards */}
              <div className="grid grid-cols-7 gap-1.5">
                {checkInDays.map((d, index) => {
                  const isChecked = d.isDone || (index === 3 && isCheckedIn);
                  const isPast = index < 3;
                  const isToday = index === 3;

                  return (
                    <div 
                      key={d.day} 
                      className={`rounded-xl p-1.5 flex flex-col items-center justify-between text-center transition-all ${
                        isChecked || isPast
                          ? 'bg-[#3C3742] text-white/50'
                          : 'bg-gradient-to-b from-[#F2E5D5] to-[#E2D0BA] text-[#5A4D3B] shadow-sm'
                      }`}
                      style={{ minHeight: '64px' }}
                    >
                      <span className={`text-[9px] font-medium ${isToday ? 'font-bold text-[#2D2A32]' : ''}`}>
                        {d.label}
                      </span>
                      <div className="my-1">
                        {isChecked || isPast ? (
                          <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center mx-auto text-white/60 text-[10px]">
                            ✓
                          </div>
                        ) : (
                          <div className="text-[11px] font-bold font-mono text-[#8C6D48]">
                            +{index === 3 ? '10' : index + 2}
                          </div>
                        )}
                      </div>
                      <span className="text-[8px] opacity-70">
                        {isChecked ? '已签' : isToday ? '今天' : '积分'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons Below */}
            <div className="flex gap-2.5 mt-3">
              <button
                onClick={handleCheckIn}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  isCheckedIn
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#C8A063] to-[#E6C58A] text-[#1B2A4E] hover:opacity-95'
                }`}
              >
                {isCheckedIn ? '今日已签到' : '立即签到'}
              </button>
              <button
                onClick={() => showToast('已打开积分商城抽奖窗口')}
                className="px-4 py-2.5 rounded-full text-xs font-semibold border border-[#F86938] text-[#F86938] hover:bg-orange-50 bg-white"
              >
                去积分抽奖
              </button>
            </div>
            </div>
          </section>

          <footer className="mt-4 px-6 py-6 text-center bg-gradient-to-b from-[#F7F4EC] to-[#EDE7DA] border-t border-slate-200/60">
            <p className="text-[10px] text-slate-500 leading-relaxed text-center">
              <strong className="text-[#1B2A4E] block mb-1">投资有风险，入市需谨慎</strong>
              本文所有内容在任何情况下均不构成对任何人的投资建议，仅用于交流学习，投资者据此做出的任何投资的一切后果由投资者个人承担。
            </p>
          </footer>

        </div>

        <div className="bg-[#EDE7DA] pb-2 pt-1 flex justify-center">
          <div className="w-32 h-1 bg-slate-400 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};

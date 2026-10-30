import { OverseasTrackerItem, AnalystComment, HolidayNewsItem, LiveStreamItem, CheckInDay, AppConfig } from './types';
import defaultBannerImg from './assets/images/hero_banner_default_1793254437266.jpg';

export const initialOverseasTrackers: OverseasTrackerItem[] = [
  { id: 'tracker-1', exchange: 'COMEX', name: '黄金', focusType: 'opportunity', focusText: '', lastPrice: '2658.4', changePercent: '+1.25%' },
  { id: 'tracker-2', exchange: 'NYMEX', name: 'WTI原油', focusType: 'opportunity', focusText: '', lastPrice: '71.45', changePercent: '+0.85%' },
  { id: 'tracker-3', exchange: 'LME', name: '伦铜', focusType: 'opportunity', focusText: '', lastPrice: '9845.0', changePercent: '-0.32%' },
  { id: 'tracker-4', exchange: 'CBOT', name: '美豆', focusType: 'risk', focusText: '', lastPrice: '1024.5', changePercent: '-1.15%' },
  { id: 'tracker-5', exchange: 'NYMEX', name: '天然气', focusType: 'risk', focusText: '', lastPrice: '2.458', changePercent: '-2.45%' },
  { id: 'tracker-6', exchange: 'ICUS', name: '美元指数', focusType: 'opportunity', focusText: '', lastPrice: '101.45', changePercent: '+0.12%' },
];

export const DEFAULT_SYSTEM_TRACKERS: OverseasTrackerItem[] = [
  { id: 'sys-1', exchange: 'COMEX', name: '黄金', focusType: 'opportunity', focusText: '', lastPrice: '2658.4', changePercent: '+1.25%' },
  { id: 'sys-2', exchange: 'NYMEX', name: 'WTI原油', focusType: 'opportunity', focusText: '', lastPrice: '71.45', changePercent: '+0.85%' },
  { id: 'sys-3', exchange: 'LME', name: '伦铜', focusType: 'opportunity', focusText: '', lastPrice: '9845.0', changePercent: '-0.32%' },
  { id: 'sys-4', exchange: 'CBOT', name: '美豆', focusType: 'risk', focusText: '', lastPrice: '1024.5', changePercent: '-1.15%' },
  { id: 'sys-5', exchange: 'NYMEX', name: '天然气', focusType: 'risk', focusText: '', lastPrice: '2.458', changePercent: '-2.45%' },
  { id: 'sys-6', exchange: 'ICUS', name: '美元指数', focusType: 'opportunity', focusText: '', lastPrice: '101.45', changePercent: '+0.12%' },
  { id: 'sys-7', exchange: 'COMEX', name: '白银', focusType: 'neutral', focusText: '', lastPrice: '31.25', changePercent: '+0.50%' },
  { id: 'sys-8', exchange: 'ICEU', name: '布伦特原油', focusType: 'opportunity', focusText: '', lastPrice: '75.20', changePercent: '+0.70%' },
  { id: 'sys-9', exchange: 'CME', name: '标普500', focusType: 'opportunity', focusText: '', lastPrice: '5750.2', changePercent: '+0.35%' },
];

export function getEffectiveTrackers(configuredTrackers?: OverseasTrackerItem[]): OverseasTrackerItem[] {
  const result: OverseasTrackerItem[] = [];
  const addedKeys = new Set<string>();

  if (configuredTrackers && configuredTrackers.length > 0) {
    for (const item of configuredTrackers) {
      if (result.length >= 6) break;
      const key = `${item.exchange}-${item.name}`.trim();
      if (!addedKeys.has(key)) {
        addedKeys.add(key);
        result.push(item);
      }
    }
  }

  if (result.length < 6) {
    for (const sysItem of DEFAULT_SYSTEM_TRACKERS) {
      if (result.length >= 6) break;
      const key = `${sysItem.exchange}-${sysItem.name}`.trim();
      if (!addedKeys.has(key)) {
        addedKeys.add(key);
        result.push(sysItem);
      }
    }
  }

  return result;
}

export const initialConfig: AppConfig = {
  themeColor: 'blue',
  heroTitle: '假期外盘热点追踪',
  heroSub: '双节专题 · 假期不打烊',
  heroBannerImg: defaultBannerImg,
  updateTimeStr: '10月04日 22:00',
  fallbackFocusType: '',
  fallbackFocusText: '',
  coreTrackers: initialOverseasTrackers,
  globalEvents: [
    { id: 'ge-1', time: '9月30日 9:30', event: '中国9月官方制造业PMI', details: '制造业PMI是衡量制造业景气程度的先行指标，以50%为荣枯线。关注公布值与预测值的比较，如果高于预测值，短期市场情绪或受提振；同时关注分项指数变化。', impact: '国内工业品' },
    { id: 'ge-2', time: '9月30日 20:15', event: '美国9月ADP就业人数', details: 'ADP数据反映美国私营部门的就业人数月度变化，也称为“小非农”。关注公布值与预测值的比较，如果高于预测值，或将对贵金属、有色价格短期形成一定压制作用。', impact: '贵金属、有色等' },
    { id: 'ge-3', time: '9月30日 20:30', event: '美国8月核心PCE物价指数', details: '核心PCE物价指数是美联储衡量通胀的关键指标，美联储当前仍对其2%的长期目标态度坚定。如果该指标出现超预期反弹，或将进一步加强美联储紧缩预期，对贵金属、有色价格或形成一定压制作用。', impact: '贵金属、有色等' },
    { id: 'ge-4', time: '10月1日 0:00', event: 'USDA季度谷物库存报告', details: '季度谷物库存情况，包括农场内存库和农场外库存，反映市场对谷物需求的强弱程度。如果库存显著低于预期，或对品种价格形成一定支撑。', impact: '玉米、大豆、小麦等' },
    { id: 'ge-5', time: '10月1日 20:30', event: '美国当周初请失业金人数', details: '初请数据统计的是上一周首次申请失业救济的人数，是衡量美国劳动力市场健康程度的高频指标。如果初请数据持续超预期上升，或引发市场对美国就业情况的担忧，或对贵金属、有色价格形成一定支撑作用。', impact: '贵金属、有色等' },
    { id: 'ge-6', time: '10月2日 20:30', event: '美国9月非农就业人口、失业率', details: '8月非农数据超预期走强，关注9月数据能否维持强势表现。如果延续强劲，或将进一步强化美联储加息预期，从而压制贵金属、有色。', impact: '贵金属、有色等' },
    { id: 'ge-7', time: '10月4日', event: 'OPEC+会议', details: '关注产量政策走向，当前内部对2027年配额分配存在博弈，关注10月会议上会否对2027年产量基准线进行谈判。', impact: '原油、原油系、油化工板块' },
    { id: 'ge-8', time: '假期期间持续关注', event: '厄尔尼诺现象', details: '当前市场对厄尔尼诺现象预期较强，关注其强度变化及部分农产品供应端的实质性冲击。注意减产兑现的滞后性及天气状况的反复。', impact: '棕榈油、天然橡胶、白糖、棉花、大豆等' },
    { id: 'ge-9', time: '假期期间持续关注', event: '中东地缘局势', details: '地缘局势反复且存在外溢风险，霍尔木兹海峡与曼德海峡双向通行受阻。节日期间关注地缘局势变化及海峡通行状况，关注外盘能源化工品种表现。', impact: '原油、原油系、油化工板块、贵金属有色等' },
    { id: 'ge-10', time: '假期期间持续关注', event: '美联储官员讲话', details: '9月FOMC会议加息落地，同时上修点阵图。美联储官员讲话或将影响市场对利率路径的预期。如果讲话偏鹰，强调通胀高企，或对黄金短期形成一定压力；如果讲话偏鸽，暗示通胀可控，或为贵金属提供喘息之机。同时也需关注其他因素的影响，如地缘局势变化、美国经济数据表现等。', impact: '贵金属、有色等' },
  ],
};

export const initialAnalysts: AnalystComment[] = [
  {
    id: 'a1',
    title: '重启加息，利好落尽还是继续埋伏？',
    summary: '北京时间 9 月 17 日凌晨，美联储公布了 9 月议息会议结果。一、利率决议结果（1）加息了。',
    time: '11:03',
    timestamp: Date.now() - 3600 * 1000 * 1.5,
    author: '张驰宁',
    authorRole: '市场分析师',
    symbol: '沪金',
    changeStr: '-0.49%',
    isUp: false,
    hasAudio: true,
  },
  {
    id: 'a2',
    title: '原油短线冲高乏力，回踩支撑关注点',
    summary: 'OPEC+ 延长减产决议落地后买盘兑现，WTI 在 75 美元一线承压。关注今晚 EIA 库存指引短线方向。',
    time: '09:42',
    timestamp: Date.now() - 3600 * 1000 * 3,
    author: '陈昊',
    authorRole: '能源分析师',
    symbol: '原油',
    changeStr: '+0.83%',
    isUp: true,
    hasAudio: true,
  },
  {
    id: 'a3',
    title: '美元指数破位下行，人民币资产迎估值修复',
    summary: 'DXY 跌破 100 关口，外资流入新兴市场迹象明显。节后 A 股、港股或迎来估值修复窗口。',
    time: '08:15',
    timestamp: Date.now() - 3600 * 1000 * 5,
    author: '李婉清',
    authorRole: '宏观分析师',
    symbol: '美元',
    changeStr: '-0.62%',
    isUp: false,
    hasAudio: true,
  },
];

export const initialNews: HolidayNewsItem[] = [
  {
    id: 'n1',
    time: '10-04 10:30',
    tag: '宏观',
    title: '非农数据大超预期，美联储 11 月降息 50BP 预期降温',
    content: '美国 9 月非农就业人数增加 25.4 万人，失业率意外降至 4.1%，薪资环比增长 0.4%。',
    source: '华尔街见闻',
    timestamp: 1728009000000,
    imageUrl: 'https://picsum.photos/id/1060/200/150',
    isLead: true,
  },
  {
    id: 'n2',
    time: '10-04 09:15',
    tag: '行业',
    title: '中东局势升级风险加大，原油价格宽幅震荡',
    content: '拜登称正在讨论以色列打击伊朗石油设施的可能性，布伦特原油一度冲破 78 美元。',
    source: '路透社',
    timestamp: 1728004500000,
    imageUrl: 'https://picsum.photos/id/445/200/150',
  },
  {
    id: 'n3',
    time: '10-03 22:00',
    tag: '行业',
    title: '美国 9 月 ISM 服务业 PMI 创一年半新高',
    content: '录得 54.9，远超预期的 51.7。订单指数大幅飙升，反映美国经济仍具韧性。',
    source: '财联社',
    timestamp: 1727964000000,
  },
  {
    id: 'n4',
    time: '10-03 15:45',
    tag: '行业',
    title: '美东码头大罢工协议达成，危机暂时解除',
    content: 'ILA 工会与雇主达成初步协议，涨薪幅度约为 62%，码头工人即刻复工。',
    source: '新浪财经',
    timestamp: 1727941500000,
  },
  {
    id: 'n5',
    time: '10-02 20:30',
    tag: '宏观',
    title: '欧元区 9 月 PMI 跌破荣枯线，经济复苏乏力',
    content: '制造业 PMI 录得 49.2，服务业 51.4，欧元兑美元盘中跌至 1.1020。',
    source: '彭博',
    timestamp: 1727872200000,
  },
  {
    id: 'n6',
    time: '10-01 19:00',
    tag: '外盘',
    title: '黄金创历史新高，中东局势推升避险需求',
    content: '伦敦金现突破 2,650 美元/盎司，白银跟随上涨 3.1%，节后沪金沪银关注高开风险。',
    source: '金十数据',
    timestamp: 1727780400000,
    imageUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?q=80&w=300&auto=format&fit=crop',
  },
];

export const initialLiveStreams: LiveStreamItem[] = [
  {
    id: 'l1',
    title: '【君期收评】碳酸锂失守9万，铁矿反弹后承压',
    shortTitle: '君期收评',
    startTime: '10-29 15:30',
    duration: '60分钟',
    speaker: '张驰宁',
    role: '市场分析师',
    type: 'upcoming',
    tag: '交易日周二至周五 · 15:30',
    status: 'upcoming',
    avatarLetter: '张',
  },
  {
    id: 'l2',
    title: '【钢言炼语】黑色商品月度策略（第6期）',
    shortTitle: '黑色商品月度策略',
    startTime: '10-14 15:00',
    duration: '45分钟',
    speaker: '李亚飞·刘豫武·樊园园',
    role: '资深黑色分析师',
    type: 'replay',
    tag: 'R3',
    heat: 1601,
    status: 'ended',
    avatarLetter: '李',
  },
  {
    id: 'l3',
    title: '【外盘复盘】美联储降息预期下贵金属与原油走势',
    shortTitle: '外盘波动深度复盘',
    startTime: '10-30 20:00',
    duration: '50分钟',
    speaker: '王晓光',
    role: '高级宏观分析师',
    type: 'upcoming',
    tag: '交易日周三 · 20:00',
    status: 'upcoming',
    avatarLetter: '王',
  },
];

export const initialCheckInDays: CheckInDay[] = [
  { day: '1', dateStr: '周一', label: '周一', isDone: true },
  { day: '2', dateStr: '周二', label: '周二', isDone: true },
  { day: '3', dateStr: '周三', label: '周三', isDone: true },
  { day: '4', dateStr: '今天', label: '今天', isDone: false },
  { day: '5', dateStr: '周五', label: '周五', isDone: false },
  { day: '6', dateStr: '周六', label: '周六', isDone: false },
  { day: '7', dateStr: '周日', label: '周日', isDone: false },
];

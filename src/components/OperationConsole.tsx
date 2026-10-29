import React, { useState } from 'react';
import { AppConfig, OverseasTrackerItem } from '../types';
import { Settings, Plus, Trash2, Edit2, Save, Check, Image as ImageIcon, Palette, Globe, ChevronRight, Home, Layout, FileText, Search, User, Bell, Calendar, Mail, MessageSquare } from 'lucide-react';
import * as XLSX from 'xlsx';

interface OperationConsoleProps {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  trackers: OverseasTrackerItem[];
  setTrackers: React.Dispatch<React.SetStateAction<OverseasTrackerItem[]>>;
  onPublishConfig?: (newConfig: AppConfig) => void;
}

const getProductsByExchange = (exchange: string): string[] => {
  const mapping: Record<string, string[]> = {
    CBOT: ['美豆', '美玉米', '美小麦'],
    CME: ['标普500', '纳指', '黄金'],
    COMEX: ['黄金', '白银'],
    NYMEX: ['WTI原油', '天然气'],
    ICUS: ['美元指数', '棉花'],
    ICEU: ['布伦特原油', '可可'],
    LME: ['伦铜', '伦铝'],
  };
  return mapping[exchange] || [];
};

export const OperationConsole: React.FC<OperationConsoleProps> = ({
  config,
  setConfig,
  trackers,
  setTrackers,
  onPublishConfig,
}) => {
  const [saveToast, setSaveToast] = useState(false);
  const [bannerImage, setBannerImage] = useState<string>(config.heroBannerImg || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [excelNotice, setExcelNotice] = useState<string | null>(null);

  // New tracker state (Top Form)
  const [newExchange, setNewExchange] = useState<'' | 'CBOT' | 'CME' | 'COMEX' | 'NYMEX' | 'ICUS' | 'ICEU' | 'LME'>('');
  const [newName, setNewName] = useState('');

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBannerImage(result);
        setConfig(prev => ({ ...prev, heroBannerImg: result }));
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = () => {
    // 校验 1：必须上传头图图片
    if (!bannerImage) {
      setErrorMsg('保存发布失败：请先上传头图图片！');
      setSaveToast(false);
      return;
    }

    // 校验通过，允许保存发布
    setErrorMsg(null);
    const updatedConfig = {
      ...config,
      heroBannerImg: bannerImage,
    };
    setConfig(updatedConfig);
    if (onPublishConfig) {
      onPublishConfig(updatedConfig);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const addTracker = () => {
    if (!newName || !newExchange) return;
    
    const normName = newName.trim();
    const existingIndex = trackers.findIndex(t => t.name.trim() === normName);
    
    const newItem: OverseasTrackerItem = {
      id: existingIndex >= 0 ? trackers[existingIndex].id : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      exchange: newExchange as 'CBOT' | 'CME' | 'COMEX' | 'NYMEX' | 'ICUS' | 'ICEU' | 'LME',
      name: normName,
      focusType: 'opportunity',
      focusText: '',
      lastPrice: '--',
      changePercent: '0.00%',
    };

    if (existingIndex >= 0) {
      const nextTrackers = [...trackers];
      nextTrackers[existingIndex] = newItem;
      setTrackers(nextTrackers);
    } else {
      setTrackers([...trackers, newItem]);
    }

    setNewExchange('');
    setNewName('');
  };

  const deleteTracker = (id: string) => {
    setTrackers(trackers.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F0F2F5] text-slate-800 flex flex-col font-sans select-none">
      
      {/* OMS Top Navigation Bar */}
      <div className="bg-[#1B6EEB] text-white h-12 px-4 flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 font-bold text-sm tracking-wide">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-[#1B6EEB] shadow">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <span>超体APP</span>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-white/80">
            <span className="px-3 py-1 hover:bg-white/10 rounded cursor-pointer">机构配置</span>
            <span className="px-3 py-1 hover:bg-white/10 rounded cursor-pointer">APP配置</span>
            <span className="px-3.5 py-1 bg-white/20 rounded font-medium text-white">运营配置</span>
            <span className="px-3 py-1 hover:bg-white/10 rounded cursor-pointer">资讯研报</span>
            <span className="px-3 py-1 hover:bg-white/10 rounded cursor-pointer">系统配置</span>
            <span className="px-3 py-1 hover:bg-white/10 rounded cursor-pointer">模拟交易</span>
            <span className="px-3 py-1 hover:bg-white/10 rounded cursor-pointer">投放链接</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="bg-white/10 px-3 py-1 rounded text-white/90">应用中心</span>
          <Home className="w-4 h-4 cursor-pointer hover:text-amber-300" />
          <Calendar className="w-4 h-4 cursor-pointer hover:text-amber-300" />
          <MessageSquare className="w-4 h-4 cursor-pointer hover:text-amber-300" />
          <Mail className="w-4 h-4 cursor-pointer hover:text-amber-300" />
          <div className="flex items-center space-x-1 cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-slate-300 flex items-center justify-center text-slate-800 font-bold text-[10px]">王</div>
            <span>管理员</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* OMS Left Sidebar */}
        <div className="w-56 bg-white border-r border-slate-200 hidden md:flex flex-col text-xs">
          <div className="p-3 border-b border-slate-100">
            <div className="flex items-center bg-slate-100 rounded px-2 py-1.5 text-slate-400">
              <Search className="w-3.5 h-3.5 mr-2" />
              <input type="text" placeholder="搜索菜单..." className="bg-transparent border-none focus:outline-none text-slate-700 w-full text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2 space-y-0.5 text-slate-600 font-medium">
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>营销工具</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>广告资源位</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>小程序管理</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>期货学堂</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>直播配置</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>增值服务</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>口袋技术指标</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            {/* Active Activity Config Menu */}
            <div className="bg-blue-50/80 text-[#1B6EEB] border-r-2 border-[#1B6EEB]">
              <div className="px-4 py-2 font-bold flex justify-between items-center cursor-pointer">
                <span>活动配置</span>
                <ChevronRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="pl-6 pr-4 py-1.5 space-y-1 text-xs">
                <div className="py-1.5 px-2 text-slate-600 hover:text-[#1B6EEB] cursor-pointer">活动中心列表</div>
                <div className="py-1.5 px-2 bg-[#1B6EEB] text-white rounded font-bold shadow-xs">假期外盘热点追踪</div>
              </div>
            </div>
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>客户分级管理</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center">
              <span>手续费托管</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Breadcrumb & Header */}
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="text-xs text-slate-400 mb-1">
                超体APP首页 &gt; 活动配置 &gt; <span className="text-[#1B6EEB] font-bold">假期外盘热点追踪</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">假期外盘热点追踪 - 运营配置管理</h1>
            </div>
            <button
              onClick={handleSaveAll}
              className="flex items-center space-x-2 bg-[#1B6EEB] text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>保存并发布上线</span>
            </button>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-xs border-l-4 border-l-rose-600">
              <div className="flex items-center space-x-2 font-bold">
                <span className="text-base">⚠️</span>
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-600 font-bold px-2 py-0.5 rounded cursor-pointer">✕</button>
            </div>
          )}

          {excelNotice && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 border-l-4 border-l-[#1B6EEB]">
              <Check className="w-4 h-4 text-[#1B6EEB]" />
              <span>{excelNotice}</span>
            </div>
          )}

          {saveToast && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center space-x-2 animate-bounce border-l-4 border-l-emerald-600">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>配置保存发布成功！“假期外盘热点追踪” H5 页面已上线更新。</span>
            </div>
          )}

          {/* Config Section 1: Header Banner Upload */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              <ImageIcon className="w-4 h-4 text-[#1B6EEB]" />
              <span>1. 头图图片上传</span>
              <span className="text-rose-500 font-bold">*</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-48 h-24 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs font-bold shadow-inner relative overflow-hidden border border-slate-200">
                  {bannerImage ? (
                    <img src={bannerImage} alt="头图预览" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 p-2">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1 text-slate-500 opacity-60" />
                      <span>未上传头图</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <label className="inline-block bg-[#1B6EEB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                      点击上传头图图片
                      <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                    </label>
                    {bannerImage && (
                      <button
                        onClick={() => { setBannerImage(''); setConfig(prev => ({ ...prev, heroBannerImg: '' })); }}
                        className="text-xs text-rose-600 hover:text-rose-800 font-medium underline cursor-pointer"
                      >
                        移除头图
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">支持 JPG、PNG 格式，建议尺寸 750 × 360 px，大小不超过 2MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Config Section 2: Theme Color Selection */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              <Palette className="w-4 h-4 text-[#1B6EEB]" />
              <span>2. 页面主题色选择</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'blue', name: '蓝色系', sampleBg: 'bg-[#1B2A4E]', sampleAccent: 'bg-[#C8A063]' },
                { key: 'red', name: '红色系', sampleBg: 'bg-[#9B1D2F]', sampleAccent: 'bg-[#E5A93B]' },
                { key: 'orange', name: '橙色系', sampleBg: 'bg-[#D94E1B]', sampleAccent: 'bg-[#F4A261]' },
              ].map(th => (
                <div
                  key={th.key}
                  onClick={() => setConfig({ ...config, themeColor: th.key as any })}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    config.themeColor === th.key ? 'border-[#1B6EEB] bg-blue-50/40 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 mb-3">{th.name}</div>
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                    <div className={`w-6 h-6 rounded ${th.sampleBg} shadow-xs`}></div>
                    <div className={`w-6 h-6 rounded ${th.sampleAccent} shadow-xs`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Config Section 3: Global Events Excel Upload & Preview */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <Globe className="w-4 h-4 text-[#1B6EEB]" />
                <span>3. 全球事件</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800">上传 Excel 表格解析</div>
                  <div className="text-[11px] text-slate-500">表格需包含时间、事件、关注要点、影响品种4列</div>
                </div>
                <label className="inline-block bg-[#1B6EEB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                  选择 Excel 文件上传
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const data = await file.arrayBuffer();
                        const workbook = XLSX.read(data);
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        const json = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });
                        
                        // Parse rows (skip header if matches time/event/impact)
                        const parsedEvents: any[] = [];
                        let startIdx = 0;
                        if (json.length > 0) {
                          const header = json[0].map((c: any) => String(c).trim());
                          if (header.some((h: string) => h.includes('时间') || h.includes('事件') || h.includes('品种'))) {
                            startIdx = 1;
                          }
                        }

                        for (let i = startIdx; i < json.length; i++) {
                          const row = json[i];
                          if (!row || row.length === 0) continue;
                          const timeStr = row[0] ? String(row[0]).trim() : '';
                          const eventStr = row[1] ? String(row[1]).trim() : '';
                          const detailsStr = row[2] ? String(row[2]).trim() : '';
                          const impactStr = row[3] ? String(row[3]).trim() : (row[2] && row.length === 3 ? String(row[2]).trim() : '');

                          if (timeStr || eventStr) {
                            parsedEvents.push({
                              id: `ge-excel-${i}-${Math.random().toString(36).substr(2, 5)}`,
                              time: timeStr || '待定',
                              event: eventStr || '未命名事件',
                              details: detailsStr,
                              impact: impactStr || '综合板块',
                            });
                          }
                        }

                        if (parsedEvents.length > 0) {
                          setConfig(prev => ({
                            ...prev,
                            globalEvents: parsedEvents,
                          }));
                          setErrorMsg(null);
                          setExcelNotice(`成功解析并导入 ${parsedEvents.length} 条全球事件数据！`);
                          setTimeout(() => setExcelNotice(null), 3000);
                        } else {
                          setErrorMsg('未能从该 Excel 中解析到有效数据，请检查表格格式。');
                        }
                      } catch (err) {
                        console.error(err);
                        setErrorMsg('解析 Excel 文件失败，请确认文件格式正确。');
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 border-b border-slate-200 flex justify-between items-center">
                  <span>后台数据预览（共 {config.globalEvents?.length || 0} 条数据）</span>
                  {!showClearConfirm ? (
                    <button
                      onClick={() => {
                        if (config.globalEvents && config.globalEvents.length > 0) {
                          setShowClearConfirm(true);
                        }
                      }}
                      disabled={!config.globalEvents || config.globalEvents.length === 0}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-0.5 rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      清空
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-rose-600 font-medium">确认清空全部？</span>
                      <button
                        onClick={() => {
                          setConfig(prev => ({ ...prev, globalEvents: [] }));
                          setShowClearConfirm(false);
                          setExcelNotice('已成功清空所有全球事件数据！');
                          setTimeout(() => setExcelNotice(null), 2500);
                        }}
                        className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-2 py-0.5 rounded cursor-pointer transition-colors shadow-xs"
                      >
                        确认
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="text-xs text-slate-500 hover:text-slate-700 px-1.5 py-0.5 cursor-pointer font-normal"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>
                <div className="max-h-[384px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600 sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 w-24">时间</th>
                        <th className="p-2.5 w-36">事件</th>
                        <th className="p-2.5">关注要点</th>
                        <th className="p-2.5 w-28">影响品种</th>
                        <th className="p-2.5 w-16 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(config.globalEvents || []).map((ev, index) => (
                        <tr key={ev.id} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={ev.time}
                              onChange={e => {
                                const val = e.target.value;
                                setConfig(prev => ({
                                  ...prev,
                                  globalEvents: prev.globalEvents.map((item, idx) => idx === index ? { ...item, time: val } : item)
                                }));
                              }}
                              className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white font-mono"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={ev.event}
                              onChange={e => {
                                const val = e.target.value;
                                setConfig(prev => ({
                                  ...prev,
                                  globalEvents: prev.globalEvents.map((item, idx) => idx === index ? { ...item, event: val } : item)
                                }));
                              }}
                              className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white font-bold text-slate-900"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={ev.details}
                              onChange={e => {
                                const val = e.target.value;
                                setConfig(prev => ({
                                  ...prev,
                                  globalEvents: prev.globalEvents.map((item, idx) => idx === index ? { ...item, details: val } : item)
                                }));
                              }}
                              className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={ev.impact}
                              onChange={e => {
                                const val = e.target.value;
                                setConfig(prev => ({
                                  ...prev,
                                  globalEvents: prev.globalEvents.map((item, idx) => idx === index ? { ...item, impact: val } : item)
                                }));
                              }}
                              className="w-full px-2 py-1 rounded border border-slate-200 text-xs bg-white"
                            />
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => {
                                setConfig(prev => ({
                                  ...prev,
                                  globalEvents: prev.globalEvents.filter((_, idx) => idx !== index)
                                }));
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                              title="删除此行"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

function SparklesIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

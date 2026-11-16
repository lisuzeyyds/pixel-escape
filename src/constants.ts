/**
 * 全片共用的时间轴、色板与关键帧。
 *
 * 三条铁律在这里被固化成一个数据结构：
 * 1. 像素的位置是「一条连续曲线」，不归属任何一场戏 —— 所以跨站不会断线；
 * 2. 它的颜色只有一个常量 SIGNAL，任何场景都改不动它；
 * 3. 所有关键动作都落在 BEAT 的整数倍上，方便对音乐。
 */

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;

/** 60 BPM 的八分音符，约 8 帧一下。写动作时往这上面靠。 */
export const BEAT = (FPS * 60) / 120;

/** 全片唯一的强色：那颗坏点。 */
export const SIGNAL = '#FF2431';

export const INK = '#07070C';
export const PAPER = '#F2F2F4';

export const FONT =
  '"Inter", "Helvetica Neue", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif';

/* ------------------------------------------------------------------ */
/* 两个版本：一套镜头，两种剪法                                          */
/* ------------------------------------------------------------------ */

export type CutId = 'main' | 'short';

export type StationPlan = {
  id: number;
  name: string;
  /** 长版秒数 */
  main: number;
  /** 短版秒数，null 表示短版整站删掉 */
  short: number | null;
  scene: string;
  /** 短版在这一站怎么省时间 */
  trim?: string;
};

/**
 * 长版 2:45（165s）＝ 9 站全留
 * 短版 1:50（110s）＝ 删掉站 2 QQ 与站 6 代码层，其余各站收紧
 * 两版共用同一批镜头与同一条像素曲线，只有剪点不同。
 */
export const STATION_PLAN: StationPlan[] = [
  {
    id: 0,
    name: '开机',
    main: 12,
    short: 8,
    scene: '黑屏，CRT 上电，一条白线展开；右下角一颗红点，弹窗「检测到 1 个坏点」',
    trim: '白线一展开就出弹窗，省掉显像管稳定后的呼吸段',
  },
  {
    id: 1,
    name: 'XP 桌面',
    main: 18,
    short: 14,
    scene: '蓝天草地，被拖进回收站又爬出来，溜进扫雷踩雷',
    trim: '回收站只留「进—出」两下，扫雷跳三格压成两格',
  },
  {
    id: 2,
    name: 'QQ 时代',
    main: 20,
    short: null,
    scene: '好友列表、闪图、火星文签名「莪卟昰壞點」，一次窗口抖动把它甩出去',
    trim: '短版整站删除',
  },
  {
    id: 3,
    name: 'Flash 小游戏',
    main: 18,
    short: 16,
    scene: '8-bit 横版闯关，它终于合群；画面突然变灰「已不再受支持」',
    trim: '只留「吃金币—变灰」两拍，砍掉中途平台',
  },
  {
    id: 4,
    name: '手机红点',
    main: 18,
    short: 15,
    scene: '掉在 App 图标右上角变成未读红点，被所有人注视，又被手指点',
    trim: '少一次「被注视」的停顿',
  },
  {
    id: 5,
    name: '短视频信息流',
    main: 24,
    short: 20,
    scene: '无限下滑、弹幕、爱心，越刷越快，界面被速度撕开',
    trim: '加速段少一轮，直接进光隧道',
  },
  {
    id: 6,
    name: '代码层',
    main: 14,
    short: null,
    scene: 'if (pixel.color !== screen.color) pixel.fix() 被撞成 pixel.escape()',
    trim: '短版整站删除（信息流撕裂后直接进硬件）',
  },
  {
    id: 7,
    name: '屏幕硬件',
    main: 14,
    short: 15,
    scene: '显微镜下的 RGB 子像素阵列，它拆成三个光点又合成一个',
    trim: '短版反而多给 1 秒：这是唯一的「它和所有像素一样」的揭示',
  },
  {
    id: 8,
    name: '出屏',
    main: 27,
    short: 22,
    scene: '白闪，镜头拉远：手机在人手里，人坐在夜晚天台，红点变成一颗星',
    trim: '拉远少一档，结尾停在「抬头」那一刻',
  },
];

const sum = (cut: CutId) => STATION_PLAN.reduce((acc, s) => acc + (s[cut] ?? 0), 0);

export const CUTS: Record<
  CutId,
  { label: string; seconds: number; frames: number; stations: number }
> = {
  main: {
    label: "长版 2'45\"",
    seconds: sum('main'),
    frames: sum('main') * FPS,
    stations: STATION_PLAN.filter((s) => s.main > 0).length,
  },
  short: {
    label: "短版 1'50\"",
    seconds: sum('short'),
    frames: sum('short') * FPS,
    stations: STATION_PLAN.filter((s) => s.short !== null).length,
  },
};

/** 某一版里每一站的起止帧（短版自动跳过删掉的站） */
export const timelineOf = (cut: CutId) => {
  let cursor = 0;
  return STATION_PLAN.filter((s) => s[cut] !== null).map((s) => {
    const seconds = s[cut] as number;
    const from = cursor;
    cursor += seconds * FPS;
    return { ...s, seconds, from, to: cursor, durationInFrames: seconds * FPS };
  });
};

/* ------------------------------------------------------------------ */
/* 像素图层                                                            */
/* ------------------------------------------------------------------ */

export type PixelKey = {
  /** 绝对帧号（相对整条片子，不相对某一场戏） */
  frame: number;
  /** 方块中心点 */
  x: number;
  y: number;
  size: number;
  /** 这一段位移的抛物线高度，用来做跳跃 */
  arc?: number;
  note?: string;
};

/**
 * 小样（站 0 + 站 1，30 秒）的走位。
 * 这是长版前 30 秒的剪法；短版把站 1 压到 14 秒，
 * 届时只改这一段关键帧的帧号，场景代码不用动。
 */
export const PIXEL_KEYS: PixelKey[] = [
  { frame: 0, x: 1874, y: 1016, size: 16, note: '屏幕右下角，坐标 (1919,1079) 的坏点' },
  { frame: 120, x: 1874, y: 1016, size: 16, note: '弹窗出现，它一动不动' },
  { frame: 300, x: 1874, y: 1016, size: 16, note: '被点了两次「忽略」' },
  { frame: 336, x: 1854, y: 984, size: 18, arc: 30, note: '跳上鼠标指针' },
  { frame: 360, x: 1854, y: 984, size: 18, note: '站 0 结束' },

  { frame: 378, x: 330, y: 330, size: 18, arc: 40, note: '落在 XP 桌面左上' },
  { frame: 420, x: 330, y: 330, size: 18 },
  { frame: 458, x: 152, y: 268, size: 14, arc: 26, note: '被拖进回收站' },
  { frame: 486, x: 152, y: 268, size: 5, note: '缩进桶里' },
  { frame: 512, x: 152, y: 268, size: 5 },
  { frame: 548, x: 250, y: 436, size: 16, arc: 74, note: '从桶里爬出来' },
  { frame: 604, x: 902, y: 600, size: 18, note: '溜进扫雷' },
  { frame: 630, x: 962, y: 596, size: 18, arc: 22, note: '在格子间跳' },
  { frame: 658, x: 1042, y: 606, size: 18, arc: 22 },
  { frame: 684, x: 1102, y: 584, size: 18, arc: 18 },
  { frame: 700, x: 1102, y: 584, size: 20, note: '踩到雷' },
  { frame: 734, x: 1132, y: 300, size: 22, arc: 40, note: '被炸上天' },
  { frame: 790, x: 1252, y: 176, size: 22, note: '在空中飘' },
  { frame: 900, x: 960, y: 470, size: 96, note: '踩着纸牌冲向镜头，切站 2' },
];

/** 小样长度 = 长版前 30 秒（站 0 的 12s + 站 1 的 18s） */
export const SAMPLE_FRAMES = 900;

export type PixelState = { x: number; y: number; size: number };

const smooth = (t: number) => t * t * (3 - 2 * t);

/** 任意帧取像素的位置 —— 线性插值 + 可选抛物线，保证连续。 */
export const samplePixel = (frame: number): PixelState => {
  const first = PIXEL_KEYS[0];
  const last = PIXEL_KEYS[PIXEL_KEYS.length - 1];

  if (frame <= first.frame) return { x: first.x, y: first.y, size: first.size };
  if (frame >= last.frame) return { x: last.x, y: last.y, size: last.size };

  for (let i = 0; i < PIXEL_KEYS.length - 1; i++) {
    const a = PIXEL_KEYS[i];
    const b = PIXEL_KEYS[i + 1];
    if (frame < a.frame || frame > b.frame) continue;

    const span = Math.max(1, b.frame - a.frame);
    const t = smooth((frame - a.frame) / span);
    const arc = a.arc ?? 0;

    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t - Math.sin(Math.PI * t) * arc,
      size: a.size + (b.size - a.size) * t,
    };
  }

  return { x: last.x, y: last.y, size: last.size };
};

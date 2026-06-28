// ===== 灵魂探测仪 · 数据推送配置 =====
// 方案:使用 ntfy.sh (https://ntfy.sh) 作为数据接收端
// 原理:测试者填完数据 → POST 到 ntfy.sh 的一个私有 topic
//      管理员订阅这个 topic → 实时收到通知
// 优点:完全免费、免账号、零部署、数据直达手机/电脑

const NTFY_CONFIG = {
  // 私有 topic 名(改成一个别人猜不到的复杂字符串)
  TOPIC: 'lhd-2026-secret-mbti-x8k9q3z2',

  // ntfy 服务器(国内访问慢可换自建或国内镜像,这里用官方)
  SERVER: 'https://ntfy.sh',

  // 是否启用(测试时可关掉)
  ENABLED: true
};

// 推送到 ntfy
async function pushToNtfy(payload) {
  if (!NTFY_CONFIG.ENABLED) return;

  // 构造短消息 - 突出关键数据
  const core = payload.answers || {};
  const summary = [
    `🔮 灵魂探测仪新数据`,
    `MBTI: ${payload.mbtiType} (${payload.mbtiDesc || ''})`,
    `时间: ${new Date(payload.timestamp).toLocaleString('zh-CN')}`,
    ``,
    `━━━━ 核心感情 ━━━━`,
    `已有爱人: ${core[5] === 'yes' ? '✅ 是' : core[5] === 'no' ? '❌ 否' : '未答'}`,
    `爱情观: ${core[7] || '未答'}`,
    `能永远: ${core[9] === 'yes' ? '✅ 是' : core[9] === 'no' ? '❌ 否' : '未答'}`,
    `有遗憾: ${core[11] === 'yes' ? '⚠️ 是' : core[11] === 'no' ? '❌ 否' : '未答'}`,
    `喜欢过别人: ${core[13] === 'yes' ? '⚠️ 是' : core[13] === 'no' ? '❌ 否' : '未答'}`,
    `命运安排: ${core[16] === 'yes' ? '天机' : core[16] === 'no' ? '脚下' : '未答'}`,
    ``,
    `━━━━ 算命信息 ━━━━`,
    `我的姓: ${core[10] || '未填'}`,
    `我的生日: ${core[12] || '未填'}`,
    `配偶姓: ${core[14] || '未填'}`,
    `配偶生日: ${core[15] || '未填'}`,
    `一见钟情: ${core[6] || '未填'}`,
    `一夜暴富: ${core[8] || '未填'}`,
    ``,
    `━━━━ 深度探测(触发) ━━━━`,
    core[100] ? `遗憾的人-姓: ${core[100]}` : null,
    core[101] ? `遗憾的人-生日: ${core[101]}` : null,
    core[102] ? `心动的人-姓: ${core[102]}` : null,
    core[103] ? `心动的人-生日: ${core[103]}` : null,
  ].filter(l => l !== null).join('\n');

  const fullData = {
    testId: payload.testId,
    mbti: payload.mbtiType,
    timestamp: payload.timestamp,
    fate: payload.fate,
    ua: payload.ua,
    answers: payload.answers
  };

  try {
    // ntfy 支持 POST 纯文本 + Header 传标题/标签/优先级
    await fetch(`${NTFY_CONFIG.SERVER}/${NTFY_CONFIG.TOPIC}`, {
      method: 'POST',
      headers: {
        'Title': '🔮 新测试数据 - ' + payload.mbtiType,
        'Priority': 'high',
        'Tags': 'crystal_ball,love_letter',
        'Content-Type': 'text/plain'
      },
      body: summary
    });
  } catch (e) {
    console.warn('ntfy 推送失败:', e);
  }
}

// 拉取历史(管理员后台用) - ntfy 不存储历史所以用第二方案:JSONBin
// 简化:管理员主要看手机推送,历史数据从浏览器 localStorage 读取
async function fetchFromNtfy() {
  // ntfy.sh 的 /<topic>/json 可以获取历史
  const resp = await fetch(`${NTFY_CONFIG.SERVER}/${NTFY_CONFIG.TOPIC}/json?since=1h`);
  if (!resp.ok) return [];
  const text = await resp.text();
  // ntfy 返回的是 JSON Lines 格式
  const lines = text.split('\n').filter(l => l.trim());
  return lines.map(l => {
    try {
      const evt = JSON.parse(l);
      return { event: evt.event, message: evt.message, time: evt.time, tags: evt.tags };
    } catch { return null; }
  }).filter(Boolean);
}

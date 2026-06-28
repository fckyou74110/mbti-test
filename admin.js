// ===== 后台管理逻辑 =====
// 数据来源(双通道):
// 1. ntfy.sh 拉取历史通知
// 2. localStorage 读取(同设备)
// 3. 用户导入 JSON

// ★ 关键:必须和 ntfy-config.js 里的 TOPIC 一致
const ADMIN_TOPIC = 'lhd-2026-secret-mbti-x8k9q2z';  // 跟 ntfy-config.js 一致
const NTFY_SERVER = 'https://ntfy.sh';
const ADMIN_PASSWORD = 'admin888';  // ★ 后台密码

// XSS 转义
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ntfy 消息解析回结构化数据
function parseNtfyMessage(msg) {
  // 格式: 来自 pushToNtfy 的 summary 文本
  // 我们提取关键字段
  const data = {
    raw: msg,
    mbti: '',
    hasLover: '',
    loveView: '',
    canForever: '',
    hasRegret: '',
    likesOther: '',
    destiny: '',
    mySurname: '',
    myBirthday: '',
    loverSurname: '',
    loverBirthday: '',
    regretSurname: '',
    regretBirthday: '',
    crushSurname: '',
    crushBirthday: '',
    fate: '',
    timestamp: ''
  };

  const lines = msg.split('\n');
  let inCore = false, inFortune = false, inDeep = false;
  for (const line of lines) {
    if (line.startsWith('MBTI:')) {
      const m = line.match(/MBTI:\s*(\w+)/);
      if (m) data.mbti = m[1];
    } else if (line.includes('已有爱人:')) {
      data.hasLover = line.split('已有爱人:')[1].trim();
    } else if (line.includes('爱情观:')) {
      data.loveView = line.split('爱情观:')[1].trim();
    } else if (line.includes('能永远:')) {
      data.canForever = line.split('能永远:')[1].trim();
    } else if (line.includes('有遗憾:')) {
      data.hasRegret = line.split('有遗憾:')[1].trim();
    } else if (line.includes('喜欢过别人:')) {
      data.likesOther = line.split('喜欢过别人:')[1].trim();
    } else if (line.includes('命运安排:')) {
      data.destiny = line.split('命运安排:')[1].trim();
    } else if (line.includes('我的姓:')) {
      data.mySurname = line.split('我的姓:')[1].trim();
    } else if (line.includes('我的生日:')) {
      data.myBirthday = line.split('我的生日:')[1].trim();
    } else if (line.includes('配偶姓:')) {
      data.loverSurname = line.split('配偶姓:')[1].trim();
    } else if (line.includes('配偶生日:')) {
      data.loverBirthday = line.split('配偶生日:')[1].trim();
    } else if (line.includes('遗憾的人-姓:')) {
      data.regretSurname = line.split('遗憾的人-姓:')[1].trim();
    } else if (line.includes('遗憾的人-生日:')) {
      data.regretBirthday = line.split('遗憾的人-生日:')[1].trim();
    } else if (line.includes('心动的人-姓:')) {
      data.crushSurname = line.split('心动的人-姓:')[1].trim();
    } else if (line.includes('心动的人-生日:')) {
      data.crushBirthday = line.split('心动的人-生日:')[1].trim();
    } else if (line.startsWith('时间:')) {
      data.timestamp = line.split('时间:')[1].trim();
    }
  }
  return data;
}

const AdminApp = {
  records: [],  // 结构化记录

  login() {
    const pwd = document.getElementById('password-input').value;
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', '1');
      showAdminPage();
      this.loadData();
    } else {
      document.getElementById('login-error').textContent = '密码错误';
    }
  },

  logout() {
    sessionStorage.removeItem('admin_auth');
    document.getElementById('admin-page').classList.remove('active');
    document.getElementById('login-page').classList.add('active');
    document.getElementById('password-input').value = '';
  },

  async loadData() {
    this.records = [];

    // 来源1: localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('mbti_test_records') || '[]');
      stored.forEach(r => {
        this.records.push({
          source: 'local',
          timestamp: r.timestamp,
          mbtiType: r.mbtiType,
          mbtiDesc: r.mbtiDesc,
          answers: r.answers || {},
          fate: r.fate,
          testId: r.testId,
          ua: r.ua
        });
      });
    } catch (e) {
      console.warn('localStorage 读取失败:', e);
    }

    // 来源2: ntfy 历史
    try {
      const resp = await fetch(`${NTFY_SERVER}/${ADMIN_TOPIC}/json?since=24h`);
      if (resp.ok) {
        const text = await resp.text();
        const lines = text.split('\n').filter(l => l.trim());
        for (const line of lines) {
          try {
            const evt = JSON.parse(line);
            if (evt.event !== 'message' || !evt.message) continue;
            const parsed = parseNtfyMessage(evt.message);
            if (!parsed.mbti) continue;
            this.records.push({
              source: 'ntfy',
              timestamp: evt.time ? new Date(evt.time * 1000).toISOString() : new Date().toISOString(),
              mbtiType: parsed.mbti,
              mbtiDesc: parsed.mbti + ' (ntfy消息)',
              answers: this.reconstructAnswers(parsed),
              fate: parsed.fate || (parsed.destiny === '天机' ? '天机不可泄露,顺其自然即可' : '路在自己的脚下,每一步都是不一样的精彩人生'),
              testId: 'ntfy_' + evt.id,
              ua: ''
            });
          } catch {}
        }
      }
    } catch (e) {
      console.warn('ntfy 拉取失败:', e);
    }

    // 去重(按 testId)
    const seen = new Set();
    this.records = this.records.filter(r => {
      if (seen.has(r.testId)) return false;
      seen.add(r.testId);
      return true;
    });

    // 按时间倒序
    this.records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    this.render();
  },

  // 从 ntfy 解析的字段重建 answers 对象
  reconstructAnswers(p) {
    return {
      1: '', 2: '', 3: '', 4: '',
      5: p.hasLover.includes('✅') ? 'yes' : p.hasLover.includes('❌') ? 'no' : '',
      6: '',
      7: p.loveView || '',
      8: '',
      9: p.canForever.includes('✅') ? 'yes' : p.canForever.includes('❌') ? 'no' : '',
      10: p.mySurname || '',
      11: p.hasRegret.includes('⚠️') ? 'yes' : p.hasRegret.includes('❌') ? 'no' : '',
      12: p.myBirthday || '',
      13: p.likesOther.includes('⚠️') ? 'yes' : p.likesOther.includes('❌') ? 'no' : '',
      14: p.loverSurname || '',
      15: p.loverBirthday || '',
      16: p.destiny === '天机' ? 'yes' : p.destiny === '脚下' ? 'no' : '',
      100: p.regretSurname || '',
      101: p.regretBirthday || '',
      102: p.crushSurname || '',
      103: p.crushBirthday || ''
    };
  },

  refresh() { this.loadData(); },

  render() {
    this.renderStats();
    this.renderMBTI();
    this.renderCore();
    this.renderRecords();
  },

  // 统计卡片
  renderStats() {
    const total = this.records.length;
    const today = this.records.filter(r => {
      const d = new Date(r.timestamp);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }).length;
    const withLover = this.records.filter(r => r.answers[5] === 'yes').length;
    const regret = this.records.filter(r => r.answers[11] === 'yes').length;
    const crush = this.records.filter(r => r.answers[13] === 'yes').length;
    const destinyYes = this.records.filter(r => r.answers[16] === 'yes').length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-today').textContent = today;
    document.getElementById('stat-with-lover').textContent = withLover;
    document.getElementById('stat-regret').textContent = regret;
    document.getElementById('stat-crush').textContent = crush;
    document.getElementById('stat-destiny-yes').textContent = destinyYes;
  },

  renderMBTI() {
    const counts = {};
    this.records.forEach(r => {
      counts[r.mbtiType] = (counts[r.mbtiType] || 0) + 1;
    });

    const container = document.getElementById('mbti-chart');
    const max = Math.max(...Object.values(counts), 1);
    const allTypes = ['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP',
                      'ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'];
    container.innerHTML = allTypes.map(t => {
      const c = counts[t] || 0;
      const pct = (c / max) * 100;
      return `
        <div class="mbti-bar">
          <div class="mbti-bar-label">${t}</div>
          <div class="mbti-bar-track"><div class="mbti-bar-fill" style="width: ${pct}%"></div></div>
          <div class="mbti-bar-count">${c} 人</div>
        </div>
      `;
    }).join('');
  },

  renderCore() {
    const coreQs = [
      { id: 5, text: '你是否已经拥有爱人?' },
      { id: 7, text: '你觉得的爱情是什么?' },
      { id: 9, text: '你认为自己的这段爱情能永远保持下去?' },
      { id: 11, text: '在你心里是否存在过遗憾?' },
      { id: 13, text: '你在感情中是否喜欢上过不是和你在一起的其他人或产生好感?' },
      { id: 16, text: '你是否相信自己的命运都是安排好的?' }
    ];

    const stats = {};
    coreQs.forEach(q => {
      stats[q.id] = {};
      this.records.forEach(r => {
        const v = r.answers[q.id];
        if (v) stats[q.id][v] = (stats[q.id][v] || 0) + 1;
      });
    });

    const container = document.getElementById('core-questions-list');
    container.innerHTML = coreQs.map(q => {
      const opts = Object.entries(stats[q.id]);
      return `
        <div class="core-q">
          <div class="core-q-title">Q${q.id}. ${esc(q.text)}</div>
          <div class="core-options">
            ${opts.length > 0 ? opts.map(([val, count]) => `
              <div class="core-opt"><span>${esc(val)}</span><span class="core-opt-count">${count}人</span></div>
            `).join('') : '<div class="core-opt">暂无数据</div>'}
          </div>
        </div>
      `;
    }).join('');

    // 深度触发统计
    const deep = {
      regretName: this.records.filter(r => r.answers[100]).length,
      regretDate: this.records.filter(r => r.answers[101]).length,
      crushName: this.records.filter(r => r.answers[102]).length,
      crushDate: this.records.filter(r => r.answers[103]).length
    };
    if (deep.regretName + deep.crushName > 0) {
      const html = `
        <div class="core-q">
          <div class="core-q-title">🔍 深度问题触发情况</div>
          <div class="core-options">
            <div class="core-opt"><span>遗憾的人-姓</span><span class="core-opt-count">${deep.regretName}人填写</span></div>
            <div class="core-opt"><span>遗憾的人-生日</span><span class="core-opt-count">${deep.regretDate}人填写</span></div>
            <div class="core-opt"><span>心动的人-姓</span><span class="core-opt-count">${deep.crushName}人填写</span></div>
            <div class="core-opt"><span>心动的人-生日</span><span class="core-opt-count">${deep.crushDate}人填写</span></div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    }
  },

  renderRecords() {
    const container = document.getElementById('records-list');
    if (this.records.length === 0) {
      container.innerHTML = '<div class="no-data">暂无测试数据<br><br>数据来源:<br>1. ntfy.sh 推送历史<br>2. 本地 localStorage<br><br>建议用提交过测试的同一台浏览器查看</div>';
      return;
    }

    container.innerHTML = this.records.map((r, idx) => {
      const time = esc(new Date(r.timestamp).toLocaleString('zh-CN'));
      const source = r.source === 'ntfy' ? '📨 ntfy' : '💾 本地';
      const mbtiType = esc(r.mbtiType || '?');
      const testId = esc(r.testId || '');

      const qa = (qid, qtext) => {
        const v = r.answers[qid];
        if (!v) return '';
        const isCore = [5, 7, 9, 11, 13, 16, 100, 101, 102, 103].includes(qid);
        return `<tr><th>${isCore?'❤️':''} Q${qid} ${esc(qtext)}</th><td><span class="value-tag ${isCore?'core':''}">${esc(v)}</span></td></tr>`;
      };

      return `
        <div class="record-item" data-idx="${idx}">
          <div class="record-header" onclick="AdminApp.toggleRecord(${idx})">
            <div class="record-meta">
              <span class="record-mbti">${mbtiType}</span>
              <span class="record-time">${time}</span>
              <span style="color:#64748b;font-size:11px">${source}</span>
            </div>
            <div class="record-toggle">▼</div>
          </div>
          <div class="record-body">
            <div style="color:#94a3b8;font-size:13px;margin-top:12px"><strong style="color:#c084fc">命运提示:</strong> ${esc(r.fate || '(无)')}</div>
            <table class="record-table">
              <tbody>
                ${qa(5, '是否已有爱人?')}
                ${qa(7, '爱情是什么?')}
                ${qa(9, '能永远保持吗?')}
                ${qa(11, '存在遗憾吗?')}
                ${qa(13, '喜欢过别人吗?')}
                ${qa(16, '相信命运安排?')}
                ${qa(10, '我的姓')}
                ${qa(12, '我的生日')}
                ${qa(14, '配偶姓')}
                ${qa(15, '配偶生日')}
                ${qa(100, '遗憾的人-姓')}
                ${qa(101, '遗憾的人-生日')}
                ${qa(102, '心动的人-姓')}
                ${qa(103, '心动的人-生日')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');
  },

  toggleRecord(idx) {
    const items = document.querySelectorAll('.record-item');
    if (items[idx]) items[idx].classList.toggle('open');
  },

  exportCSV() {
    if (this.records.length === 0) {
      alert('暂无数据');
      return;
    }

    const headers = ['来源', '时间', 'MBTI', '命运', '已有爱人', '爱情观', '能永远', '有遗憾', '喜欢过别人', '相信命运', '我的姓', '我的生日', '配偶姓', '配偶生日', '遗憾的人-姓', '遗憾的人-生日', '心动的人-姓', '心动的人-生日'];
    const rows = this.records.map(r => [
      r.source,
      new Date(r.timestamp).toLocaleString('zh-CN'),
      r.mbtiType,
      r.fate,
      r.answers[5] || '',
      r.answers[7] || '',
      r.answers[9] || '',
      r.answers[11] || '',
      r.answers[13] || '',
      r.answers[16] || '',
      r.answers[10] || '',
      r.answers[12] || '',
      r.answers[14] || '',
      r.answers[15] || '',
      r.answers[100] || '',
      r.answers[101] || '',
      r.answers[102] || '',
      r.answers[103] || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `灵魂探测仪数据_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // 清空本地数据
  clearLocal() {
    if (confirm('确认清空 localStorage 数据?(ntfy 推送的历史不受影响)')) {
      localStorage.removeItem('mbti_test_records');
      this.loadData();
    }
  }
};

function showAdminPage() {
  document.getElementById('login-page').classList.remove('active');
  document.getElementById('admin-page').classList.add('active');
}

window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('admin_auth') === '1') {
    showAdminPage();
    AdminApp.loadData();
  }
  const pwdInput = document.getElementById('password-input');
  if (pwdInput) {
    pwdInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') AdminApp.login();
    });
  }
});

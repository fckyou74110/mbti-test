// ===== 灵魂探测仪 · 主逻辑 =====
const TestApp = {
  // 状态
  state: {
    questions: [],           // 当前完整题目列表(含动态追加)
    currentIndex: 0,
    answers: {},             // 所有答案 {qid: value}
    started: false,
    submitted: false
  },

  // 启动
  start() {
    // 构建完整题目列表:固定16题 + 可能的动态题
    this.state.questions = [...QUESTIONS];
    this.state.currentIndex = 0;
    this.state.answers = {};
    this.state.started = true;
    this.state.submitted = false;
    showPage('page-quiz');
    this.renderQuestion();
  },

  // 渲染当前题目
  renderQuestion() {
    const q = this.state.questions[this.state.currentIndex];
    const total = this.state.questions.length;

    // 进度
    document.getElementById('current-q').textContent = this.state.currentIndex + 1;
    document.getElementById('total-q').textContent = total;
    const pct = ((this.state.currentIndex + 1) / total) * 100;
    document.getElementById('progress-fill').style.width = pct + '%';

    // 卡片重新触发动画
    const card = document.getElementById('question-card');
    card.style.animation = 'none';
    setTimeout(() => card.style.animation = 'slideUp 0.4s ease', 10);

    // 标签
    const tag = document.getElementById('category-tag');
    const tagMap = {
      mbti: { text: '🧠 人格测试', cls: 'mbti' },
      love: { text: '💕 感情探针', cls: '' },
      fortune: { text: '🌟 命运之轮', cls: 'fortune' },
      love_extras: { text: '💫 深度探测', cls: 'love_extras' }
    };
    const tagInfo = tagMap[q.category] || { text: q.category, cls: '' };
    tag.textContent = tagInfo.text;
    tag.className = 'tag ' + tagInfo.cls;

    // 题目
    document.getElementById('question-text').textContent = q.text;
    document.getElementById('error-msg').textContent = '';

    // 答案区域
    const answerArea = document.getElementById('answer-area');
    answerArea.innerHTML = '';

    if (q.options) {
      // 选择题
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.textContent = opt.text;
        btn.onclick = () => this.selectOption(q, opt, btn);
        // 标记已选
        if (this.state.answers[q.id] === opt.value) {
          btn.classList.add('selected');
        }
        answerArea.appendChild(btn);
      });

      // 选择题 - 选完自动进入下一题(延时让用户看到选中效果)
      // 但如果是核心题还是点击提交更稳
      if (q.type === 'core' || q.type === 'mbti') {
        // 选完立即下一题
        // 在 selectOption 里处理
      }
    } else if (q.input) {
      // 输入题
      if (q.input === 'date') {
        const inp = document.createElement('input');
        inp.type = 'date';
        inp.className = 'input-date';
        inp.placeholder = q.placeholder || '';
        if (this.state.answers[q.id]) inp.value = this.state.answers[q.id];
        answerArea.appendChild(inp);

        const submitBtn = document.createElement('button');
        submitBtn.className = 'submit-btn';
        submitBtn.textContent = this.state.currentIndex === total - 1 ? '提交并查看结果' : '下一题';
        submitBtn.onclick = () => this.submitInput(q, inp);
        answerArea.appendChild(submitBtn);

        // 选完日期自动跳转
        inp.onchange = () => {
          if (inp.value) {
            setTimeout(() => this.submitInput(q, inp), 200);
          }
        };
      } else {
        // 文本输入
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'input-field';
        inp.placeholder = q.placeholder || '请输入';
        inp.maxLength = q.maxLength || 20;
        if (this.state.answers[q.id]) inp.value = this.state.answers[q.id];
        answerArea.appendChild(inp);

        const submitBtn = document.createElement('button');
        submitBtn.className = 'submit-btn';
        submitBtn.textContent = this.state.currentIndex === total - 1 ? '提交并查看结果' : '下一题';
        submitBtn.onclick = () => this.submitInput(q, inp);
        answerArea.appendChild(submitBtn);

        // 回车提交
        inp.onkeydown = (e) => {
          if (e.key === 'Enter') this.submitInput(q, inp);
        };
        // 自动 focus
        setTimeout(() => inp.focus(), 300);
      }
    }
  },

  // 选择选项
  selectOption(q, opt, btnEl) {
    // 标记选中
    btnEl.parentNode.querySelectorAll('.option').forEach(b => b.classList.remove('selected'));
    btnEl.classList.add('selected');

    // 保存答案
    this.state.answers[q.id] = opt.value;

    // 显示错误清空
    document.getElementById('error-msg').textContent = '';

    // 延时进入下一题,让用户看到选中效果
    setTimeout(() => this.nextQuestion(), 350);
  },

  // 提交输入
  submitInput(q, inp) {
    const val = inp.value.trim();

    // 验证
    if (q.required && !val) {
      this.showError('此项必填');
      return;
    }
    if (!q.optional && !q.required && !val) {
      // 配偶生日等可选题目允许空
      if (q.id === 15) {
        // 爱人生日可选,空跳过
        this.state.answers[q.id] = '';
        this.nextQuestion();
        return;
      }
      this.showError('此项必填');
      return;
    }

    this.state.answers[q.id] = val;
    this.nextQuestion();
  },

  // 错误提示
  showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    setTimeout(() => el.textContent = '', 2500);
  },

  // 下一题
  nextQuestion() {
    this.state.currentIndex++;

    // 检查是否需要动态追加题目
    if (this.state.currentIndex === this.state.questions.length) {
      const extras = getConditionalQuestions(this.state.answers);
      if (extras.length > 0) {
        // 追加新题
        this.state.questions = [...this.state.questions, ...extras];
        // 更新总数显示
        document.getElementById('total-q').textContent = this.state.questions.length;
        this.renderQuestion();
        return;
      }

      // 没有动态题 → 提交
      this.submit();
      return;
    }

    this.renderQuestion();
  },

  // 计算 MBTI 类型
  calcMBTI() {
    const mbtiScore = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    let mbtiCount = 0;

    this.state.questions.forEach(q => {
      if (q.type === 'mbti' && this.state.answers[q.id]) {
        mbtiScore[this.state.answers[q.id]]++;
        mbtiCount++;
      }
    });

    if (mbtiCount === 0) return 'ENFP'; // 默认值

    const type =
      (mbtiScore.E >= mbtiScore.I ? 'E' : 'I') +
      (mbtiScore.S >= mbtiScore.N ? 'S' : 'N') +
      (mbtiScore.T >= mbtiScore.F ? 'T' : 'F') +
      (mbtiScore.J >= mbtiScore.P ? 'J' : 'P');

    return type;
  },

  // 提交到后端
  async submit() {
    const mbtiType = this.calcMBTI();
    const mbtiDescs = MBTI_DESCRIPTIONS[mbtiType] || MBTI_DESCRIPTIONS.ENFP;
    const mbtiDesc = mbtiDescs[Math.floor(Math.random() * mbtiDescs.length)];

    const destinyAnswer = this.state.answers[16];
    const fateText = destinyAnswer === 'yes'
      ? FINAL_RESULTS.destiny_yes
      : FINAL_RESULTS.destiny_no;

    // 构造提交数据
    const payload = {
      mbtiType,
      mbtiDesc,
      answers: this.state.answers,
      questions: this.state.questions.map(q => ({
        id: q.id,
        text: q.text,
        category: q.category,
        type: q.type,
        value: this.state.answers[q.id] || ''
      })),
      fate: fateText,
      ua: navigator.userAgent,
      timestamp: new Date().toISOString(),
      // 唯一标识,后台统计用
      testId: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
    };

    // 显示结果
    this.showResult(mbtiType, mbtiDesc, fateText);

    // 异步提交到后端(失败不影响用户查看结果)
    // 主通道: ntfy.sh 推送通知(管理员手机实时收到)
    // 备份: localStorage(管理员后台从浏览器读)
    try {
      // 1. ntfy 推送
      if (typeof pushToNtfy === 'function') {
        await pushToNtfy(payload);
      }
    } catch (e) {
      console.warn('ntfy 推送失败:', e);
    }

    try {
      // 2. localStorage 备份(同一台设备管理员可读到所有数据)
      const STORAGE_KEY = 'mbti_test_records';
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      // 去重
      const filtered = stored.filter(r => r.testId !== payload.testId);
      filtered.push(payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.warn('localStorage 备份失败:', e);
    }

    this.state.submitted = true;
  },

  // 显示结果
  showResult(mbtiType, mbtiDesc, fateText) {
    document.getElementById('mbti-type').textContent = mbtiType;
    document.getElementById('mbti-desc').textContent = mbtiDesc;
    document.getElementById('fate-text').textContent = fateText;
    showPage('page-result');
  },

  // 重新开始
  restart() {
    this.state = {
      questions: [],
      currentIndex: 0,
      answers: {},
      started: false,
      submitted: false
    };
    showPage('page-intro');
  }
};

// 页面切换
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0, 0);
}

// 阻止页面整体滚动回弹(微信内)
document.addEventListener('touchmove', function(e) {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

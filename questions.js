// ===== 灵魂探测仪 · 完整题库 =====
// 三大类:mbti (性格题) / love (核心感情题) / fortune (算命掩护题)
// 每次开始测试随机抽题,保证每次体验都不一样

// ============ MBTI 性格题(EI/SN/TF/JP 各 2-3 道)============
const MBTI_POOL = {
  E_I: [
    {
      text: '周末宅家时你最常做的事是?',
      options: [{ text: '约三五好友出去浪', value: 'E' }, { text: '一个人窝沙发刷手机', value: 'I' }]
    },
    {
      text: '朋友聚会时你一般是什么角色?',
      options: [{ text: '话题制造机 主动carry全场', value: 'E' }, { text: '角落观察者 默默吃瓜', value: 'I' }]
    },
    {
      text: '刷到一则搞笑视频你的第一反应是?',
      options: [{ text: '立刻分享到群或朋友圈', value: 'E' }, { text: '自己偷偷乐完就翻篇', value: 'I' }]
    },
    {
      text: '到一个新环境,你会?',
      options: [{ text: '主动跟陌生人搭话', value: 'E' }, { text: '等别人来找你聊', value: 'I' }]
    }
  ],
  S_N: [
    {
      text: '面对一个复杂问题,你更倾向?',
      options: [{ text: '看实际数据和过往经验', value: 'S' }, { text: '靠直觉和第六感瞎蒙', value: 'N' }]
    },
    {
      text: '看一部悬疑电影你更喜欢?',
      options: [{ text: '关注细节线索 抽丝剥茧', value: 'S' }, { text: '脑补人物动机 自由解读', value: 'N' }]
    },
    {
      text: '你更相信?',
      options: [{ text: '看得见摸得着的事实', value: 'S' }, { text: '冥冥之中的第六感', value: 'N' }]
    }
  ],
  T_F: [
    {
      text: '朋友向你倾诉失恋,你第一反应是?',
      options: [{ text: '帮他分析问题出在哪', value: 'T' }, { text: '陪他骂渣男再递纸巾', value: 'F' }]
    },
    {
      text: '做决定时你更看重?',
      options: [{ text: '利弊得失逻辑自洽', value: 'T' }, { text: '内心感受大家开心', value: 'F' }]
    },
    {
      text: '同事方案被你否了,你会?',
      options: [{ text: '讲事实摆数据 对方爱听不听', value: 'T' }, { text: '先共情再委婉提建议', value: 'F' }]
    }
  ],
  J_P: [
    {
      text: '出门旅行你更喜欢?',
      options: [{ text: '提前做好详细攻略', value: 'J' }, { text: '说走就走随心所欲', value: 'P' }]
    },
    {
      text: '你的桌面/房间一般是?',
      options: [{ text: '整洁有序物品归位', value: 'J' }, { text: '乱中有序我自己能找到', value: 'P' }]
    },
    {
      text: 'Deadline 前的你?',
      options: [{ text: '早就提前做完还有空改', value: 'J' }, { text: '最后一晚通宵爆肝', value: 'P' }]
    }
  ]
};

// ============ 核心感情题(感情类问题池)============
// 关键:这些是真正要看的数据,每次必出一道
const LOVE_POOL = {
  hasLover: [
    {
      text: '你现在是否已经拥有爱人?',
      options: [{ text: '是', value: 'yes' }, { text: '否', value: 'no' }]
    },
    {
      text: '你的身边现在有一个名正言顺的爱人吗?',
      options: [{ text: '有', value: 'yes' }, { text: '没有', value: 'no' }]
    }
  ],
  loveView: [
    {
      text: '你觉得的爱情是什么?',
      options: [
        { text: '责任', value: 'responsibility' },
        { text: '爱', value: 'love' },
        { text: '习惯', value: 'habit' }
      ]
    },
    {
      text: '你心目中爱情最像什么?',
      options: [
        { text: '一份承诺与担当', value: 'responsibility' },
        { text: '心动与热忱', value: 'love' },
        { text: '日复一日的陪伴', value: 'habit' }
      ]
    }
  ],
  canForever: [
    {
      text: '你认为自己的这段爱情能永远保持下去?',
      options: [{ text: '是', value: 'yes' }, { text: '否', value: 'no' }]
    },
    {
      text: '你觉得这段感情能走到最后?',
      options: [{ text: '能', value: 'yes' }, { text: '不能', value: 'no' }]
    }
  ],
  hasRegret: [
    {
      text: '在你心里是否存在过遗憾?',
      options: [{ text: '是', value: 'yes' }, { text: '否', value: 'no' }]
    },
    {
      text: '感情路上,你心里是否藏过某些遗憾?',
      options: [{ text: '有', value: 'yes' }, { text: '没有', value: 'no' }]
    }
  ],
  likesOther: [
    {
      text: '你在感情中是否喜欢上过不是和你在一起的其他人或产生好感?',
      options: [{ text: '是', value: 'yes' }, { text: '否', value: 'no' }]
    },
    {
      text: '在已有的感情之外,你是否曾对其他人动过心?',
      options: [{ text: '是的', value: 'yes' }, { text: '没有', value: 'no' }]
    }
  ]
};

// ============ 算命掩护题 ============
const FORTUNE_POOL = {
  surname: [
    { text: '你的姓是?', input: true, placeholder: '请输入你的姓氏', maxLength: 10, required: true }
  ],
  birthday: [
    { text: '你的生日是?', input: 'date', placeholder: '请选择你的生日', required: true }
  ],
  loverSurname: [
    { text: '如果有配偶(爱人),爱人的姓?', input: true, placeholder: '请输入爱人姓氏,无则填"无"', maxLength: 10 }
  ],
  loverBirthday: [
    { text: '爱人的生日是?', input: 'date', placeholder: '无则跳过', optional: true }
  ],
  loveAtFirstSight: [
    {
      text: '你相信一见钟情吗?',
      options: [{ text: '相信', value: 'yes' }, { text: '不信', value: 'no' }]
    }
  ],
  getRichQuick: [
    {
      text: '你相信一夜暴富吗?',
      options: [{ text: '相信', value: 'yes' }, { text: '不信', value: 'no' }]
    }
  ],
  destiny: [
    {
      text: '你是否相信自己的命运都是安排好的?',
      options: [{ text: '是', value: 'yes' }, { text: '否', value: 'no' }]
    }
  ]
};

// ============ 趣味过渡语(下一题是某类型时显示)============
const TRANSITIONS = {
  mbti: [
    '🧠 接下来测一下你的思维模式',
    '🧠 灵光一闪,再来一题!',
    '🧠 看透你的灵魂底色',
    '🧠 你的人格正在被解析',
    '🧠 离真相又近了一步',
    '🧠 你的潜意识正在浮现',
    '🧠 抽丝剥茧中…',
    '🧠 来自深空的灵魂扫描'
  ],
  love: [
    { type: 'popup', icon: '💕', title: '窥视一下你的小秘密', desc: '接下来的问题可能有点私密,请诚实作答哦~', btn: '继续' },
    { type: 'popup', icon: '🔮', title: '小心!感情探针启动', desc: '接下来几道题会触碰到你内心最柔软的地方', btn: '我准备好了' },
    { type: 'popup', icon: '💘', title: '窥视一下你的小秘密', desc: '爱是藏不住的,让我们看看你的真心', btn: '让我看看' },
    { type: 'popup', icon: '🌹', title: '红鸾心动时刻', desc: '接下来的问题会暴露你对感情的真实态度', btn: '坦诚作答' },
    { type: 'banner', text: '💕 感情探针启动' },
    { type: 'banner', text: '💕 接下来窥视你的感情世界' }
  ],
  fortune: [
    { type: 'popup', icon: '🌙', title: '老夫看你骨骼惊奇', desc: '免费帮你算一卦,看看你的命数如何?', btn: '请大师指教' },
    { type: 'popup', icon: '☯️', title: '天机不可泄露', desc: '不过既然你诚心问,我就透露一点', btn: '洗耳恭听' },
    { type: 'popup', icon: '🪬', title: '签筒已为你备好', desc: '接下来的问题关乎你的运势与姻缘', btn: '抽支签看看' },
    { type: 'popup', icon: '🌟', title: '老夫看你面相不凡', desc: '免费送一卦,只当交个朋友', btn: '承蒙赐教' },
    { type: 'banner', text: '🌙 算命模式启动' },
    { type: 'banner', text: '🪬 命运之轮开始转动' }
  ],
  fortunePopup: [
    { type: 'popup', icon: '🌙', title: '老夫看你骨骼惊奇', desc: '免费帮你算一卦,看看你的命数如何?', btn: '请大师指教' },
    { type: 'popup', icon: '☯️', title: '天机不可泄露', desc: '不过既然你诚心问,我就透露一点', btn: '洗耳恭听' },
    { type: 'popup', icon: '🪬', title: '签筒已为你备好', desc: '接下来的问题关乎你的运势与姻缘', btn: '抽支签看看' }
  ]
};

// ============ 构造随机题库 ============
// 每次开始时调用:从各池中随机抽题,组成 16 道题
// MBTI 4 道(每维度 1 道) + 核心感情 5 道(必出) + 算命 7 道(随机 6-7 道)
function buildQuestionSet() {
  const questions = [];
  let id = 1;

  // 1. MBTI 4 道(每维度抽 1 道)
  const mbtiOrder = ['E_I', 'S_N', 'T_F', 'J_P'].sort(() => Math.random() - 0.5);
  mbtiOrder.forEach(dim => {
    const pool = MBTI_POOL[dim];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    questions.push({
      id: id++,
      type: 'mbti',
      category: 'mbti',
      dimension: dim,
      text: picked.text,
      options: picked.options,
      input: picked.input
    });
  });

  // 2. 核心感情 5 道(必出,顺序也随机)
  const loveKeys = ['hasLover', 'loveView', 'canForever', 'hasRegret', 'likesOther']
    .sort(() => Math.random() - 0.5);
  loveKeys.forEach(key => {
    const pool = LOVE_POOL[key];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    questions.push({
      id: id++,
      type: 'core',
      category: 'love',
      loveKey: key,
      text: picked.text,
      options: picked.options,
      input: picked.input,
      placeholder: picked.placeholder,
      maxLength: picked.maxLength,
      required: picked.required,
      optional: picked.optional
    });
  });

  // 3. 算命题 6 道(从池里抽 6 道,加 destiny 必出)
  const fortuneKeys = ['surname', 'birthday', 'loverSurname', 'loverBirthday', 'loveAtFirstSight', 'getRichQuick'];
  // 抽 5 道(除 destiny)
  const picked5 = fortuneKeys.sort(() => Math.random() - 0.5).slice(0, 5);
  // 再加 1 道随机(从全部 6 道重抽,可能重复)
  const extraOne = fortuneKeys[Math.floor(Math.random() * fortuneKeys.length)];
  const finalFortune = [...picked5, extraOne, 'destiny'].sort(() => Math.random() - 0.5);

  finalFortune.forEach(key => {
    const pool = FORTUNE_POOL[key];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    questions.push({
      id: id++,
      type: 'fortune',
      category: 'fortune',
      fortuneKey: key,
      text: picked.text,
      options: picked.options,
      input: picked.input,
      placeholder: picked.placeholder,
      maxLength: picked.maxLength,
      required: picked.required,
      optional: picked.optional
    });
  });

  // 整体打乱题序(让 mbti/love/fortune 真正随机穿插)
  // 但保证:命运题放最后(让仪式感收尾)
  const destinyIdx = questions.findIndex(q => q.fortuneKey === 'destiny');
  if (destinyIdx > -1) {
    const destiny = questions.splice(destinyIdx, 1)[0];
    const others = questions.sort(() => Math.random() - 0.5);
    return [...others, destiny];
  }
  return questions.sort(() => Math.random() - 0.5);
}

// ============ 动态追加题(条件触发)============
// 根据用户回答,追加追问
function getConditionalQuestions(answers) {
  const extras = [];
  // 从答案里查找 hasRegret 选的题
  const regretQ = findAnswerKey(answers, 'hasRegret');
  const likesQ = findAnswerKey(answers, 'likesOther');

  if (regretQ && answers[regretQ.id] === 'yes') {
    extras.push({
      id: 100,
      type: 'core',
      category: 'love_extras',
      text: '那个让你遗憾的人,他的姓?',
      options: null,
      input: true,
      placeholder: '请输入他/她的姓氏',
      maxLength: 10,
      required: true
    });
    extras.push({
      id: 101,
      type: 'core',
      category: 'love_extras',
      text: '那个让你遗憾的人,生日?',
      options: null,
      input: 'date',
      placeholder: '请选择生日',
      required: true
    });
  }

  if (likesQ && answers[likesQ.id] === 'yes') {
    extras.push({
      id: 102,
      type: 'core',
      category: 'love_extras',
      text: '那个让你心动的人,他的姓?',
      options: null,
      input: true,
      placeholder: '请输入他/她的姓氏',
      maxLength: 10,
      required: true
    });
    extras.push({
      id: 103,
      type: 'core',
      category: 'love_extras',
      text: '那个让你心动的人,生日?',
      options: null,
      input: 'date',
      placeholder: '请选择生日',
      required: true
    });
  }

  return extras;
}

function findAnswerKey(answers, loveKey) {
  // 从已回答的题里反查 loveKey 对应的题
  // 这里简单实现:直接根据我们已知的题目结构映射
  // 由于题目是随机的,我们从全局 state 里查
  if (typeof TestApp !== 'undefined' && TestApp.state.questions) {
    const q = TestApp.state.questions.find(q => q.loveKey === loveKey);
    return q;
  }
  return null;
}

// ============ 随机选过渡语 ============
function pickTransition(category) {
  const pool = TRANSITIONS[category];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============ 最终结果文案 ============
const FINAL_RESULTS = {
  destiny_yes: '天机不可泄露,顺其自然即可',
  destiny_no: '路在自己的脚下,每一步都是不一样的精彩人生'
};

// 暴露全局
window.MBTI_POOL = MBTI_POOL;
window.LOVE_POOL = LOVE_POOL;
window.FORTUNE_POOL = FORTUNE_POOL;
window.TRANSITIONS = TRANSITIONS;
window.buildQuestionSet = buildQuestionSet;
window.getConditionalQuestions = getConditionalQuestions;
window.pickTransition = pickTransition;
window.FINAL_RESULTS = FINAL_RESULTS;
window.findAnswerKey = findAnswerKey;

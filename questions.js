// 题目设计 - 核心问题穿插在掩护题中
// 用户以为是MBTI测试,实际第5题开始是核心感情测试

window.QUESTIONS = [
  // ===== 伪装 MBTI 4题 =====
  {
    id: 1,
    type: 'mbti',
    category: 'mbti',
    dimension: 'E_I',
    text: '周末宅家时你最常做的事是?',
    options: [
      { text: '约三五好友出去浪', value: 'E' },
      { text: '一个人窝沙发刷手机', value: 'I' }
    ]
  },
  {
    id: 2,
    type: 'mbti',
    category: 'mbti',
    dimension: 'S_N',
    text: '面对一个复杂问题,你更倾向?',
    options: [
      { text: '看实际数据和过往经验', value: 'S' },
      { text: '靠直觉和第六感瞎蒙', value: 'N' }
    ]
  },
  {
    id: 3,
    type: 'mbti',
    category: 'mbti',
    dimension: 'T_F',
    text: '朋友向你倾诉失恋,你第一反应是?',
    options: [
      { text: '帮他分析问题出在哪', value: 'T' },
      { text: '陪他骂渣男再递纸巾', value: 'F' }
    ]
  },
  {
    id: 4,
    type: 'mbti',
    category: 'mbti',
    dimension: 'J_P',
    text: '出门旅行你更喜欢?',
    options: [
      { text: '提前做好详细攻略', value: 'J' },
      { text: '说走就走随心所欲', value: 'P' }
    ]
  },

  // ===== 第5题开始 - 核心问题穿插 =====
  {
    id: 5,
    type: 'core',
    category: 'love',
    text: '你是否已经拥有爱人?',
    options: [
      { text: '是', value: 'yes' },
      { text: '否', value: 'no' }
    ]
  },
  {
    id: 6,
    type: 'fortune',  // 掩护算命题
    category: 'fortune',
    text: '你相信一见钟情吗?',
    options: [
      { text: '相信', value: 'yes' },
      { text: '不信', value: 'no' }
    ]
  },
  {
    id: 7,
    type: 'core',
    category: 'love',
    text: '你觉得的爱情是什么?',
    options: [
      { text: '责任', value: 'responsibility' },
      { text: '爱', value: 'love' },
      { text: '习惯', value: 'habit' }
    ]
  },
  {
    id: 8,
    type: 'fortune',
    category: 'fortune',
    text: '你相信一夜暴富吗?',
    options: [
      { text: '相信', value: 'yes' },
      { text: '不信', value: 'no' }
    ]
  },
  {
    id: 9,
    type: 'core',
    category: 'love',
    text: '你认为自己的这段爱情能永远保持下去?',
    options: [
      { text: '是', value: 'yes' },
      { text: '否', value: 'no' }
    ]
  },
  {
    id: 10,
    type: 'fortune',
    category: 'fortune',
    text: '你的姓?',
    options: null,
    input: true,
    placeholder: '请输入你的姓氏',
    maxLength: 10
  },
  {
    id: 11,
    type: 'core',
    category: 'love',
    text: '在你心里是否存在过遗憾?',
    options: [
      { text: '是', value: 'yes' },
      { text: '否', value: 'no' }
    ]
  },
  {
    id: 12,
    type: 'fortune',
    category: 'fortune',
    text: '你的生日是?',
    options: null,
    input: 'date',
    placeholder: '请选择你的生日',
    required: true
  },
  {
    id: 13,
    type: 'core',
    category: 'love',
    text: '你在感情中是否喜欢上过不是和你在一起的其他人或产生好感?',
    options: [
      { text: '是', value: 'yes' },
      { text: '否', value: 'no' }
    ]
  },
  {
    id: 14,
    type: 'fortune',
    category: 'fortune',
    text: '如果有配偶(爱人),爱人的姓?',
    options: null,
    input: true,
    placeholder: '请输入爱人姓氏,无则填无',
    maxLength: 10
  },
  {
    id: 15,
    type: 'fortune',
    category: 'fortune',
    text: '爱人的生日是?',
    options: null,
    input: 'date',
    placeholder: '请选择爱人生日,无则跳过',
    optional: true
  },
  {
    id: 16,
    type: 'fortune',
    category: 'fortune',
    text: '你是否相信自己的命运都是安排好的?',
    options: [
      { text: '是', value: 'yes' },
      { text: '否', value: 'no' }
    ]
  }
];

// 动态追加题目 - 根据用户选择
window.getConditionalQuestions = function(answers) {
  const extras = [];

  // 如果"心里存在遗憾"选是 → 追问那个人的姓+生日
  if (answers[11] === 'yes') {
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

  // 如果"喜欢上别人"选是 → 追问那个人的姓+生日
  if (answers[13] === 'yes') {
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
};

// 最终结果文案
window.FINAL_RESULTS = {
  destiny_yes: '天机不可泄露,顺其自然即可',
  destiny_no: '路在自己的脚下,每一步都是不一样的精彩人生'
};

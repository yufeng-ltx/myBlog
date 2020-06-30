module.exports = {
  title: 'yufeng-ltx个人站点',
  description: '专注于前端开发',
  port: 8989,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  theme: 'vdoing',
  themeConfig: {
    nav: [
      { text: '分类', link: '/categories/' },
      { text: '标签', link: '/tags/' },
      { text: '归档', link: '/archives/' },
      { text: 'Github', link: 'https://github.com/yufeng-ltx' },
    ],
    sidebar: 'structuring', // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | 自定义    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为'structuring',将无法使用目录页
    author: { // 文章默认的作者信息，可在md文件中单独配置此信息 String | {name: String, link: String}
      name: 'yufeng-ltx', // 必需
      link: 'https://github.com/yufeng-ltx' // 可选的
    },
    blogger:{ // 博主信息，显示在首页侧边栏
      avatar: '/images/avatars.png',
      name: 'yufeng-ltx',
      slogan: '专注前端开发'
    },
    social:{ // 社交图标，显示于博主信息栏和页脚栏
      icons: [
        {
          iconClass: 'icon-github',
          title: 'GitHub',
          link: 'https://github.com/yufeng-ltx'
        },
        {
          iconClass: 'icon-twitter',
          title: 'twitter',
          link: 'https://twitter.com/yufeng_ltx'
        },
        {
          iconClass: 'icon-youjian',
          title: '发邮件',
          link: 'mailto:yufeng.ltx@gmail.com'
        }
      ]
    },
    footer:{ // 页脚信息
      createYear: 2017, // 博客创建年份
      copyrightInfo: 'yufeng-ltx | MIT License', // 博客版权信息，支持a标签
    }
  },
  plugins: [ // 插件
    ['one-click-copy', { // 代码块复制按钮
      copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
      copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
      duration: 1000, // prompt message display time.
      showInMobile: false // whether to display on the mobile side, default: false.
    }],
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: false
    }],
    ['@vuepress/medium-zoom', {
      selector:'.theme-vdoing-content img:not(.no-zoom)', // 排除class是no-zoom的图片
      options: {
        background: 'rgba(0,0,0,0.6)',
        margin: 16
      }
    }]
  ]
}
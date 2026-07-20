import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Landers 课堂工具箱',
  description: '课堂小工具集合 - 随机抽学生、在线时间等',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '工具箱', link: '/tools/' },
      {
        text: '小工具',
        items: [
          { text: '随机抽取学生', link: '/tools/random-student' },
          { text: '在线时间', link: '/tools/online-clock' }
        ]
      }
    ],

    sidebar: {
      '/tools/': [
        {
          text: '课堂工具',
          items: [
            { text: '随机抽取学生', link: '/tools/random-student' },
            { text: '在线时间', link: '/tools/online-clock' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lllllan' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Landers'
    },

    outline: {
      label: '本页目录'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})

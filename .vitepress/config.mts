import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Landers 课堂工具箱',
  description: '课堂小工具集合 - 随机抽取、在线时间、数学老师工具箱等',
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
          { text: '随机抽取', link: '/tools/random-student' },
          { text: '在线时间', link: '/tools/online-clock' },
          { text: '初中数学老师必备工具箱', link: '/tools/math-teacher-toolkit' }
        ]
      }
    ],

    sidebar: {
      '/tools/': [
        {
          text: '课堂工具',
          items: [
            { text: '随机抽取', link: '/tools/random-student' },
            { text: '在线时间', link: '/tools/online-clock' }
          ]
        },
        {
          text: '资源导航',
          items: [
            { text: '初中数学老师必备工具箱', link: '/tools/math-teacher-toolkit' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lllllan/jian_zhan_da_zi' }
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

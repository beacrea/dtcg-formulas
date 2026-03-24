import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'dtcg-formulas',
  description:
    'A documentation-first, pluggable formula layer for DTCG design tokens.',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Spec', link: '/spec/scssdef' },
      { text: 'API', link: '/api/' },
      { text: 'Examples', link: '/examples/radius' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is dtcg-formulas?', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'FAQ', link: '/guide/faq' },
            { text: 'Roadmap', link: '/guide/roadmap' },
          ],
        },
      ],
      '/spec/': [
        {
          text: 'Specifications',
          items: [
            { text: '.module.scssdef Format', link: '/spec/scssdef' },
            { text: 'Formula Extension', link: '/spec/formula-extension' },
            { text: 'Registry Contract', link: '/spec/registry-contract' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: '@dtcg-formulas/parser', link: '/api/parser' },
            { text: '@dtcg-formulas/registry', link: '/api/registry' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Radius + Shape', link: '/examples/radius' },
            { text: 'Built-in: clamp', link: '/examples/clamp' },
            { text: 'Built-in: mix', link: '/examples/mix' },
            { text: 'Leonardo Color', link: '/examples/leonardo' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/beacrea/dtcg-formulas' },
    ],

    footer: {
      message: 'Released under the MIT License.',
    },

    search: {
      provider: 'local',
    },
  },
});

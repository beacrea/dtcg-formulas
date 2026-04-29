import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'dtcg-formulas',
  description: 'A documentation-first, pluggable formula layer for DTCG design tokens.',

  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Spec', link: '/spec/scssdef' },
      { text: 'API', link: '/api/' },
      { text: 'Functions', link: '/examples/' },
      { text: 'Architecture', link: '/architecture/public-readiness' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is dtcg-formulas?', link: '/guide/' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ],
        },
        {
          text: 'Learn',
          items: [
            { text: 'Concepts', link: '/guide/concepts' },
            { text: 'Authoring a Formula', link: '/guide/authoring-a-formula' },
            { text: 'Integrations', link: '/guide/integrations' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          ],
        },
        {
          text: 'Reference',
          items: [
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
          text: 'Built-in Functions',
          items: [
            { text: 'clamp', link: '/examples/clamp' },
            { text: 'mix', link: '/examples/mix' },
            { text: 'modular-scale', link: '/examples/modular-scale' },
          ],
        },
        {
          text: 'Contrast & Compositing',
          items: [
            { text: 'Composite', link: '/examples/composite' },
            { text: 'Optimal Foreground', link: '/examples/optimal-foreground' },
            { text: 'Leonardo Color', link: '/examples/leonardo' },
          ],
        },
        {
          text: 'Computation Adapters',
          items: [
            { text: 'Radius + Shape', link: '/examples/radius' },
            { text: 'Outline Radius', link: '/examples/outline-radius' },
            { text: 'Color Names', link: '/examples/color-names' },
            { text: 'Shade & Tint', link: '/examples/shade-tint' },
            { text: 'Fluid Size', link: '/examples/fluid-size' },
            { text: 'Material Shadow', link: '/examples/material-shadow' },
          ],
        },
      ],
      '/architecture/': [
        {
          text: 'Architecture',
          items: [{ text: 'Public Readiness', link: '/architecture/public-readiness' }],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/beacrea/dtcg-formulas' }],

    footer: {
      message: 'Released under the MIT License.',
    },

    search: {
      provider: 'local',
    },
  },
});

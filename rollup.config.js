import babel from 'rollup-plugin-babel'
import copy from 'rollup-plugin-copy'
import pkg from './package.json'

export default [
  //es
  {
    input: 'src/index.js',
    output: {file: 'es/index.js', format: 'es'},
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      babel(),
      copy({
        targets: [
          {src: 'src/index.d.ts', dest: 'es'}
        ]
      })
    ]
  }
]

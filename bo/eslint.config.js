import { configApp } from '@adonisjs/eslint-config'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default configApp({
  project: './tsconfig.json',
  tsconfigRootDir: __dirname,
})

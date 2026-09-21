import { defineConfig } from 'cypress'

export default defineConfig({
  defaultBrowser: 'chrome',
  viewportHeight: 200,
  viewportWidth: 300,
  fixturesFolder: false,
  e2e: {},
})

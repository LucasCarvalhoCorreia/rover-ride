import { Locator, Page } from '@playwright/test'

export class Header {
  readonly page: Page
  readonly restartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.restartButton = page.getByRole('button', { name: 'Recomeçar' })
  }

  async restart(): Promise<void> {
    await this.restartButton.click()
  }
}

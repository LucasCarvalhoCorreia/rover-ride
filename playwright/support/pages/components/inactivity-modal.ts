import { Locator, Page } from '@playwright/test'

export class InactivityModal {
  readonly page: Page
  readonly heading: Locator
  readonly continueButton: Locator
  readonly restartButton: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Ainda está aí?' })
    this.continueButton = page.getByRole('button', { name: 'Sim, continuar' })
    this.restartButton = page.getByRole('button', { name: 'Recomeçar' })
  }

  async confirmContinue(): Promise<void> {
    await this.continueButton.click()
  }

  async restart(): Promise<void> {
    await this.restartButton.click()
  }
}

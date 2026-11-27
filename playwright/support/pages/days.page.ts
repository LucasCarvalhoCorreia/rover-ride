import { Locator, Page } from '@playwright/test'
import type { DaysCount } from '../types'

export class DaysPage {
  readonly page: Page
  readonly backButton: Locator
  readonly continueButton: Locator

  constructor(page: Page) {
    this.page = page
    this.backButton = page.getByRole('button', { name: /Voltar/i })
    this.continueButton = page.getByRole('button', { name: /Continuar/i })
  }

  async selectDays(days: DaysCount): Promise<void> {
    const label = days === 1 ? /1 diária/i : new RegExp(`${days} diárias`, 'i')
    await this.page.getByRole('button', { name: label }).click()
  }

  async continue(): Promise<void> {
    await this.continueButton.click()
  }

  async back(): Promise<void> {
    await this.backButton.click()
  }
}

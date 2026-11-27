import { Locator, Page } from '@playwright/test'

export class CatalogPage {
  readonly page: Page
  readonly heading: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Conheça nossa frota' })
  }

  async selectRover(model: string): Promise<void> {
    await this.page.getByRole('button', { name: new RegExp(model, 'i') }).click()
  }
}

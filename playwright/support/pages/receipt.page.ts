import { Locator, Page } from '@playwright/test'

export class ReceiptPage {
  readonly page: Page
  readonly heading: Locator
  readonly finishButton: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Reserva confirmada!' })
    this.finishButton = page.getByRole('button', { name: 'Concluir' })
  }

  async finish(): Promise<void> {
    await this.finishButton.click()
  }
}

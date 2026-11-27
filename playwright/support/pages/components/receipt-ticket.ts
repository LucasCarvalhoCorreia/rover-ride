import { Locator, Page } from '@playwright/test'

export class ReceiptTicket {
  readonly page: Page
  readonly container: Locator

  constructor(page: Page) {
    this.page = page
    this.container = page.getByText('ROVER RIDE')
  }
}

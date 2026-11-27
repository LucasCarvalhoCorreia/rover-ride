import { Locator, Page } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly slogan: Locator
  readonly rentButton: Locator
  readonly lookupButton: Locator

  constructor(page: Page) {
    this.page = page
    this.slogan = page.getByText('A Lua é grande demais para ir a pé.')
    this.rentButton = page.getByRole('button', { name: 'Quero alugar um Rover' })
    this.lookupButton = page.getByRole('button', { name: 'Consultar minha reserva' })
  }

  async go(): Promise<void> {
    await this.page.goto('/')
  }

  async startRental(): Promise<void> {
    await this.rentButton.click()
  }

  async goToLookup(): Promise<void> {
    await this.lookupButton.click()
  }
}

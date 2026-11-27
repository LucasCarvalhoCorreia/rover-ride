import { Locator, Page } from '@playwright/test'

export class LookupPage {
  readonly page: Page
  readonly heading: Locator
  readonly resultHeading: Locator
  readonly searchInput: Locator
  readonly searchButton: Locator
  readonly newSearchButton: Locator
  readonly finishButton: Locator
  readonly backButton: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Encontre sua reserva' })
    this.resultHeading = page.getByRole('heading', { name: 'Sua reserva' })
    this.searchInput = page.getByLabel('Passaporte ou código da reserva')
    this.searchButton = page.getByRole('button', { name: 'Buscar' })
    this.newSearchButton = page.getByRole('button', { name: 'Nova busca' })
    this.finishButton = page.getByRole('button', { name: 'Concluir' })
    this.backButton = page.getByRole('button', { name: /Voltar/i })
  }

  async search(identifier: string): Promise<void> {
    await this.searchInput.fill(identifier)
    await this.searchButton.click()
  }

  async finish(): Promise<void> {
    await this.finishButton.click()
  }
}

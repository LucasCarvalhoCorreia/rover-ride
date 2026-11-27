import { Locator, Page } from '@playwright/test'
import type { CustomerData } from '../types'

export class CustomerDataPage {
  readonly page: Page
  readonly heading: Locator
  readonly backButton: Locator
  readonly confirmButton: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { name: 'Seus dados' })
    this.backButton = page.getByRole('button', { name: /Voltar/i })
    this.confirmButton = page.getByRole('button', { name: 'Confirmar reserva' })
  }

  async fillForm(data: CustomerData): Promise<void> {
    await this.page.getByLabel('Nome completo').fill(data.fullName)
    await this.page.getByLabel('E-mail').fill(data.email)
    await this.page.getByLabel('Passaporte').fill(data.passport)
    await this.page.getByLabel('Data de nascimento').fill(data.birthDate)
  }

  async submit(data: CustomerData): Promise<void> {
    await this.fillForm(data)
    await this.confirmButton.click()
  }

  async back(): Promise<void> {
    await this.backButton.click()
  }
}

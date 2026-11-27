import { Page, test as base } from '@playwright/test'
import { CatalogPage } from './pages/catalog.page'
import { Header } from './pages/components/header'
import { InactivityModal } from './pages/components/inactivity-modal'
import { ReceiptTicket } from './pages/components/receipt-ticket'
import { CustomerDataPage } from './pages/customer-data.page'
import { DaysPage } from './pages/days.page'
import { HomePage } from './pages/home.page'
import { LookupPage } from './pages/lookup.page'
import { ReceiptPage } from './pages/receipt.page'

export function createApp(page: Page) {
  return {
    homePage: new HomePage(page),
    catalogPage: new CatalogPage(page),
    daysPage: new DaysPage(page),
    customerDataPage: new CustomerDataPage(page),
    receiptPage: new ReceiptPage(page),
    lookupPage: new LookupPage(page),
    header: new Header(page),
    inactivityModal: new InactivityModal(page),
    receiptTicket: new ReceiptTicket(page),
  }
}

export type App = ReturnType<typeof createApp>

export const test = base.extend<{ app: App }>({
  app: async ({ page }, use) => {
    await use(createApp(page))
  },
})

export { expect } from '@playwright/test'

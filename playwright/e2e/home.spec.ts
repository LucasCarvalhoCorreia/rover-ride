import { test, expect } from '../support'

test('Exibir tela inicial do Rover Ride com opções de aluguel e consulta', async ({ app }) => {
  // Arrange & Act
  await app.homePage.go()

  // Assert
  await expect(app.homePage.slogan).toBeVisible()
  await expect(app.homePage.rentButton).toBeVisible()
  await expect(app.homePage.lookupButton).toBeVisible()
})

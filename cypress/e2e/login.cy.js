import {buildUser} from '../support/generate'

describe('login', () => {
  it('should login an existing user', () => {
    const user = buildUser()
    cy.request({
      url: 'http://localhost:3000/register',
      method: 'POST',
      body: user,
    })
    cy.visit('/')
    cy.findByText(/register/i).click()
    cy.findByLabelText(/username/i).type(user.username)
    cy.findByLabelText(/password/i).type(user.password)
    cy.findByText(/submit/i).click()
    cy.findByText(/logout/i).click()

    cy.findByText(/login/i).click()
    cy.findByLabelText(/username/i).type(user.username)
    cy.findByLabelText(/password/i).type(user.password)
    cy.findByText(/submit/i).click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
    cy.window()
      .its('localStorage.token')
      .should('be.a', 'string')
    cy.findByTestId('username-display').should('have.text', user.username)
  })
})

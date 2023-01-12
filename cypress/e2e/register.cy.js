import {buildUser} from '../support/generate'

describe('registration', () => {
  it('should register a new user', () => {
    const user = buildUser()

    cy.visit('/')
    cy.findByText(/register/i).click()
    cy.findByLabelText(/username/i).type(user.username)
    cy.findByLabelText(/password/i).type(user.password)
    cy.findByText(/submit/i).click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
    cy.window()
      .its('localStorage.token')
      .should('be.a', 'string')
    cy.findByTestId('username-display').should('have.text', user.username)
  })

  it("should show an error message if there's an error registering", () => {
    cy.intercept(
      {
        method: 'POST',
        url: 'http://localhost:3000/register',
      },
      {
        statusCode: 500,
        body: {},
        headers: {'access-control-allow-origin': '*'},
      },
    ).as('register')

    cy.visit('/register')
    cy.findByText(/submit/i).click()

    cy.wait('@register')
      .its('response.statusCode')
      .should('be.oneOf', [500])
    cy.findByText(/error.*try again/i)
  })
})

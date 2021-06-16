import moment from 'moment';

// Disable failing on exception since http://blazedemo.com/ throws exceptions.
// To make the setting global, move it to cypress/support/index.js

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Book Flight From Paris to London', () => {
  it('Visit blazedemo.com', () => {
    cy.visit('http://blazedemo.com/')

    // Front page
    cy.get('select[name="fromPort"]')
      .select('Paris')
      .invoke('val')
      .should('eq', 'Paris')
    cy.get('select[name="toPort"]')
      .select('London')
      .invoke('val')
      .should('eq', 'London')

    cy.contains('Find Flights').click()

    // Reserve page
    cy.url().should('include', '/reserve')
    cy.contains('Flights from Paris to London')

    cy.get('tbody>tr').eq(2).contains('Choose This Flight').click()

    // Purchase page
    // Note blazedemo returns wrong flight
    cy.url().should('include', '/purchase')
    cy.contains('has been reserved')

    cy.get('#inputName')
      .type('Test Me')
      .invoke('val')
      .should('eq', 'Test Me')
    cy.get('#address')
      .type('123 Street st.')
      .invoke('val')
      .should('eq', '123 Street st.')
    cy.get('#city')
      .type('Somewhere')
      .invoke('val')
      .should('eq', 'Somewhere')
    cy.get('#state')
      .type('Unknown')
      .invoke('val')
      .should('eq', 'Unknown')
    cy.get('#zipCode')
      .type('314156')
      .invoke('val')
      .should('eq', '314156')
    cy.get('#cardType')
      .select('American Express')
      .invoke('val')
      .should('eq', 'amex')
    cy.get('#creditCardNumber')
      .type('4242424242424242')
      .invoke('val')
      .should('eq', '4242424242424242')
    cy.get('#creditCardMonth')
      .clear() // because faulty form does not clean placeholder
      .type('12')
      .invoke('val')
      .should('eq', '12')
    cy.get('#creditCardYear')
      .clear() // because faulty form does not clean placeholder
      .type('2025')
      .invoke('val')
      .should('eq', '2025')
    cy.get('#nameOnCard')
      .type('Test Card')
      .invoke('val')
      .should('eq', 'Test Card')

    cy.contains('Purchase Flight').click()

    // Confirmation page
    cy.url().should('include', '/confirmation')
    cy.contains('Thank you for your purchase today!')

    const date = new Date()
    const formattedDate = moment(date).format('ddd, DD MMM YYYY')
    cy.get('table').contains('td', 'Date').next().contains(formattedDate)
  })
})
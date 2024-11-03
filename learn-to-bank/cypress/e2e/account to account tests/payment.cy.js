describe('External Payments', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login');
    cy.wait(1000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
  });

  describe('Make payment', () => {
    beforeEach(() => {
      cy.get('input[name="email"]')
        .type('test2@email.com');
      cy.get('input[name="password"]')
        .type('correctpassword');
      cy.get('button[type="submit"]')
        .click();

      cy.url()
        .should('include', '/home');
    });

    it('pays to another account successfully', () => {
      cy.contains('button', 'Pay')
        .should('be.visible')
        .click();
      cy.get('[href="/app/paySomeone"]')
        .should('be.visible')
        .click();
      cy.url()
        .should('include', '/paySomeone');

      cy.contains(/new contact/i)
        .should('be.visible')
        .click();

      cy.contains(/now/i)
        .should('be.visible')
        .click();

      cy.get('.select')
        .should('be.visible')
        .click();
      cy.contains(/simple saver/i)
        .should('be.visible')
        .click();

      cy.get('input[name="amount"]')
        .clear()
        .type('0.50');

      cy.get(':nth-child(1) > .jsx-355899491 > .wrapper > .jsx-936674888')
        .clear()
        .type('External payment test Reference');

      cy.contains(/payid/i)
        .should('be.visible')
        .click();

      cy.get('input[aria-label="PayID"]')
        .should('be.visible')
        .clear()
        .type('test@email.com');

      cy.get(':nth-child(2) > .jsx-355899491 > .wrapper > .jsx-936674888')
        .clear()
        .type('External payment test Description');

      cy.contains('button', 'Confirm')
        .click();

      cy.contains(/payment successful!/i)
        .should('be.visible');
    });

    it('logs the outgoin payment in payment history', () => {
      cy.contains('button', 'History')
        .should('be.visible')
        .click();
      cy.url()
        .should('include', '/history');

      cy.contains('$0.50')
        .should('be.visible');

      cy.contains(/from: simple saver/i)
        .should('be.visible');

      cy.get(':nth-child(1) > .jsx-355899491 > .jsx-3633143255 > .jsx-3058801100 > .jsx-4039973780')
        .should('have.text', 'View Details')
        .should('be.visible')
        .click();

      cy.contains(/description: external payment test description/i)
        .should('be.visible');
    });
  });

  describe('Receive payment', () => {
    beforeEach(() => {
      cy.get('input[name="email"]')
        .type('test@email.com');
      cy.get('input[name="password"]')
        .type('correctpassword');
      cy.get('button[type="submit"]')
        .click();

      cy.url()
        .should('include', '/home');
    });

    it('logs the incoming payment in payment history', () => {
      cy.contains('button', 'History')
        .should('be.visible')
        .click();
      cy.url()
        .should('include', '/history');

      cy.contains('$0.50')
        .should('be.visible');

      cy.contains(/to: simple saver/i)
        .should('be.visible');

      cy.get(':nth-child(1) > .jsx-355899491 > .jsx-3633143255 > .jsx-3058801100 > .jsx-4039973780')
        .should('have.text', 'View Details')
        .should('be.visible')
        .click();

      cy.contains(/description: external payment test description/i)
        .should('be.visible');
    });
  });
});
describe('Transfer Between Accounts', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login');
    cy.wait(1000);
    Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
    });

    cy.get('input[name="email"]').type('test@email.com');
    cy.get('input[name="password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('button', 'Pay').should('be.visible').click();
    cy.get('[href="/app/transfer"]').should('be.visible').click();
    cy.url().should('include', '/transfer');
    cy.contains('From').click('left')
  });
  
  it('renders everything correctly', () => {
    cy.contains('Transfer Between Accounts').should('be.visible');
    cy.contains('Choose Accounts').should('be.visible');
    cy.contains('From').should('be.visible');
    cy.get(':nth-child(1) > .select').should('be.visible');
    cy.contains('To').should('be.visible');
    cy.get(':nth-child(2) > .select').should('be.visible');

    cy.contains('Transfer Amount').should('be.visible');
    cy.get('.jsx-3582029255 > .with-label > .input-container > .input-wrapper').should('be.visible');
    cy.get('input[name="description"]').should('have.attr', 'placeholder', 'Enter description');
    cy.contains('button', 'Transfer').should('be.visible');
  });

  it('should have user accounts for from-account selection', () => {
    cy.get(':nth-child(1) > .select').click();
    cy.contains('Delightful Debit').click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Delightful Debit');

    cy.get(':nth-child(1) > .select').click();
    cy.contains('Clever Credit').click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Clever Credit');

    cy.get(':nth-child(1) > .select').click();
    cy.contains('Simple Saver').click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Simple Saver');
  });

  it('should have user accounts for to-account selection', () => {
    cy.get(':nth-child(2) > .select').click();
    cy.contains('Delightful Debit').click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Delightful Debit');

    cy.get(':nth-child(2) > .select').click();
    cy.contains('Clever Credit').click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Clever Credit');

    cy.get(':nth-child(2) > .select').click();
    cy.contains('Simple Saver').click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Simple Saver');
  });

  it('should not allow transfer with the same account', () => {
    
  });

  it('should show an error for invalid amount', () => {
 
  });

  it('should show an error for insufficient funds', () => {
  
  });

  it('should allow entering a description for the transfer', () => {
    
  });

  it('should successfully transfer when the inputs are valid, even without description', () => {
    
  });

  it('should successfully transfer when the inputs are valid, with description', () => {
    
  });
});
  
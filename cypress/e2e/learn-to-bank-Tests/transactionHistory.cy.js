describe('Transactions Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login');
    cy.wait(1000);
    Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
    });

    cy.get('input[name="email"]').type('test@email.com');
    cy.get('input[name="password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('button', 'History').should('be.visible').click();
    cy.url().should('include', '/transactions');
  });
  
  it('displays transactions history summary correctly', () => {
    cy.get('.jsx-1181318970').should('have.text', 'Transaction History').should('be.visible');
    cy.contains('Total Transactions: ').should('be.visible');
    cy.contains('Total Sent: ').should('be.visible');
    cy.contains('Total Received: ').should('be.visible');
    cy.contains('.select', 'Filter by account').should('be.visible');
    cy.get('.input-wrapper').should('be.visible');
    cy.contains('button', 'Download PDF Statement').should('be.visible');
  });

  it('contains all the select filters', () => {
    cy.contains('.select', 'Filter by account').should('be.visible');

    cy.get('.select').click();
    cy.contains('All Accounts').click();
    cy.get('.select').should('have.text', 'All Accounts');

    cy.get('.select').click();
    cy.contains('Delightful Debit (BSB: ').click();
    cy.get('.select').should('contain.text', 'Delightful Debit (BSB: ');

    cy.get('.select').click();
    cy.contains('Clever Credit (BSB: ').click();
    cy.get('.select').should('contain.text', 'Clever Credit (BSB: ');

    cy.get('.select').click();
    cy.contains('Simple Saver (BSB: ').click();
    cy.get('.select').should('contain.text', 'Simple Saver (BSB: ');

  });

  it('should filter transactions by selected account', () => {

  });

  it('should filter transactions based on search query', () => {

  });

  it('should expand and collapse transaction details', () => {

  });

  it('should download the PDF statement', () => {
    cy.contains('button', 'Download PDF Statement').click();
    cy.readFile('cypress/downloads/transactions.pdf').should('exist');
  });

  //----Navigations Bar Tests----//
  it('navigates to trasaction history', () => {
    cy.contains('button', 'History').should('be.visible').click();
    cy.url().should('include', '/transactions');
  });

  it('navigates to cards', () => {
    cy.contains('button', 'Cards').should('be.visible').click();
    cy.url().should('include', '/cards');
  });

  it('navigates to settings', () => {
    cy.contains('button', 'Settings').should('be.visible').click();
    cy.url().should('include', '/settings');
  });

  it('logs out', () => {
    cy.contains('button', 'Logout').should('be.visible').click();
    cy.url().should('include', '/login');
  });

  //----Pay Drawer Tests----//
    describe('Pay Drawer', () => {
    beforeEach(() => {
      cy.contains('button', 'Pay').should('be.visible').click();
    });

    it('displays pay drawer correctly', () => {
      cy.get('.jsx-981132863 > .jsx-1181318970').should('have.text', 'Pay').should('be.visible');
      cy.get('.jsx-2148573681').should('have.text', 'Instantiate a transfer').should('be.visible');
      cy.get('[href="/app/transfer"]').should('be.visible');
      cy.get('[href="/app/paySomeone"]').should('be.visible');
    });

    it('navigates to transfer between accounts', () => {
      cy.get('[href="/app/transfer"]').should('be.visible').click();

      cy.url().should('include', '/transfer');
    });

    it('navigates to pay someone', () => {
      cy.get('[href="/app/paySomeone"]').should('be.visible').click();

      //cy.url().should('include', '/paySomeone');
    });

    describe('Close Drawer', () => {
      beforeEach(() => {
        cy.get('.jsx-981132863 > .jsx-1181318970').should('have.text', 'Pay').should('be.visible');
        cy.get('.jsx-2148573681').should('have.text', 'Instantiate a transfer').should('be.visible');
        cy.get('[href="/app/transfer"]').should('be.visible');
        cy.get('[href="/app/paySomeone"]').should('be.visible');
      });

      it('close pay drawer with click to the top-left of screen', () => {
        cy.get('.backdrop').click('topLeft')
      });

      it('close pay drawer with click to the left of screen', () => {
        cy.get('.backdrop').click('left')
      });

      it('close pay drawer with click to the bottom-left of screen', () => {
        cy.get('.backdrop').click('bottomLeft')
      });

      it('close pay drawer with click to the top of screen', () => {
        cy.get('.backdrop').click('top')
      });

      it('close pay drawer with click to the center of screen', () => {
        cy.get('.backdrop').click('center')
      });

      it('close pay drawer with click to the bottom of screen', () => {
        cy.get('.backdrop').click('bottom')
      });

      afterEach(() => {
        cy.get('.jsx-981132863 > .jsx-1181318970').should('have.text', 'Pay').should('not.be.visible');
        cy.get('.jsx-2148573681').should('have.text', 'Instantiate a transfer').should('not.be.visible');
        cy.get('[href="/app/transfer"]').should('not.be.visible');
        cy.get('[href="/app/paySomeone"]').should('not.be.visible');
      });
    });

  });

});
  
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login');
    cy.wait(1000);
    Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
    });

    cy.get('input[name="email"]').type('test@email.com');
    cy.get('input[name="password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/accounts');
  });

  //----Accounts Display Tests---//
  it('displays the user information correctly', () => {
    cy.contains('Hi Test').should('be.visible');
    cy.contains('Next scheduled payment is in 3 days').should('be.visible');
  });

  it('displays Delightful Debit account correctly', () => {
    cy.contains('Delightful Debit').should('be.visible');
    cy.get(':nth-child(4) > .jsx-355899491 > .jsx-3633143255 > .jsx-1118122724 > :nth-child(1)').should('contain.text', 'BSB: ').should('be.visible');
    cy.get(':nth-child(4) > .jsx-355899491 > .jsx-3633143255 > .jsx-1118122724 > :nth-child(2)').should('contain.text', 'Account Number: ').should('be.visible');
    cy.get(':nth-child(4) > .jsx-355899491 > .jsx-3633143255 > .jsx-2790715020 > .jsx-510830267').should('contain.text', '$').should('be.visible');
  });

  it('displays Clever Credit account correctly', () => {
    cy.contains('Clever Credit').should('be.visible');
    cy.get(':nth-child(6) > .jsx-355899491 > .jsx-3633143255 > .jsx-1118122724 > :nth-child(1)').should('contain.text', 'BSB: ').should('be.visible');
    cy.get(':nth-child(6) > .jsx-355899491 > .jsx-3633143255 > .jsx-1118122724 > :nth-child(2)').should('contain.text', 'Account Number: ').should('be.visible');
    cy.get(':nth-child(6) > .jsx-355899491 > .jsx-3633143255 > .jsx-2790715020 > .jsx-510830267').should('contain.text', '$').should('be.visible');
  });

  it('displays Simple Saver account correctly', () => {
    cy.contains('Simple Saver').should('be.visible');
    cy.get(':nth-child(8) > .jsx-355899491 > .jsx-3633143255 > .jsx-1118122724 > :nth-child(1)').should('contain.text', 'BSB: ').should('be.visible');
    cy.get(':nth-child(8) > .jsx-355899491 > .jsx-3633143255 > .jsx-1118122724 > :nth-child(2)').should('contain.text', 'Account Number: ').should('be.visible');
    cy.get('.jsx-1118122724 > :nth-child(3)').should('contain.text', 'PayID: ').should('be.visible');
    cy.get(':nth-child(8) > .jsx-355899491 > .jsx-3633143255 > .jsx-2790715020 > .jsx-510830267').should('contain.text', '$').should('be.visible');
  });

  it('displays total account balance correctly', () => {
    cy.contains('Total').should('be.visible');
    cy.get(':nth-child(2) > .jsx-1181318970').should('contain.text', '$').should('be.visible');
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
  
describe('Upcoming Payments Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login');
    cy.wait(1000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.get('input[name="email"]')
      .type('test@email.com');
    cy.get('input[name="password"]')
      .type('correctpassword');
    cy.get('button[type="submit"]')
      .click();

    cy.contains('button', 'Upcoming')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/upcoming');
  });

  it('render all elements', () => {
    cy.contains(/recurring payments/i)
      .should('be.visible');
    cy.contains(/upcoming payments/i)
      .should('be.visible');
    cy.contains(/future one-off payments/i)
      .should('be.visible');
    cy.contains(/from/i)
      .should('be.visible');
    cy.contains(/to/i)
      .should('be.visible');
    cy.contains(/Date/i)
      .should('be.visible');
    cy.contains(/frequency/i)
      .should('be.visible');
    cy.contains(/started on/i)
      .should('be.visible');
  });

  it('edits recurring payments', () => {
    cy.contains('button', 'Edit')
      .click();

    cy.contains(/recurring payment/i)
      .should('be.visible');
    cy.contains(/repeat every/i)
      .should('be.visible');

    cy.get('.select')
      .click();
    cy.get('.jsx-3562667728 > :nth-child(1)')
      .should('contain.text', 'day')
      .should('be.visible')
      .click();
    cy.contains(/repeat on/i)
      .should('not.exist');

    cy.get('.select')
      .click();
    cy.get('.jsx-3562667728 > :nth-child(2)')
      .should('contain.text', 'week')
      .should('be.visible')
      .click();
    cy.contains(/repeat on/i)
      .should('be.visible');
    cy.get(':nth-child(2) > .jsx-3839588963')
      .click();
    cy.contains(/monday/i)
      .should('be.visible');
    cy.get(':nth-child(3) > .jsx-3839588963')
      .click();
    cy.contains(/tuesday/i)
      .should('be.visible');
    cy.get(':nth-child(4) > .jsx-3839588963')
      .click();
    cy.contains(/wednesday/i)
      .should('be.visible');
    cy.get(':nth-child(5) > .jsx-3839588963')
      .click();
    cy.contains(/thursday/i)
      .should('be.visible');
    cy.get(':nth-child(6) > .jsx-3839588963')
      .click();
    cy.contains(/friday/i)
      .should('be.visible');
    cy.get(':nth-child(7) > .jsx-3839588963')
      .click();
    cy.contains(/saturday/i)
      .should('be.visible');
    cy.get(':nth-child(8) > .jsx-3839588963')
      .click();
    cy.contains(/sunday/i)
      .should('be.visible');
    cy.contains(/Every week on Monday, Tuesday, Wednesday, Thursday, Friday, Saturday & Sunday./i)
      .should('be.visible');

    cy.get(':nth-child(3) > .select')
      .click();
    cy.get('.jsx-3562667728 > :nth-child(4)')
      .should('contain.text', 'year')
      .should('be.visible')
      .click();
    cy.contains(/repeat on/i)
      .should('not.exist');

    cy.get(':nth-child(3) > .select')
      .click();
    cy.get('.jsx-3562667728 > :nth-child(3)')
      .should('contain.text', 'month')
      .should('be.visible')
      .click();
    cy.contains(/repeat on/i)
      .should('be.visible');
    cy.contains(/repeat on week/i)
      .should('be.visible');
    cy.get(':nth-child(2) > .jsx-3839588963')
      .click();
    cy.contains(/every month on week 1/i)
      .should('be.visible');

    cy.contains(/date/i)
      .should('be.visible');
    cy.contains(/start date/i)
      .should('be.visible');
    cy.contains(/end date/i)
      .should('be.visible');

    cy.get('.jsx-2553028307')
      .should('contain.text', 'Cancel')
      .click();
  })

  //----Navigations Bar Tests----//
  it('navigates to home', () => {
    cy.contains('button', 'Home')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/home');
  });

  it('navigates to trasaction history', () => {
    cy.contains('button', 'History')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/history');
  });

  it('navigates to cards', () => {
    cy.contains('button', 'Cards')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/cards');
  });

  it('navigates to settings', () => {
    cy.contains('button', 'Settings')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/settings');
  });

  it('logs out', () => {
    cy.contains('button', 'Logout')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/login');
  });

  //----Pay Drawer Tests----//
  describe('Pay Drawer', () => {
    beforeEach(() => {
      cy.contains('button', 'Pay')
        .should('be.visible')
        .click();
    });

    it('displays pay drawer correctly', () => {
      cy.get('.jsx-981132863 > .jsx-1181318970')
        .should('have.text', 'Pay')
        .should('be.visible');
      cy.get('.jsx-2148573681')
        .should('contain.text', 'Initiate a transfer')
        .should('be.visible');
      cy.get('[href="/app/transfer"]')
        .should('be.visible');
      cy.get('[href="/app/paySomeone"]')
        .should('be.visible');
    });

    it('navigates to transfer between accounts', () => {
      cy.get('[href="/app/transfer"]')
        .should('be.visible')
        .click();

      cy.url()
        .should('include', '/transfer');
    });

    it('navigates to pay someone', () => {
      cy.get('[href="/app/paySomeone"]')
        .should('be.visible')
        .click();

      cy.url()
        .should('include', '/paySomeone');
    });

    describe('Close Drawer', () => {
      beforeEach(() => {
        cy.get('.jsx-981132863 > .jsx-1181318970')
          .should('have.text', 'Pay')
          .should('be.visible');
        cy.get('.jsx-2148573681')
          .should('contain.text', 'Initiate a transfer')
          .should('be.visible');
        cy.get('[href="/app/transfer"]')
          .should('be.visible');
        cy.get('[href="/app/paySomeone"]')
          .should('be.visible');
      });

      it('close pay drawer with click to the top-left of screen', () => {
        cy.get('.backdrop')
          .click('topLeft')
      });

      it('close pay drawer with click to the left of screen', () => {
        cy.get('.backdrop')
          .click('left')
      });

      it('close pay drawer with click to the bottom-left of screen', () => {
        cy.get('.backdrop')
          .click('bottomLeft')
      });

      it('close pay drawer with click to the top of screen', () => {
        cy.get('.backdrop')
          .click('top')
      });

      it('close pay drawer with click to the center of screen', () => {
        cy.get('.backdrop')
          .click('center')
      });

      it('close pay drawer with click to the bottom of screen', () => {
        cy.get('.backdrop')
          .click('bottom')
      });

      afterEach(() => {
        cy.get('.jsx-981132863 > .jsx-1181318970')
          .should('have.text', 'Pay')
          .should('not.be.visible');
        cy.get('.jsx-2148573681')
          .should('contain.text', 'Initiate a transfer')
          .should('not.be.visible');
        cy.get('[href="/app/transfer"]')
          .should('not.be.visible');
        cy.get('[href="/app/paySomeone"]')
          .should('not.be.visible');
      });
    });
  });
});
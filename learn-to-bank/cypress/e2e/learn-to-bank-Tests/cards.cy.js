describe('Cards Page', () => {
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

    cy.contains('button', 'Cards')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/cards');
  });

  it('displays credit and debit card information correctly', () => {
    cy.contains('Credit Card')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > :nth-child(2)')
      .should('contains.text', 'available')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > :nth-child(4)')
      .should('contains.text', 'EXPIRY **/**')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > :nth-child(5)')
      .should('contains.text', 'CSC ***')
      .should('be.visible');

    cy.get(':nth-child(3) > .jsx-3755957556 > .text').click();

    cy.contains('Debit Card')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > :nth-child(2)')
      .should('contains.text', 'available')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > :nth-child(4)')
      .should('contains.text', 'EXPIRY **/**')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > :nth-child(5)')
      .should('contains.text', 'CSC ***')
      .should('be.visible');
  });

  it('toggles visibility of credit card expiry and CSC on button click', () => {
    cy.contains('Credit Card')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > .jsx-1377825365')
      .should('contains.text', 'Show')
      .click();
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > :nth-child(4)')
      .should('contains.text', 'EXPIRY')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > :nth-child(5)')
      .should('contains.text', 'CSC')
      .should('be.visible');

    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > .jsx-1377825365')
      .should('contains.text', 'Hide')
      .click();
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > :nth-child(4)')
      .should('contains.text', 'EXPIRY **/**')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; transform: scale(1); opacity: 1;"] > [style="position: relative;"] > :nth-child(5)')
      .should('contains.text', 'CSC ***')
      .should('be.visible');
  });

  it('toggles visibility of debit card expiry and CSC on button click', () => {
    cy.get(':nth-child(3) > .jsx-3755957556 > .text')
      .click();
    cy.contains('Debit Card')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > .jsx-1377825365')
      .should('contains.text', 'Show')
      .click();
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > :nth-child(4)')
      .should('contains.text', 'EXPIRY')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > :nth-child(5)')
      .should('contains.text', 'CSC')
      .should('be.visible');

    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > .jsx-1377825365')
      .should('contains.text', 'Hide')
      .click();
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > :nth-child(4)')
      .should('contains.text', 'EXPIRY **/**')
      .should('be.visible');
    cy.get('[style="min-width: 533.333px; display: flex; justify-content: center; align-items: center; flex-direction: column; aspect-ratio: 1.77778 / 1; padding: 10px; transition: transform 0.5s, opacity 0.5s; opacity: 1; transform: scale(1);"] > [style="position: relative;"] > :nth-child(5)')
      .should('contains.text', 'CSC ***')
      .should('be.visible');
  });

  it('navigates through cards with carousel controls', () => {
    cy.contains('Credit Card')
      .should('be.visible');
    cy.get(':nth-child(3) > .jsx-3755957556 > .text')
      .click();
    cy.contains('Debit Card')
      .should('be.visible');
    cy.get(':nth-child(3) > .jsx-3755957556 > .text')
      .click();
    cy.contains('Credit Card')
      .should('be.visible');

    cy.contains('Credit Card')
      .should('be.visible');
    cy.get(':nth-child(1) > .jsx-3755957556 > .text')
      .click();
    cy.contains('Debit Card')
      .should('be.visible');
    cy.get(':nth-child(1) > .jsx-3755957556 > .text')
      .click();
    cy.contains('Credit Card')
      .should('be.visible');
  });

  it('switches between cards using dot indicators', () => {
    cy.get(':nth-child(1) > .jsx-3755957556 > .text')
      .click();
    cy.contains('Debit Card')
      .should('be.visible');

    cy.get(':nth-child(1) > .jsx-3755957556 > .text')
      .click();
    cy.contains('Credit Card')
      .should('be.visible');
  });

  //----Navigations Bar Tests----//
  it('navigates to home', () => {
    cy.contains('button', 'Home')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/home');
  });

  it('navigates to history', () => {
    cy.contains('button', 'History')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/history');
  });

  it('navigates to upcoming payments', () => {
    cy.contains('button', 'Upcoming')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/upcoming');
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
      cy.contains('button', 'Pay').should('be.visible').click();
    });

    it('displays pay drawer correctly', () => {
      cy.get('.jsx-981132863 > .jsx-1181318970').should('have.text', 'Pay').should('be.visible');
      cy.get('.jsx-2148573681').should('contain.text', 'Initiate a transfer').should('be.visible');
      cy.get('[href="/app/transfer"]').should('be.visible');
      cy.get('[href="/app/paySomeone"]').should('be.visible');
    });

    it('navigates to transfer between accounts', () => {
      cy.get('[href="/app/transfer"]').should('be.visible').click();

      cy.url().should('include', '/transfer');
    });

    it('navigates to pay someone', () => {
      cy.get('[href="/app/paySomeone"]').should('be.visible').click();

      cy.url().should('include', '/paySomeone');
    });

    describe('Close Drawer', () => {
      beforeEach(() => {
        cy.get('.jsx-981132863 > .jsx-1181318970').should('have.text', 'Pay').should('be.visible');
        cy.get('.jsx-2148573681').should('contain.text', 'Initiate a transfer').should('be.visible');
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
        cy.get('.jsx-2148573681').should('contain.text', 'Initiate a transfer').should('not.be.visible');
        cy.get('[href="/app/transfer"]').should('not.be.visible');
        cy.get('[href="/app/paySomeone"]').should('not.be.visible');
      });
    });
  });
});

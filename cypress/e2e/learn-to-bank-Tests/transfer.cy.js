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

  it('should show an error if none of the accounts are not selected', () => {
    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer failed: please specify accounts./i).should('be.visible');
  });

  it('should show an error if only one from-account is selected', () => {
    cy.get(':nth-child(1) > .select').click();
    cy.contains('Delightful Debit').click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Delightful Debit');

    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer failed: please specify accounts./i).should('be.visible');
  });

  it('should show an error if only one to-account is selected', () => {
    cy.get(':nth-child(2) > .select').click();
    cy.contains('Delightful Debit').click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Delightful Debit');

    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer failed: please specify accounts./i).should('be.visible');
  });


  it('should not allow transfer with the same account', () => {
    // Delightful Debit
    cy.get(':nth-child(1) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(1)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Delightful Debit');

    cy.get(':nth-child(2) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(1)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Delightful Debit');

    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer failed: cannot transfer into the same account./i).should('be.visible');

    // Clever Credit
    cy.get(':nth-child(1) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(2)')
      .should('have.text', 'Clever Credit')
      .click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Clever Credit');

    cy.get(':nth-child(2) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(2)')
      .should('have.text', 'Clever Credit')
      .click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Clever Credit');

    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer failed: cannot transfer into the same account./i).should('be.visible');

    // Simple Saver
    cy.get(':nth-child(1) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(3)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Simple Saver');

    cy.get(':nth-child(2) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(3)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Simple Saver');

    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer failed: cannot transfer into the same account./i).should('be.visible');
  });

  it('should show an error for invalid amount', () => {
    cy.get(':nth-child(1) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(3)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Simple Saver');

    cy.get(':nth-child(2) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(1)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Delightful Debit');

    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer failed: amount must be specified./i).should('be.visible');
  });

  it('should successfully transfer when the inputs are valid, even without description', () => {
    cy.get(':nth-child(1) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(3)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Simple Saver');

    cy.get(':nth-child(2) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(1)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Delightful Debit');

    cy.get('.jsx-3582029255 > .with-label > .input-container > .input-wrapper')
      .clear()
      .type('1.00');

    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer successful!/i).should('be.visible');
  });

  it('should successfully transfer when the inputs are valid, with description', () => {
    cy.get(':nth-child(1) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(3)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Simple Saver');

    cy.get(':nth-child(2) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(1)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Delightful Debit');

    cy.get('.jsx-3582029255 > .with-label > .input-container > .input-wrapper')
      .clear()
      .type('1.00');

    cy.get('input[name="description"]')
      .should('have.attr', 'placeholder', 'Enter description')
      .clear()
      .type('transaction with description');

    cy.contains('button', 'Transfer').click();
    cy.contains(/transfer successful!/i).should('be.visible');
  });

  it('should show an error for insufficient funds', () => {
    const drainAccount = (number) => {
      cy.get('.jsx-3582029255 > .with-label > .input-container > .input-wrapper')
        .clear()
        .type('50.00');

      cy.get('input[name="description"]')
        .should('have.attr', 'placeholder', 'Enter description')
        .clear()
        .type('drain ' + number);

      cy.contains('button', 'Transfer').click();

      cy.contains(/insufficient funds.|transfer successful!/i)
        .should('be.visible')
        .then(($el) => {
          if ($el.text().match(/insufficient funds./i)) {
            cy.log('Insufficient funds error displayed');
            return;
          } else if ($el.text().match(/transfer successful!/i)) {
            cy.log('Transfer successful, attempting to drain account again');
            drainAccount(number + 1);
          }
        });
    };

    // From
    cy.get(':nth-child(1) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(1)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(1) > .select').should('have.text', 'Delightful Debit');
    // To
    cy.get(':nth-child(2) > .select').click();
    cy.get('.jsx-3562667728 > :nth-child(3)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(2) > .select').should('have.text', 'Simple Saver');

    drainAccount(0);
  });

  //----Navigations Bar Tests----//
  it('navigates to home', () => {
    cy.contains('button', 'Home').should('be.visible').click();
    cy.url().should('include', '/accounts');
  });

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
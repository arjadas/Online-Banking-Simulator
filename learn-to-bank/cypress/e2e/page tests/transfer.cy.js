describe('Transfer Between Accounts', () => {
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

    cy.contains('button', 'Pay')
      .should('be.visible')
      .click();
    cy.get('[href="/app/transfer"]')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/transfer');
    cy.contains('From')
      .click('left')
  });

  describe('payment details', () => {
    beforeEach(() => {
      cy.contains(/transfer between accounts/i)
        .should('be.visible');
      cy.contains(/schedule/i)
        .should('be.visible');
    });

    describe('schedule and account details', () => {
      it('navigates to pay now and display all elements', () => {
        cy.contains(/now/i)
          .should('be.visible')
          .click();
        cy.contains(/transfer will be settled instantly./i)
          .should('be.visible');
      });

      it('navigates to pay later and display all elements', () => {
        cy.contains(/later/i)
          .should('be.visible')
          .click();
        cy.contains(/date/i)
          .should('be.visible');
        cy.get('input[name="laterDate"]')
          .should('have.attr', 'placeholder', 'Enter Date');
      });

      it('navigates to recurring payment and display all elements', () => {
        cy.contains(/recurring/i)
          .should('be.visible')
          .click();
        cy.contains(/recurring payment/i)
          .should('be.visible');
        cy.contains(/repeat every/i)
          .should('be.visible');

        cy.get(':nth-child(3) > .select')
          .click();
        cy.contains(/day/i)
          .should('be.visible')
          .click();
        cy.contains(/repeat on/i)
          .should('not.exist');

        cy.get(':nth-child(3) > .select')
          .click();
        cy.contains(/week/i)
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
        cy.contains(/year/i)
          .should('be.visible')
          .click();
        cy.contains(/repeat on/i)
          .should('not.exist');

        cy.get(':nth-child(3) > .select')
          .click();
        cy.contains(/month/i)
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

        cy.contains(/frequency/i)
          .should('be.visible');
        cy.contains(/set frequency/i)
          .should('be.visible')
          .click();
        cy.contains(/recurring payment/i)
          .should('be.visible');
        cy.get('.jsx-668295765')
          .should('contain.text', 'Done')
          .click();
        cy.contains(/recurring payment/i)
          .should('not.exist');
        cy.contains(/Every month on week 1, on Monday, Tuesday, Wednesday, Thursday, Friday, Saturday & Sunday./i)
          .should('be.visible');
      });

      afterEach(() => {
        cy.contains(/now/i)
          .should('be.visible')
        cy.contains(/later/i)
          .should('be.visible');
        cy.contains(/recurring/i)
          .should('be.visible');

        cy.contains(/choose accounts/i)
          .should('be.visible');
        cy.contains(/from/i)
          .should('be.visible');
        cy.get(':nth-child(1) > .select')
          .should('be.visible')
          .click();
        cy.contains(/simple saver/i)
          .should('be.visible');
        cy.contains(/delightful debit/i)
          .should('be.visible');
        cy.contains(/clever credit/i)
          .should('be.visible');
        cy.get(':nth-child(1) > .select')
          .click();

        cy.contains(/to/i)
          .should('be.visible');
        cy.get(':nth-child(2) > .select')
          .should('be.visible')
          .click();
        cy.contains(/simple saver/i)
          .should('be.visible');
        cy.contains(/delightful debit/i)
          .should('be.visible');
        cy.contains(/clever credit/i)
          .should('be.visible');
        cy.get(':nth-child(2) > .select')
          .click();

        cy.contains(/transfer amount/i)
          .should('be.visible');
        cy.get('input[name="amount"')
          .should('be.visible');
        cy.get('input[name="description"')
          .should('be.visible');
      });
    });

    afterEach(() => {
      cy.contains(/back/i)
        .should('be.visible');
      cy.contains('button', /confirm/i)
        .should('be.visible');
    });
  });

  it('should have user accounts for from-account selection', () => {
    cy.get(':nth-child(1) > .select')
      .click();
    cy.contains('Delightful Debit')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Delightful Debit');

    cy.get(':nth-child(1) > .select')
      .click();
    cy.contains('Clever Credit')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Clever Credit');

    cy.get(':nth-child(1) > .select')
      .click();
    cy.contains('Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Simple Saver');
  });

  it('should have user accounts for to-account selection', () => {
    cy.get(':nth-child(2) > .select')
      .click();
    cy.contains('Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Delightful Debit');

    cy.get(':nth-child(2) > .select')
      .click();
    cy.contains('Clever Credit')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Clever Credit');

    cy.get(':nth-child(2) > .select')
      .click();
    cy.contains('Simple Saver')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Simple Saver');
  });

  it('should show an error if none of the accounts are not selected', () => {
    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/transfer failed: please specify accounts./i)
      .should('be.visible');
  });

  it('should show an error if only one from-account is selected', () => {
    cy.get(':nth-child(1) > .select')
      .click();
    cy.contains('Delightful Debit')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Delightful Debit');

    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/transfer failed: please specify accounts./i)
      .should('be.visible');
  });

  it('should show an error if only one to-account is selected', () => {
    cy.get(':nth-child(2) > .select')
      .click();
    cy.contains('Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Delightful Debit');

    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/transfer failed: please specify accounts./i)
      .should('be.visible');
  });


  it('should not allow transfer with the same account', () => {
    // Delightful Debit
    cy.get(':nth-child(1) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(3)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Delightful Debit');

    cy.get(':nth-child(2) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(3)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Delightful Debit');

    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/transfer failed: cannot transfer to the same account./i)
      .should('be.visible');

    // Clever Credit
    cy.get(':nth-child(1) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(2)')
      .should('have.text', 'Clever Credit')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Clever Credit');

    cy.get(':nth-child(2) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(2)')
      .should('have.text', 'Clever Credit')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Clever Credit');

    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/transfer failed: cannot transfer to the same account./i)
      .should('be.visible');

    // Simple Saver
    cy.get(':nth-child(1) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(1)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Simple Saver');

    cy.get(':nth-child(2) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(1)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Simple Saver');

    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/transfer failed: cannot transfer to the same account./i)
      .should('be.visible');
  });

  it('should show an error for invalid amount', () => {
    cy.get(':nth-child(1) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(1)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Simple Saver');

    cy.get(':nth-child(2) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(3)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Delightful Debit');

    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/transfer failed: amount must be specified./i)
      .should('be.visible');
  });

  it('should successfully transfer when the inputs are valid, even without description', () => {
    cy.get(':nth-child(1) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(1)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Simple Saver');

    cy.get(':nth-child(2) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(3)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Delightful Debit');

    cy.get('input[name="amount"')
      .clear()
      .type('1.00');

    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/payment successful!/i)
      .should('be.visible');
  });

  it('should successfully transfer when the inputs are valid, with description', () => {
    cy.get(':nth-child(1) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(1)')
      .should('have.text', 'Simple Saver')
      .click();
    cy.get(':nth-child(1) > .select')
      .should('have.text', 'Simple Saver');

    cy.get(':nth-child(2) > .select')
      .click();
    cy.get('.jsx-3744672051 > :nth-child(3)')
      .should('have.text', 'Delightful Debit')
      .click();
    cy.get(':nth-child(2) > .select')
      .should('have.text', 'Delightful Debit');

    cy.get('input[name="amount"]')
      .clear()
      .type('1.00');

    cy.get('input[name="description"]')
      .should('have.attr', 'placeholder', 'Enter description')
      .clear()
      .type('transaction with description');

    cy.contains('button', /confirm/i)
      .click();
    cy.contains(/payment successful!/i)
      .should('be.visible');
  });

  it('should show an error for insufficient funds', () => {
    const drainAccount = (number) => {
      // From
      cy.get(':nth-child(1) > .select').click();
      cy.get('.jsx-3744672051 > :nth-child(3)')
        .should('have.text', 'Delightful Debit')
        .click();
      cy.get(':nth-child(1) > .select').should('have.text', 'Delightful Debit');
      // To
      cy.get(':nth-child(2) > .select').click();
      cy.get('.jsx-3744672051 > :nth-child(1)')
        .should('have.text', 'Simple Saver')
        .click();
      cy.get(':nth-child(2) > .select').should('have.text', 'Simple Saver');

      cy.get('input[name="amount"]')
        .clear()
        .type('50.00');

      cy.get('input[name="description"]')
        .should('have.attr', 'placeholder', 'Enter description')
        .clear()
        .type('drain ' + number);

      cy.contains('button', /confirm/i)
        .click();

      cy.contains(/insufficient funds.|payment successful!/i)
        .should('be.visible')
        .then(($el) => {
          if ($el.text().match(/insufficient funds./i)) {
            cy.log('Insufficient funds error displayed');
            return;
          } else if ($el.text().match(/payment successful!/i)) {
            cy.log('Transfer successful, attempting to drain account again');
            cy.contains('button', /go home/i)
              .click();
            cy.contains('button', 'Pay')
              .should('be.visible')
              .click();
            cy.get('[href="/app/transfer"]')
              .should('be.visible')
              .click();
            cy.url()
              .should('include', '/transfer');
            cy.contains('From')
              .click('left')
            drainAccount(number + 1);
          }
        });
    };

    drainAccount(0);
  });

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

  it('navigates to upcoming', () => {
    cy.contains('button', 'Upcoming')
      .should('be.visible')
      .click();
    cy.url()
      .should('include', '/upcoming');
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
    cy.contains('button', 'Logout').should('be.visible').click();
    cy.url().should('include', '/login');
  });

  //----Pay Drawer Tests----//
  describe('Pay Drawer', () => {
    beforeEach(() => {
      cy.contains('button', 'Home')
        .click();
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
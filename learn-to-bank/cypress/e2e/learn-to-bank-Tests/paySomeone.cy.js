describe('PaySomeone Page', () => {
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
    cy.get('[href="/app/paySomeone"]').should('be.visible').click();
    cy.url().should('include', '/paySomeone');
  });

  it('renders all elements correctly', () => {
    cy.get('.jsx-3196564830 > .jsx-355899491')
      .should('contain.text', 'Pay Someone')
      .should('be.visible');
    cy.get(':nth-child(1) > .jsx-2167891076')
      .should('be.visible');
    cy.contains(/new contact/i)
      .should('be.visible');
    cy.contains(/enter acc\/bsb, payid & bpay/i);
  });

  describe('payment details', () => {
    beforeEach(() => {
      cy.contains(/new contact/i)
        .click();
      cy.contains(/schedule/i)
        .should('be.visible');
      cy.contains(/payment method/i)
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
        cy.contains(/from account/i)
          .should('be.visible');
        cy.get('.select')
          .should('be.visible')
          .click();
        cy.contains(/simple saver/i)
          .should('be.visible');
        cy.contains(/delightful debit/i)
          .should('be.visible');
        cy.contains(/clever credit/i)
          .should('be.visible');
        cy.get('.select')
          .click();
        cy.contains(/amount/i)
          .should('be.visible');
        cy.get('.jsx-3582029255 > .with-label > .input-container > .input-wrapper')
          .should('be.visible');
        cy.contains(/reference/i)
          .should('be.visible');
        cy.contains(/for your reference only./i)
          .should('be.visible');
        cy.get(':nth-child(1) > .jsx-355899491 > .wrapper > .jsx-936674888')
          .should('be.visible');
      });
    });

    describe('payment method', () => {
      it('has ACC/BSB payment option', () => {
        cy.contains(/acc \/ bsb/i)
          .should('be.visible')
          .click();
        cy.contains(/traditional payment method/i)
          .should('be.visible');
        cy.contains(/account name/i)
          .should('be.visible');
        cy.get('input[aria-label="Account Name"]')
          .should('be.visible');
        cy.contains(/account number/i)
          .should('be.visible');
        cy.get('input[aria-label="Account Number"]')
          .should('be.visible');
        cy.contains(/bsb/i)
          .should('be.visible');
        cy.get('input[aria-label="BSB"]')
          .should('be.visible');
      });

      it('has PayID payment option', () => {
        cy.contains(/payid/i)
          .should('be.visible')
          .click();
        cy.contains(/payments using the recipient's email or mobile number/i)
          .should('be.visible');
        cy.get('.tabs > .content > .jsx-2019007676')
          .should('contain.text', 'PayID')
          .should('be.visible');
        cy.get('input[aria-label="PayID"]')
          .should('be.visible');
      });

      it('has BPay payment option', () => {
        cy.contains(/bpay/i)
          .should('be.visible')
          .click();
        cy.contains(/for bills, rent, tax, etc./i)
          .should('be.visible');
        cy.contains(/biller code/i)
          .should('be.visible');
        cy.get('input[aria-label="Biller Code"]')
          .should('be.visible');
        cy.contains(/crn/i)
          .should('be.visible');
        cy.get('input[aria-label="CRN"]')
          .should('be.visible');
      });

      afterEach(() => {
        cy.contains(/description/i)
          .should('be.visible');
        cy.contains(/shown to recipient./i)
          .should('be.visible');
        cy.get(':nth-child(2) > .jsx-355899491 > .wrapper > .jsx-936674888')
          .should('be.visible');
      });
    });

    afterEach(() => {
      cy.contains(/back/i)
        .should('be.visible');
      cy.contains(/confirm/i)
        .should('be.visible');
    });
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

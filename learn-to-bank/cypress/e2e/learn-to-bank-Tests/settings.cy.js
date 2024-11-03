describe('settings page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login');
    cy.wait(1000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.get('input[name="email"]').type('test@email.com');
    cy.get('input[name="password"]').type('correctpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('button', 'Settings').should('be.visible').click();
    cy.url().should('include', '/settings');
  });

  describe('configure settings', () => {

    it('render all elements correctly', () => {
      cy.get('.jsx-1181318970')
        .should('have.text', 'Settings')
        .should('be.visible');
      cy.get(':nth-child(1) > .jsx-1136534845')
        .should('have.text', 'Edit Name')
        .should('be.visible');
      cy.get('input[name="firstName"]')
        .should('have.attr', 'placeholder', 'First Name')
        .should('be.visible');
      cy.get('input[name="lastName"]')
        .should('have.attr', 'placeholder', 'Last Name')
        .should('be.visible');
      cy.get(':nth-child(2) > .jsx-1136534845')
        .should('have.text', 'Change Password')
        .should('be.visible');
      cy.contains(/reset password via email/i).should('be.visible');
      cy.get(':nth-child(3) > .jsx-1136534845')
        .should('have.text', 'Change Text Size')
        .should('be.visible');
      cy.get('.jsx-1900986239')
        .should('be.visible');
      cy.get(':nth-child(3) > .jsx-1141888043 > .jsx-355899491')
        .should('contains.text', 'Preview')
        .should('be.visible');
      cy.contains(/save settings/i).should('be.visible');
      cy.contains(/delete account/i).should('be.visible');
    });

    const setSliderValue = (targetValue) => {
      const min = 10;
      const max = 32;

      cy.get('.slider').then(($slider) => {
        const rect = $slider[0].getBoundingClientRect();
        const sliderWidth = rect.width;

        const positionX = rect.left + ((targetValue - min) / (max - min)) * sliderWidth;

        cy.wrap($slider).click(positionX - rect.left, rect.height / 2);
      });
    };

    it('requires first and last names to be filled before saving', () => {
      cy.get('[name="firstName"]').clear();
      cy.get('[name="lastName"]').clear();
      cy.contains(/save settings/i).click();
      cy.get('input:invalid').should('have.length', 2);

      cy.get('[name="firstName"]').clear().type('New');
      cy.get('[name="lastName"]').clear();
      cy.contains(/save settings/i).click();
      cy.get('input:invalid').should('have.length', 1);

      cy.get('[name="firstName"]').clear();
      cy.get('[name="lastName"]').clear().type('Name');
      cy.contains(/save settings/i).click();
      cy.get('input:invalid').should('have.length', 1);
    });

    it('should save settings successfully', () => {
      cy.get('[name="firstName"]').clear().type('New');
      cy.get('[name="lastName"]').clear().type('Name');
    
      setSliderValue(20);
      cy.contains(/save settings/i).click();
      cy.get('.jsx-175525636').should('contain.text', 'New settings saved');
    });
    

    it('should send a password reset email', () => {
    
    });

    it('should update text size preview when slider is adjusted', () => {
      setSliderValue(16);
      cy.contains(/this is a sample text/i)
        .should('have.css','font-size', '16px');

      setSliderValue(20);
      cy.contains(/this is a sample text/i)
        .should('have.css','font-size', '20px');
    });


    describe('delete account modal', () => {
      beforeEach(() => {
        cy.contains(/delete account/i).click();
      });

      it('renders delete account confirmation modal correctly', () => {
        cy.get('.jsx-981132863').should('have.text', 'Delete Account');
        cy.contains(/to confirm, type "DELETE"/i).should('be.visible');

        cy.get('input[name="delete"]')
          .should('have.attr', 'placeholder', 'type here')
          .should('be.visible');

        cy.contains(/warning: Account deletion is permanent and irreversible—once deleted, all data will be lost!/i)
          .should('be.visible');

        cy.get('.jsx-929475340').should('be.disabled');
      });

      it('should give direction if deletion input is blurred while empty or incorrect', () => {
        cy.get('input[name="delete"]')
          .should('have.attr', 'placeholder', 'type here')
          .as('input')
          .clear()
          .focus();
        cy.get('@input').blur();
        cy.contains(/type "DELETE" to enable delete button/i)
          .should('be.visible');

        cy.get('@input')
          .clear()
          .type('DELETE');
        cy.contains(/type "DELETE" to enable delete button/i)
          .should('not.exist');

        cy.get('@input')
          .focus()
          .clear()
          .type('incorrect');
        cy.get('@input').blur();
        cy.contains(/type "DELETE" to enable delete button/i)
          .should('be.visible');
        
        cy.get('.jsx-929475340').should('be.disabled');
      });

      it('should prevent deletion if DELETE is not typed correctly', () => {
        cy.get('input[name="delete"]')
          .should('have.attr', 'placeholder', 'type here')
          .as('input')
          .clear()
        cy.get('.jsx-929475340').should('be.disabled');

        cy.get('@input')
          .clear()
          .type('nottheword');
        cy.get('.jsx-929475340').should('be.disabled');

        cy.get('@input')
          .clear()
          .type('dddelete');
        cy.get('.jsx-929475340').should('be.disabled');

        cy.get('@input')
          .clear()
          .type('delete');
        cy.get('.jsx-929475340').should('be.disabled');

        cy.get('@input')
          .clear()
          .type('DDELTE');
        cy.get('.jsx-929475340').should('be.disabled');

        cy.get('@input')
          .clear()
          .type('D ELETE');
        cy.get('.jsx-929475340').should('be.disabled');
      });


      it('should enable delete account button when DELETE is typed', () => {
        cy.get('input[name="delete"]')
          .should('have.attr', 'placeholder', 'type here')
          .clear()
          .type('DELETE');
        cy.get('.jsx-668295765').should('be.enabled');
      });

      afterEach(() => {
        cy.contains(/cancel/i).click();
      });
    });
    
    describe('close modal', () => {
      beforeEach(() => {
        cy.contains(/delete account/i).click();
      });

      it('close modal with click to the top-left of screen', () => {
        cy.get('.backdrop').click('topLeft')
      });

      it('close modal with click to the left of screen', () => {
        cy.get('.backdrop').click('left')
      });

      it('close modal with click to the bottom-left of screen', () => {
        cy.get('.backdrop').click('bottomLeft')
      });

      it('close modal with click to the top of screen', () => {
        cy.get('.backdrop').click('top')
      });

      it('close modal with click to the bottom of screen', () => {
        cy.get('.backdrop').click('bottom')
      });

      it('close modal with click to the top-right of screen', () => {
        cy.get('.backdrop').click('topRight')
      });

      it('close modal with click to the right of screen', () => {
        cy.get('.backdrop').click('right')
      });

      it('close modal with click to the bottom-right of screen', () => {
        cy.get('.backdrop').click('bottomRight')
      });

      afterEach(() => {
        cy.get('.wrapper').should('not.exist');
      });
    });

    // Reset settings state
    afterEach(() => {
      cy.get('[name="firstName"]')
        .clear()
        .type('Test');
      cy.get('[name="lastName"]')
        .clear()
        .type('Account');

      setSliderValue(16);
      cy.contains(/save settings/i).click();
    })
  })
  
  //----Navigations Bar Tests----//
  it('navigates to home', () => {
    cy.contains('button', 'Home').should('be.visible').click();
    cy.url().should('include', '/home');
  });

  it('navigates to trasaction history', () => {
    cy.contains('button', 'History').should('be.visible').click();
    cy.url().should('include', '/history');
  });

  it('navigates to cards', () => {
    cy.contains('button', 'Cards').should('be.visible').click();
    cy.url().should('include', '/cards');
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
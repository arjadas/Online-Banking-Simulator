describe('Forgot Password Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3002/login');
        cy.wait(1000);
        Cypress.on('uncaught:exception', (err, runnable) => {
            return false;
        }); 
        cy.contains('a', 'Forgot your password?').click();
    });
  
    it('renders all elements correctly', () => {
      cy.contains('h3', 'Forgot Password').should('be.visible');
      cy.contains('p', 'You will receive an email with instructions to reset your password if it exists in our system.').should('be.visible');
      cy.contains('h6', 'Email').should('be.visible');
  
      cy.get('input[name="email"]').should('have.attr', 'placeholder', 'Enter your Email');
      cy.contains('button', 'Submit Email').should('be.visible');
  
      cy.contains('a', 'Back to Sign in').should('have.attr', 'href', '/login');
    });
  
    it('displays an alert when email input is empty', () => {
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Please enter an email address.');
      });
  
      cy.get('button[type="submit"]').click();
    });
  
    it('displays success alert and redirects to login after sending email', () => {
      cy.on('window:alert', (text) => {
        expect(text).to.equal('Email sent! Check your inbox for the password reset link.');
      });
  
      cy.get('input[name="email"]').type('test@email.com');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/login');
    });
  
    it('navigates to the login page when "Back to Sign in" is clicked', () => {
      cy.contains('a', 'Back to Sign in').click();
      cy.url().should('include', '/login');
    });
  });
  
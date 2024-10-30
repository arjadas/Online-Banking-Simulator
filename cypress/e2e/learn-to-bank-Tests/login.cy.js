describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3002/login');
      cy.wait(1000);
      Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
      });      
    });
  
    it('renders all elements correctly', () => {

      cy.get('input[name="email"]').should('have.attr', 'placeholder', 'Email');
      cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Password');
      cy.contains('button', 'Log in').should('be.visible');
  
      cy.contains('a', 'Sign up').should('have.attr', 'href', '/signup');
      cy.contains('a', 'Forgot your password?').should('have.attr', 'href', '/forgotPassword');
    });
  
    it('requires email and password fields to be filled before submitting', () => {
      cy.get('button[type="submit"]').click();
      cy.get('input:invalid').should('have.length', 2);
    });
  
    it('shows an error if login credentials are incorrect', () => {
      cy.get('input[name="email"]').type('wrong@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      cy.contains('Invalid email or password').should('be.visible');
    });
  });
  
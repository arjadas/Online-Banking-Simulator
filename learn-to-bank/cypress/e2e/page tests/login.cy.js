describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login');
    cy.wait(1000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
  });

  it('renders all elements correctly', () => {
    cy.get('input[name="email"]')
      .should('have.attr', 'placeholder', 'Email');
    cy.get('input[name="password"]')
      .should('have.attr', 'placeholder', 'Password');
    cy.contains('button', 'Log in')
      .should('be.visible');

    cy.contains('a', 'Sign up')
      .should('have.attr', 'href', '/signup');
    cy.contains('a', 'Forgot your password?')
      .should('have.attr', 'href', '/forgotPassword');
  });

  it('requires email and password fields to be filled before submitting', () => {
    cy.get('button[type="submit"]')
      .click();
    cy.get('input:invalid')
      .should('have.length', 2);
  });

  it('shows an error if the email is incorrect', () => {
    cy.get('input[name="email"]')
      .type('wrong@email.com');
    cy.get('input[name="password"]')
      .type('correctpassword');
    cy.get('button[type="submit"]')
      .click();

    cy.contains('Invalid email or password')
      .should('be.visible');
  });

  it('shows an error if the email is correct, but not the password', () => {
    cy.get('input[name="email"]')
      .type('test@email.com');
    cy.get('input[name="password"]')
      .type('wrongpassword');
    cy.get('button[type="submit"]')
      .click();

    cy.contains('Invalid email or password')
      .should('be.visible');
  });

  it('logs in successfully with correct credentials', () => {
    cy.get('input[name="email"]')
      .type('test@email.com');
    cy.get('input[name="password"]')
      .type('correctpassword');
    cy.get('button[type="submit"]')
      .click();

    cy.url()
      .should('not.include', '/login');
  });

  it('displays loading state on login button when submitting', () => {
    cy.get('input[name="email"]')
      .type('test@email.com');
    cy.get('input[name="password"]')
      .type('correctpassword');
    cy.get('button[type="submit"]')
      .click();

    cy.get('button[type="submit"]')
      .should('be.disabled');
  });

  it('navigates to the sign-up page when clicking "Sign up"', () => {
    cy.contains('a', 'Sign up')
      .click();
    cy.url()
      .should('include', '/signup');
  });

  it('navigates to the forgot password page when clicking "Forgot your password?"', () => {
    cy.contains('a', 'Forgot your password?')
      .click();
    cy.url()
      .should('include', '/forgotPassword');
  });
});

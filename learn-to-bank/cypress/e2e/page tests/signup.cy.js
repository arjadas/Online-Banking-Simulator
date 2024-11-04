describe('Sign Up Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3002/login');
    cy.wait(1000);
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.contains('a', 'Sign up')
      .click();
  });

  it('renders all elements correctly', () => {
    cy.contains('h3', 'Sign Up')
      .should('be.visible');
    cy.get('input[name="first_name"]')
      .should('have.attr', 'placeholder', 'First Name');
    cy.get('input[name="last_name"]')
      .should('have.attr', 'placeholder', 'Last Name');
    cy.get('input[name="email"]')
      .should('have.attr', 'placeholder', 'Email');
    cy.get('input[name="password"]')
      .should('have.attr', 'placeholder', 'Password');
    cy.get('input[name="confirm_password"]')
      .should('have.attr', 'placeholder', 'Confirm Password');
    cy.contains('button', 'Sign up')
      .should('be.visible');
    cy.contains('Go back to Login')
      .should('have.attr', 'href', '/login');
  });

  it('requires all fields to be filled before submitting', () => {
    cy.get('button[type="submit"]')
      .click();
    cy.get('input:invalid')
      .should('have.length', 5);
  });

  it('shows error if passwords do not match', () => {
    cy.get('input[name="first_name"]')
      .type('Test');
    cy.get('input[name="last_name"]')
      .type('Account');
    cy.get('input[name="email"]')
      .type('test@email.com');
    cy.get('input[name="password"]')
      .type('correctpassword123');
    cy.get('input[name="confirm_password"]')
      .type('correctpassword456');
    cy.get('button[type="submit"]')
      .click();
    cy.contains('Passwords Do Not Match - Please Try Again.')
      .should('be.visible');
  });

  it('shows error if email already in use', () => {
    cy.get('input[name="first_name"]')
      .type('Test');
    cy.get('input[name="last_name"]')
      .type('Account');
    cy.get('input[name="email"]')
      .type('test@email.com');
    cy.get('input[name="password"]')
      .type('correctpassword');
    cy.get('input[name="confirm_password"]')
      .type('correctpassword');
    cy.get('button[type="submit"]')
      .click();

    cy.contains('An Account With This Email Already Exist.')
      .should('be.visible');
  });

  it('shows loading state on submit', () => {
    cy.get('input[name="first_name"]')
      .type('Test');
    cy.get('input[name="last_name"]')
      .type('Account');
    cy.get('input[name="email"]')
      .type('test@email.com');
    cy.get('input[name="password"]')
      .type('correctpassword');
    cy.get('input[name="confirm_password"]')
      .type('correctpassword');
    cy.get('button[type="submit"]')
      .click();

    cy.get('button[type="submit"]')
      .should('be.disabled');
  });

  it('navigates to the Login page when clicking "Go back to Login"', () => {
    cy.contains('a', 'Go back to Login')
      .click();
    cy.url()
      .should('include', '/login');
  });
});

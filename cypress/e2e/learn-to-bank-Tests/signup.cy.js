describe('Sign Up Page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3002/login')
        cy.contains('a', 'Sign up').click();
    })

});
      
describe('avtentikacija', () => {
  it('uporabnik se lahko prijavi', () => {
    cy.visit('http://localhost:3000/login')

    cy.get('input[type="email"]')
    .should('be.visible')
    .and('not.be.disabled')
    .type('test1@gmail.com')

    cy.get('input[type="password"]')
    .should('be.visible')
    .and('not.be.disabled')
    .type('geslo')
    
    cy.get('button.btn').should('not.be.disabled').click()
  })
})

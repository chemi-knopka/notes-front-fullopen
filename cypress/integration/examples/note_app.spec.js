/* eslint-disable */
describe('Note app', function() {
    beforeEach(() => {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name:'shota',
            username: 'shotius',
            password: '123'
        }
        cy.request('POST', 'http://localhost:3001/api/users', user)
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.visit('http://localhost:3000')
        cy.contains('Notes')
    })

    it('login form can be opened', function() {
        cy.visit('http://localhost:3000')
        cy.contains('login').click()
    })

    it('login fails with wrong credentials', function() {
        cy.contains('login').click()
        cy.get('#username').type('shotius')
        cy.get('#password').type('wrongPassword')
        cy.get('#loginBtn').click()
        cy.get('.error').contains('Wrong Credentials')
        cy.get('.error')
            .should('contain', 'Wrong Credentials')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
            .and('have.css', 'border-style', 'solid')

        cy.get('html').should('not.contain', 'shota loged-in')
        

    })

    it('user can login', function() {
        cy.visit('http://localhost:3000')
        cy.contains('login').click()
        cy.get('#username').type('shotius')
        cy.get('#password').type('123')
        cy.get('#loginBtn').click()
        cy.contains('shota loged-in')
    })

    describe('when logged in', () => {
        beforeEach(function() {
            cy.login({ username: 'shotius', password: '123'})
        })

        it('a new note can be created', function() {
            cy.contains('add note').click()
            cy.get('input').type('a note is created by cypress')
            cy.contains('save').click()
            cy.contains('a note is created by cypress')
        })

        describe.only('and a note exists', function() {
            beforeEach(function() {
               cy.createNote({ content: 'note one', important: false })
               cy.createNote({ content: 'note two', important: false })
               cy.createNote({ content: 'note three', important: false })
            })

            it('it can be made unmiportant', function() {
                cy.contains('note one').parent().find('button').as('theButton')
                cy.get('@theButton').click()
                cy.get('@theButton').should('contain', 'make unimportant')
            })
        })
    })
    
})
const Book_URL = '/books'
let text

describe('search books', () => {
    
    Cypress.on('uncaught:exception', (err, runnable) => {
        return false;
    });

    const getBooks = () => {
        return cy.request('/BookStore/v1/Books')
        .its('body')
    }


    
    before(() => {
        cy.visit(Book_URL)

        cy.url()
        .should('eq', Cypress.config().baseUrl + Book_URL)

    })


    it('Search for specific book', () => {
        
        getBooks()
        .then( response => {
            text = response.books[1]['author']
            cy
            .get('#searchBox')
            .type(text)
            cy
            .get('.rt-tbody > :nth-child(1) > .rt-tr > :nth-child(3)')
            .then(($ele) => {
                expect($ele.text()).to.equal(text)
            })
        })
        
        
        
    })



})
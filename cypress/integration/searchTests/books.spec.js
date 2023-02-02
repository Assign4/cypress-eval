const Book_URL = '/books'
let books

describe('Books', () => {
    
    
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


    it('Books should have title, Author and, Publisher', () => {
        getBooks()
        .then(response => {
            return response.books
        })
        .each((value) => {
        return expect(value).to.have.all.keys('title', 'publisher', 'author', 'description', 'isbn', 'pages', 'publish_date', 'subTitle', 'website')
        })
    })

    it('checks entire table ', () => {
        
        getBooks()
        .then(response => {
            books = response.books
        })
        


        cy.get('rt-tbody rt-td').should(($rows) => {
            // go through each row and confirm it shows the right information from CSV
            $rows.each((k, $row) => {
              const record = books[k]
              const cells = Cypress._.map($row.children, 'innerText')
      
              expect(cells).to.deep.equal(record)
            })
        })
     })

})


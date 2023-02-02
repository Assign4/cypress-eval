const assertOnline = () => {
    return cy.wrap(window).its('navigator.onLine').should('be.true')
  }
  
  const assertOffline = () => {
    return cy.wrap(window).its('navigator.onLine').should('be.false')
  }
  
  const goOffline = () => {
    cy.log('**go offline**')
    .then(() => {
      return Cypress.automation('remote:debugger:protocol',
        {
          command: 'Network.enable',
        })
    })
    .then(() => {
      return Cypress.automation('remote:debugger:protocol',
        {
          command: 'Network.emulateNetworkConditions',
          params: {
            offline: true,
            latency: -1,
            downloadThroughput: -1,
            uploadThroughput: -1,
          },
        })
    })
  }
  
  const goOnline = () => {
    // disable offline mode, otherwise we will break our tests :)
    cy.log('**go online**')
    .then(() => {
      // https://chromedevtools.github.io/devtools-protocol/1-3/Network/#method-emulateNetworkConditions
      return Cypress.automation('remote:debugger:protocol',
        {
          command: 'Network.emulateNetworkConditions',
          params: {
            offline: false,
            latency: -1,
            downloadThroughput: -1,
            uploadThroughput: -1,
          },
        })
    })
  }
  
  // since we are using Chrome debugger protocol API
  // we should only run these tests when NOT in Firefox browser
  // see https://on.cypress.io/configuration#Test-Configuration
  describe('offline mode', { browser: '!firefox' }, () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

     
    // make sure we get back online, even if a test fails
    // otherwise the Cypress can lose the browser connection
    beforeEach(goOnline)
    afterEach(goOnline)
  
    it('shows network status', () => {
      cy.visit('/books')
      cy.contains('#network-status', 'online')
      .wait(1000) // for demo purpose
  
      goOffline()
      cy.contains('#network-status', 'offline')
      .wait(1000) // for demo purpose
    })
})
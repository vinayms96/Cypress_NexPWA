/// <reference types="Cypress" />

class OrderSuccess {
    get_order_id() { 
        return cy.get('.OrderConfirmation-block h2')
    }
}
export default OrderSuccess
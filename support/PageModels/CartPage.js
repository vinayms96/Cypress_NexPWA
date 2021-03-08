/// <reference types="Cypress" />

export default class CartPage {
    click_view_cart() {
        cy.get('[elem=CartButton]').click()
    }
    
    get_cart_header() {
        return cy.get('.CartPage-Static h2')
    }

    get_product_list() {
        return cy.get('.CartPage-Static li')
    }
}
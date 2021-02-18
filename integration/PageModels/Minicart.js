/// <reference types="Cypress" />

export default class Minicart {
    click_checkout_btn() {
        cy.get('[elem=CheckoutButton]').click()
    }

    get_minicart_title() {
        return cy.get('p[class=CartOverlay-Promo] > strong')
    }

    get_products_list() {
        return cy.get('.CartOverlay-Items li')
    }
}
/// <reference types="Cypress" />

export default class SearchListingpage {
    get_product_list() {
        return cy.get('.CategoryProductList-Page').children()
    }
}
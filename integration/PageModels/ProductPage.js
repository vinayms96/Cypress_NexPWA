/// <reference types="Cypress" />

export default class ProductPage {
    get_product_options() {
        return cy.get('.ProductConfigurableAttributes')
    }

    get_product_swatches() {
        return cy.get('.ProductConfigurableAttributes-SwatchList')
    }

    get_group_options_qty() {
        return cy.get('.GroupedProductsItem .Field_type_number button')
    }

    get_qty_added() {
        return cy.get('.ProductActions-Qty #item_qty')
    }

    get_product_highPrice() {
        return cy.get('del[itemprop=highPrice]')
    }

    click_add_to_cart() {
        cy.get('.ProductActions-AddToCart').click()
    }

    get_product_name() {
        return cy.get('.ProductActions-Section > h1[itemprop=name]')
    }

    get_product_lowPrice() {
        return cy.get('.ProductActions').find('span[itemprop=lowPrice]')
    }
}
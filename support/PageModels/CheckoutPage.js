/// <reference types="Cypress" />

export default class CheckoutPage {
    set_email_field(email) {
        cy.get('.CheckoutSignIn #email').clear().type(email)
    }

    get_email_field() {
        return cy.get('.CheckoutSignIn #email')
    }

    set_password_field(password) {
        cy.get('.CheckoutSignIn #password').clear().type(password)
    }

    get_password_field() {
        return cy.get('.CheckoutSignIn #password')
    }

    get_payment_methods() {
        return cy.get('.CheckoutPayments-Methods li button')
    }

    click_proceed_billing() {
        cy.get('.CheckoutShipping-Button').click()
    }

    click_place_order() {
        cy.get('.CheckoutBilling-Button').click()
    }

    click_verify() {
        cy.get('.CheckoutSignIn .MyAccountOverlay-Buttons .Button').click()
    }

    click_signin() {
        cy.get('.CheckoutSignIn .MyAccountOverlay-Buttons .Button').click()
    }

}
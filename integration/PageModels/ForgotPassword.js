/// <reference types="Cypress" />

export default class ForgotPassword {
    set_forgot_email_field(email) {
        cy.get('#email').clear().type(email)
    }

    get_forgot_email_field() {
        return cy.get('#email')
    }

    click_send_reset_link() {
        cy.get('button[type=submit]').click()
    }
}
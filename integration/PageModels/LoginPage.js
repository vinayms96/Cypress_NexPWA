/// <reference types="Cypress" />

export default class LoginPage {
    get_email_field() {
        return cy.get('#email')
    }

    get_password_field() {
        return cy.get('#password')
    }

    set_email_field(email) {
        cy.get('#email').clear().type(email)
    }

    set_password_field(pass) {
        cy.get('#password').clear().type(pass)
    }

    click_signin() {
        cy.get('button').contains('Sign in').click()
    }

    click_login_with() {
        cy.get('.Button_likeLink.toggleAction').click()
    }

    click_verify() {
        cy.get('div > button[class=Button]').click()
    }

    click_forgot_link() {
        cy.get('.Button.Button_likeLink').contains('Forgot password?').click()
    }

    click_create_account() {
        cy.get('button').contains('Create an account').click()
    }
}
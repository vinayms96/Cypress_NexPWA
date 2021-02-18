/// <reference types="Cypress" />

export default class SignupPage {
    get_firstName_field() {
        return cy.get('#firstname')
    }

    get_lastName_field() {
        return cy.get('#lastname')
    }

    get_phone_field() {
        return cy.get('#mobile')
    }

    get_subscribe_box() {
        return cy.get("[id='is_subscribed']")
    }

    get_email_field() {
        return cy.get('#email')
    }

    get_password_field() {
        return cy.get('#password')
    }

    get_confirm_password_field() {
        return cy.get('#confirm_password')
    }

    set_firstName_field(firstName) {
        cy.get('#firstname').clear().type(firstName)
    }

    set_lastName_field(lastname) {
        cy.get('#lastname').clear().type(lastname)
    }

    set_email_field(email) {
        cy.get('#email').clear().type(email)
    }

    set_password_field(password) {
        cy.get('#password').clear().type(password)
    }

    set_confirm_password_field(confirm_password) {
        cy.get('#confirm_password').clear().type(confirm_password)
    }

    check_subscribe_box() {
        cy.get("[id='is_subscribed']").check('is_subscribed')
    }

    uncheck_subscribe_box() {
        cy.get("[id='is_subscribed']").uncheck('is_subscribed')
    }

    click_verify() {
        cy.get('div > button[class=Button]').click()
    }

    click_signup() {
        cy.get('button').contains('Sign up').click()
    }
}
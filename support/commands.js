// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import Loginpage from "../integration/PageModels/LoginPage"
import CheckoutPage from "../integration/PageModels/CheckoutPage"
import Notification from "../integration/PageModels/Notification"
import Header from "../integration/PageModels/Header"

Cypress.Commands.add("login", (email, password) => {
    var loginPage = new Loginpage

    loginPage.set_email_field(email)
    loginPage.click_verify()
    loginPage.set_password_field(password)
    loginPage.click_signin()

    cy.get('h1').should('have.text','Dashboard')
    cy.url().should('include','/my-account/dashboard')
})

Cypress.Commands.add("check_login", (email, password) => {
    var header = new Header

    header.click_account_btn()
    cy.get('.Overlay_isVisible').find('strong').should('have.text','Sign in to your account')

    cy.login(email, password)

})
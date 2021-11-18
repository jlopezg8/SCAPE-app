/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
require("dotenv").config();
/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  config.env.employerUsername = process.env.TEST_EMPLOYER_USERNAME;
  config.env.employerPassword = process.env.TEST_EMPLOYER_PASSWORD;
  config.env.employeeUsername = process.env.TEST_EMPLOYEE_USERNAME;
  config.env.employeePassword = process.env.TEST_EMPLOYEE_PASSWORD;
  config.env.noWorkplaceEmployer = process.env.TEST_EMPLOYER_EMPTY_WORKPLACE;
  config.env.adminUsername = process.env.TEST_ADMIN_USERNAME;
  config.env.adminPassword = process.env.TEST_ADMIN_PASSWORD;

  // do not forget to return the changed config object!
  return config;
};

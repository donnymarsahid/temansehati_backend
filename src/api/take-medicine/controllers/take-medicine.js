'use strict';

/**
 * take-medicine controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::take-medicine.take-medicine');

'use strict';

/**
 * take-medicine service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::take-medicine.take-medicine');

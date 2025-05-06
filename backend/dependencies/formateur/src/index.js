import fp from 'fastify-plugin'

import errorFormater from './errorFormater.js'
import validationFromater from './validationFormater.js'
import responseFormater from './responseFormater.js'

function formater(fastify, opts, done) {
  if (!fastify.formater) {
    fastify.setErrorHandler(errorFormater);
    fastify.addHook("preSerialization", responseFormater);
    fastify.setSchemaErrorFormatter(validationFromater);
    fastify.decorate('formater', true);
  }
  done();
}

export default fp(formater, {name: 'formater'});

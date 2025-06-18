import fp from 'fastify-plugin'
import { FastifyPluginCallback } from 'fastify'

import errorFormater from './errorFormater.js'
import validationFromater from './validationFormater.js'
import responseFormater from './responseFormater.js'

const plugin: FastifyPluginCallback = (fastify, _, done) => {
  if (fastify.hasDecorator('formater')) {
    done();
    return;
  }
  fastify.decorate('formater', true);
  fastify.setErrorHandler(errorFormater);
  fastify.addHook("preSerialization", responseFormater);
  fastify.setSchemaErrorFormatter(validationFromater);
  done();
}

export default fp(plugin, { name: 'formater' });

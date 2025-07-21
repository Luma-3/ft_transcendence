import fp from 'fastify-plugin'
import errorFormater from './errorFormater.js'
import validationFromater from './validationFormater.js'
import responseFormater from './responseFormater.js'
import { FastifyPluginCallbackTypebox } from '@fastify/type-provider-typebox'

const plugin: FastifyPluginCallbackTypebox = (fastify, _, done) => {
  if (fastify.hasDecorator('formater')) {
    done();
    return;
  }
  fastify.decorate('formater', true);
  fastify.setErrorHandler(errorFormater);
  fastify.addHook("preSerialization", responseFormater);
  fastify.setSchemaErrorFormatter(validationFromater);
  const isHTML = /<\/?[a-z][^>]*?>/gi;
  const encodeHtml = (data: any, body: boolean = true): any => {
    if(typeof data === 'string' && (!body || isHTML.test(data))) {
      return body ? data.replace(isHTML, (tag) => tag.replace(/</g, '&lt;').replace(/>/g, '&gt;')) : data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    if (Array.isArray(data)) {
      return data.map(data => encodeHtml(data, body));
    }
    if (typeof data === 'object' && data !== null) {
      const encodedData: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        encodedData[key] = encodeHtml(value, body);
      }
      return encodedData;
    }
    return data; // Fallback for other types
  };

  fastify.addHook('preValidation', async (request, _reply) => {
      // Encode the body to prevent XSS attacks
      request.body = encodeHtml(request.body);
      request.query = encodeHtml(request.query, false);
      request.params = encodeHtml(request.params, false);
  });

  done();
}

export default fp(plugin, { name: 'formater' });

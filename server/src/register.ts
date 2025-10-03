import type { Core } from '@strapi/strapi';
import * as pckg from '../../package.json';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // register phase
  strapi.customFields.register({
    name: 'phone',
    plugin: pckg.strapi.name,
    type: 'string',
  });
};

export default register;

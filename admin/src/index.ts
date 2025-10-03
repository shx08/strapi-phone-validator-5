import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import pluginPkg from '../../package.json';
import { PluginIcon } from './components/PluginIcon';
import { defaultCountries, parseCountry, CountryData } from 'react-international-phone';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'phone',
      pluginId: PLUGIN_ID,
      type: 'string',
      icon: PluginIcon, // don't forget to create/import your icon component
      intlLabel: {
        id: getTranslation('input.label'),
        defaultMessage: pluginPkg.strapi.displayName,
      },
      intlDescription: {
        id: getTranslation('input.description'),
        defaultMessage: 'Validate phone number',
      },
      components: {
        Input: async () => import('./components/PhoneInput'),
      },
      error: {
        id: getTranslation('form.attribute.item.error'),
        defaultMessage: 'This is an invalid phone number',
      },
      options: {
        advanced: [
          {
            name: 'options.country',
            type: 'select',
            intlLabel: {
              id: getTranslation('attribute.item.defaultCountry'),
              defaultMessage: 'Default Country',
            },
            options: defaultCountries.map((country: CountryData) => {
              const { iso2, name } = parseCountry(country);
              return {
                key: iso2,
                value: iso2,
                metadatas: {
                  intlLabel: {
                    id: getTranslation(`country.item.${iso2}`),
                    defaultMessage: name,
                  },
                },
              };
            }),
          },
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: getTranslation('form.attribute.item.requiredField'),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTranslation('form.attribute.item.requiredField.description'),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: getTranslation('form.attribute.item.privateField'),
                  defaultMessage: 'Private field',
                },
                description: {
                  id: getTranslation('form.attribute.item.privateField.description'),
                  defaultMessage: 'This field will not show up in the API response',
                },
              },
            ],
          },
        ],
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: pluginPkg.strapi.displayName,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};

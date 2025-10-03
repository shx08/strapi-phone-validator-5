import { useState } from 'react';
import { useIntl } from 'react-intl';
import { Flex, Field } from '@strapi/design-system';
import { type InputProps, useField } from '@strapi/strapi/admin';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { PhoneInput } from 'react-international-phone';
import styled from 'styled-components';
import 'react-international-phone/style.css';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const StyledPhoneInputWrapper = styled.div<{ $hasError: boolean }>`
  .react-international-phone-country-selector {
    height: 38px;
  }
  .react-international-phone-input-container {
    width: 100%;
    display: flex;
    align-items: center;
    border: 1px solid
      ${({ theme, $hasError }) => ($hasError ? theme.colors.danger600 : theme.colors.neutral200)};
    border-radius: ${({ theme }) => theme.borderRadius};
    background: ${({ theme }) => theme.colors.neutral0};
    box-shadow: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
    position: relative;
    --react-international-phone-height: 38px;
    --react-international-phone-border-color: transparent;
    --react-international-phone-country-selector-border-color: transparent;
    --react-international-phone-background-color: ${({ theme }) => theme.colors.neutral0};
    --react-international-phone-country-selector-background-color: ${({ theme }) =>
      theme.colors.neutral0};
    --react-international-phone-text-color: ${({ theme }) => theme.colors.neutral800};
    --react-international-phone-font-size: ${({ theme }) => theme.fontSizes[2]};
    --react-international-phone-country-selector-arrow-color: ${({ theme }) =>
      theme.colors.neutral500};
    --react-international-phone-dropdown-item-background-color: ${({ theme }) =>
      theme.colors.neutral0};
    --react-international-phone-dropdown-item-text-color: ${({ theme }) => theme.colors.neutral800};
    --react-international-phone-dropdown-item-dial-code-color: ${({ theme }) =>
      theme.colors.neutral600};
    --react-international-phone-selected-dropdown-item-background-color: ${({ theme }) =>
      theme.colors.primary100};
    --react-international-phone-selected-dropdown-item-text-color: ${({ theme }) =>
      theme.colors.neutral900};
    --react-international-phone-selected-dropdown-item-dial-code-color: ${({ theme }) =>
      theme.colors.neutral800};
    --react-international-phone-dropdown-shadow: 0 12px 24px rgba(11, 18, 33, 0.12);
  }
  .react-international-phone-country-selector-button {
    border: none;
    border-right: 1px solid
      ${({ theme, $hasError }) => ($hasError ? theme.colors.danger600 : theme.colors.neutral200)};
    height: 100%;
    padding-inline: ${({ theme }) => theme.spaces[4]};
    background: ${({ theme }) => theme.colors.neutral0};
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;
    border-top-left-radius: ${({ theme }) => theme.borderRadius};
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius};
  }
  .react-international-phone-country-selector-button__button-content {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spaces[2]};
  }
  .react-international-phone-country-selector-button:hover {
    background: ${({ theme }) => theme.colors.primary100};
  }
  .react-international-phone-input {
    flex: 1;
    border: none;
  }
`;

type StrapiChangeEvent = { target: { name: string; value: string; type?: string } };

const Input = ({
  hint,
  disabled,
  labelAction,
  label,
  name,
  required,
  placeholder,
  ...props
}: InputProps & {
  onChange: (event: StrapiChangeEvent) => void;
  attribute?: {
    options?: {
      country?: string;
    };
  };
}) => {
  const field = useField(name);
  const rawPhone = (field.value as string | null | undefined) ?? '';
  const defaultPhone = typeof rawPhone === 'string' ? rawPhone : '';
  const [phone, setPhone] = useState<string>(defaultPhone);
  const hasPhoneValue = phone.trim().length > 0;
  const isValid = hasPhoneValue ? isPhoneValid(phone) : true;
  const defaultCountry = props.attribute?.options?.country ?? 'us';
  const { formatMessage } = useIntl();
  const hasExternalError = Boolean(field.error);
  const hasValidationError = hasPhoneValue && !isValid;
  const hasError = hasExternalError || hasValidationError;
  const errorMessage = hasValidationError
    ? formatMessage({ id: 'strapi-phone-validator-5.form.attribute.item.error' })
    : field.error;

  const handlePhoneChange = (phoneNr: string) => {
    const event: StrapiChangeEvent = {
      target: {
        name,
        value: phoneNr,
        type: 'string',
      },
    };
    field.onChange(phoneNr);
    props.onChange(event);
    setPhone(phoneNr);
  };

  return (
    <Field.Root
      name={name}
      id={name}
      hint={hint}
      required={required}
      disabled={disabled}
      error={errorMessage}
    >
      <Flex direction="column" alignItems="stretch" gap={1}>
        <Field.Label action={labelAction}>{label}</Field.Label>
        <StyledPhoneInputWrapper $hasError={hasError}>
          <PhoneInput
            forceDialCode
            style={{
              width: '100%',
            }}
            inputStyle={{ width: '100%' }} // sometimes needed
            disabled={disabled}
            defaultCountry={defaultCountry}
            value={phone}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            inputProps={{
              id: name,
              name,
              required,
            }}
          />
        </StyledPhoneInputWrapper>
        <Field.Hint />
        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

export default Input;

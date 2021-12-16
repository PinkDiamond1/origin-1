import { GenericFormProps } from '@energyweb/origin-ui-core';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

export type TUpdateUserPasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

type TUseUpdateUserAccountPasswordFormConfig = () => Omit<
  GenericFormProps<TUpdateUserPasswordFormValues>,
  'submitHandler'
>;

const INITIAL_FORM_VALUES = {
  oldPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
};

export const useUpdateUserAccountPasswordFormConfig: TUseUpdateUserAccountPasswordFormConfig =
  () => {
    const { t } = useTranslation();

    return {
      buttonText: t('general.buttons.change'),
      fields: [
        {
          type: 'password',
          label: t('user.profile.currentPassword'),
          name: 'oldPassword',
          required: true,
          inputLabelProps: {
            ['data-cy']: 'oldPassword-label',
          },
          inputProps: {
            ['data-cy']: 'oldPassword',
          },
        },
        {
          type: 'password',
          label: t('user.profile.newPassword'),
          name: 'newPassword',
          required: true,
          inputLabelProps: {
            ['data-cy']: 'newPassword-label',
          },
          inputProps: {
            ['data-cy']: 'newPassword',
          },
        },
        {
          type: 'password',
          label: t('user.profile.newPasswordConfirm'),
          name: 'newPasswordConfirm',
          required: true,
          inputLabelProps: {
            ['data-cy']: 'newPasswordConfirm-label',
          },
          inputProps: {
            ['data-cy']: 'newPasswordConfirm',
          },
        },
      ],
      buttonWrapperProps: { justifyContent: 'flex-start' },
      buttonProps: {
        ['data-cy']: 'password-change-button',
      },
      initialValues: INITIAL_FORM_VALUES,
      inputsVariant: 'filled' as any,
      validationSchema: Yup.object().shape({
        oldPassword: Yup.string()
          .label(t('user.profile.currentPassword'))
          .required(),
        newPassword: Yup.string()
          .label(t('user.profile.newPassword'))
          .required(),
        newPasswordConfirm: Yup.string()
          .oneOf(
            [Yup.ref('newPassword'), null],
            t('user.profile.confirmDoesntMatch')
          )
          .label(t('user.profile.newPasswordConfirm'))
          .required(),
      }),
    };
  };

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { replacePlaceholders } from '../../../lib/replace-placeholders';
import localeTr from '../../../locale_tr.json';
import { PasswordInput } from '../../password-input';
import ForgotPasswordForm, {
  ForgotPasswordFormDataType,
} from '../forgot-password-form';
import Button from '../../../molecules/button';
import { defaultForgotPasswordFormSchema } from '../forgot-password-form/forgot-password-form.stories';

export type LoginFormDataType = {
  password: string;
  tenantId: string;
  userIdentifier: string;
};

export type LoginFormPropsType = {
  allowTenantChange: boolean;
  formSchema: z.ZodObject<any>;
  loginFunction?: (values: LoginFormDataType) => {
    description: any;
    status: any;
  };
  passwordResetFunction?: (values: ForgotPasswordFormDataType) => {
    message: any;
    status: any;
  };
  registerPath: string;
  resources?: { [key: string]: any };
  router: any;
};

export default function LoginForm({
  router,
  passwordResetFunction,
  loginFunction,
  formSchema,
  allowTenantChange,
  registerPath,
  resources = localeTr.resources,
}: LoginFormPropsType) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const isRegistered = window.location.href.includes('register=true');
    if (isRegistered) {
      toast.info('Hesabınız oluşturuldu!', {
        dismissible: true,
        description: 'Şimdi giriş yapabilirsiniz.',
      });
      window.history.pushState(
        null,
        '',
        window.location.href.replace('?register=true', '')
      );
    }
  }, []);

  const form = useForm<LoginFormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: '',
      userIdentifier: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormDataType) {
    setIsLoading(true);
    if (loginFunction) {
      const response = await loginFunction(values);
      if (response?.status === 200) {
        if (router) {
          router.back();
          return;
        }
        window.history.back();
        return;
      }
      toast.error(response?.description);
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center gap-4 sm:w-[350px] p-5">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {resources?.AbpUi?.texts?.Login}
        </h1>
      </div>
      <div className="space-y-4 grid">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="login-form"
          >
            {allowTenantChange && (
              <FormField
                control={form.control}
                name="tenantId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {resources?.AbpIdentity?.texts?.Tenant}
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Tenant"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="userIdentifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {resources?.AbpAccount?.texts?.UserNameOrEmailAddress}
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="name@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {resources?.AbpIdentity?.texts?.Password}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={isLoading}
                      placeholder={resources?.AbpIdentity?.texts?.Password}
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="default"
              className=" w-full text-white"
              isLoading={isLoading}
            >
              {resources?.AbpUi?.texts?.Login}
            </Button>
          </form>
        </Form>
        <ForgotPasswordForm
          resources={resources}
          formSchema={defaultForgotPasswordFormSchema}
          passwordResetFunction={passwordResetFunction}
        />
        <div className="flex items-center justify-center gap-4">
          <span className="w-full h-px bg-muted" />
          <span className="text-center whitespace-nowrap text-xs uppercase text-muted-foreground">
            {resources?.AbpAccount?.texts?.OrRegisterWith}
          </span>
          <span className="w-full h-px bg-muted" />
        </div>
        <Button variant="outline" asChild className="">
          <a
            href={registerPath}
            className={`text-center cursor-pointer text-sm w-full  ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            {resources?.AbpUi?.texts?.Register}
          </a>
        </Button>
      </div>
      <p className="px-4 text-center text-xs text-muted-foreground">
        {replacePlaceholders(
          resources?.AbpGdpr?.texts?.CookieConsentAgreePolicies,
          [
            {
              holder: '{0}',
              replacement: (
                <a
                  key="cookie-policy"
                  href="/cookies"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {resources?.AbpGdpr?.texts?.CookiePolicy}
                </a>
              ),
            },
            {
              holder: '{1}',
              replacement: (
                <a
                  key="privacy-policy"
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {resources?.AbpGdpr?.texts?.PrivacyPolicy}
                </a>
              ),
            },
          ]
        )}
      </p>
    </div>
  );
}

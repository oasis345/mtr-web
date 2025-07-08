'use client';

import { LoginForm, PageLayout, Section } from '@mtr/ui';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const SigninPage = () => {
  const { signin, googleLoginUrl } = useAuth();
  const router = useRouter();

  throw new Error('test');

  return (
    <PageLayout>
      <Section>
        <LoginForm
          onSubmit={signin}
          onSuccess={() => {
            router.push('/user');
          }}
          googleLoginUrl={googleLoginUrl}
        />
      </Section>
    </PageLayout>
  );
};

export default SigninPage;

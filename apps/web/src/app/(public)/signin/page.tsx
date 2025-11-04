'use client';

import { PageLayout } from '@mtr/ui';
import { LoginForm } from '@mtr/ui/client';
import { useRouter } from 'next/navigation';

const SigninPage = () => {
  const router = useRouter();

  return (
    <PageLayout>
      <PageLayout.Main>
        <LoginForm
          onSuccess={() => {
            router.push('/user');
          }}
        />
      </PageLayout.Main>
    </PageLayout>
  );
};

export default SigninPage;

'use client';

import { PageLayout } from '@mtr/ui';
import { LoginForm } from '@mtr/ui/client';
import { useRouter } from 'next/navigation';

const SigninPage = () => {
  const router = useRouter();

  return (
    <PageLayout
      main={
        <LoginForm
          onSuccess={() => {
            router.push('/user');
          }}
        />
      }
    ></PageLayout>
  );
};

export default SigninPage;

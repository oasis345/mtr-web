import { MainContainer } from '@mtr/ui/components/layout/component/MainContainer';

export default function Home() {
  const testSections = [
    {
      id: 'section1',
      title: '테스트 섹션 1',
      children: <div className="text-white bg-red-500">테스트 섹션 1 콘텐츠</div>,
    },
    {
      id: 'section2',
      title: '테스트 섹션 2',
      children: <div className="text-white bg-blue-500">섹션 2 콘텐츠</div>,
    },
  ];

  const testAside = [
    {
      id: 'aside1',
      title: '테스트 사이드바 1',
      children: <div className="text-white bg-green-500 font-bold">사이드바 1 콘텐츠</div>,
    },
  ];

  return <MainContainer sections={testSections} aside={testAside} />;
}

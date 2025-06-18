export type MainContainerProps = {
  sections: SectionItem[];
  aside: AsideItem[];
};

export type SectionItem = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export type AsideItem = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export const MainContainer = ({ sections, aside }: MainContainerProps) => (
  <div className="flex flex-row w-full h-full min-h-[500px]">
    {/* 메인 콘텐츠 */}
    <div className="flex-1 bg-red-500 p-6">
      {sections.map(section => (
        <div key={section.id} className="mb-5 p-4 bg-red-600">
          <h2 className="text-white text-2xl mb-2">{section.title}</h2>
          <div>{section.children}</div>
        </div>
      ))}
    </div>

    {/* 사이드바 */}
    <div className="w-80 bg-blue-500 p-6 flex-shrink-0">
      <div className="text-white font-bold text-lg mb-4">사이드바</div>
      {aside.map(asideItem => (
        <div key={asideItem.id} className="mb-4 p-3 bg-blue-600 rounded">
          <h3 className="text-white text-lg mb-2">{asideItem.title}</h3>
          <div>{asideItem.children}</div>
        </div>
      ))}
    </div>
  </div>
);

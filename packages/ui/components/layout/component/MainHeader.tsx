export type HeaderProps = {
  logo: React.ReactNode;
  nav: React.ReactNode;
};

export const MainHeader = ({ logo, nav }: HeaderProps) => {
  return (
    <div className="relative flex justify-between items-center w-full h-16 px-5 bg-green-500">
      {logo}
      <nav>{nav}</nav>
    </div>
  );
};

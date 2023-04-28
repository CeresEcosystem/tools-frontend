import SideBar from './sidebar';

export default function SideBarDesktop() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <SideBar />
    </div>
  );
}

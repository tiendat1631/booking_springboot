export default function NavBar() {
  return (
    <div className='grid grid-cols-3 items-center px-4 py-2 min-h-16 bg-base-100'>
      <div>
        <a className='btn btn-ghost text-xl'>VéXe24</a>
      </div>
      <div className='justify-self-center'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <a>Trang chủ</a>
          </li>
          <li>
            <a>Lịch trình</a>
          </li>
          <li>
            <a>Tra cứu vé</a>
          </li>
        </ul>
      </div>
      <div className='justify-self-end'>
        <a className='btn btn-primary'>Đăng ký / Đăng nhập</a>
      </div>
    </div>
  );
}

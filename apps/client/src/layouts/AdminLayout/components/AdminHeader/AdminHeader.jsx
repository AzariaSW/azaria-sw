import "./AdminHeader.css";

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <div>
        <div className="admin-header__label">
          <span>Administration</span>
          <span className="admin-header__label-owner">Azaria Abenet Fitta</span>
        </div>
      </div>
    </header>
  );
}
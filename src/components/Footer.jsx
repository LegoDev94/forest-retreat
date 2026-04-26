import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <span className="logo-mark" />
            <span className="logo-name">Forest <span>Retreat</span></span>
          </Link>
          <p>Уединённые домики на природе в Латвии. Сауна, джакузи, озеро, лес — всё, чтобы перезагрузиться.</p>
        </div>
        <div className="footer-col">
          <h4>Дома</h4>
          <ul>
            <li><Link to="/cottage/dragon">Dragon House</Link></li>
            <li><Link to="/cottage/viking">Viking House</Link></li>
            <li><Link to="/cottage/farm">Private Farm</Link></li>
            <li><Link to="/cottage/black">Black House</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Информация</h4>
          <ul>
            <li><a href="/#why">Почему мы</a></li>
            <li><a href="/#reviews">Отзывы</a></li>
            <li><a href="/#cottages">Бронирование</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Контакты</h4>
          <ul>
            <li>Līči, Латвия</li>
            <li>+371 00 000 000</li>
            <li>hello@forestretreat.lv</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Forest Retreat · Все права защищены</span>
        <span>Сделано с любовью в латвийском лесу</span>
      </div>
    </footer>
  );
}

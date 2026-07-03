import { useState } from 'react'
import './App.css'

function App() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false); // لإظهار فورم البيانات
  const [showSuccess, setShowSuccess] = useState(false);   // لإظهار رسالة الشكر
  
  // بيانات العميل
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const products = [
    { id: 1, name: "كرتونة زيت هلا - 6 لتر", price: 550, category: "زيوت" },
    { id: 2, name: "رز بسمتي هندي - 5 كيلو", price: 420, category: "أرز" },
    { id: 3, name: "مكرونة الملكة - 20 كيس", price: 180, category: "مكرونة" },
    { id: 4, name: "صلصة فاين فودز - كرتونة", price: 320, category: "معلبات" },
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // دالة إرسال الطلب
  const handleSendOrder = () => {
    if (!userData.name || !userData.phone || !userData.address) {
      alert("برجاء إكمال البيانات أولاً يا هندسة!");
      return;
    }

    // تجهيز نص الرسالة
    let message = `*طلب جديد من موقع سوق الجملة*%0a`;
    message += `*الاسم:* ${userData.name}%0a`;
    message += `*الموبايل:* ${userData.phone}%0a`;
    message += `*العنوان:* ${userData.address}%0a`;
    message += `--------------------------%0a`;
    message += `*المنتجات:*%0a`;
    cart.forEach((item, index) => {
      message += `${index + 1}- ${item.name} (${item.price} ج)%0a`;
    });
    message += `--------------------------%0a`;
    message += `*الإجمالي:* ${total} ج.م`;

    const myNumber = "201207333983"; // رقمك هنا
    
    // 1. فتح الواتساب
    window.open(`https://wa.me/${myNumber}?text=${message}`, '_blank');

    // 2. تصفير السلة وإظهار رسالة الشكر
    setCart([]);
    setShowCheckout(false);
    setShowSuccess(true);
  };

  return (
    <div className="app-container" dir="rtl">
      {/* الهيدر */}
      <header className="navbar">
        <div className="logo">سوق الجملة 🛒</div>
        <div className="cart-info" onClick={() => cart.length > 0 && setShowCheckout(true)} style={{cursor: 'pointer'}}>
          <span>🛒 {cart.length}</span>
          <span style={{marginRight: '10px'}}>{total} ج.م</span>
        </div>
      </header>

      {/* عرض المنتجات */}
      <main className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="badge">{product.category}</div>
            <h3>{product.name}</h3>
            <p className="price">{product.price} جنيه</p>
            <button className="add-btn" onClick={() => addToCart(product)}>إضافة للسلة</button>
          </div>
        ))}
      </main>

      {/* مودال (نافذة) إدخال البيانات */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>بيانات الاستلام</h2>
            <input type="text" placeholder="الاسم بالكامل" onChange={(e) => setUserData({...userData, name: e.target.value})} />
            <input type="tel" placeholder="رقم الموبايل" onChange={(e) => setUserData({...userData, phone: e.target.value})} />
            <input type="text" placeholder="العنوان بالتفصيل" onChange={(e) => setUserData({...userData, address: e.target.value})} />
            <button className="confirm-btn" onClick={handleSendOrder}>تأكيد وإرسال للواتساب</button>
            <button className="cancel-btn" onClick={() => setShowCheckout(false)}>إلغاء</button>
          </div>
        </div>
      )}

      {/* نافذة رسالة الشكر والانتظار */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content success">
            <h2>تم استلام طلبك! ✅</h2>
            <p>شكراً لك. يرجى الانتظار 24 ساعة لمراجعة الطلب وتأكيده.</p>
            <button className="confirm-btn" onClick={() => setShowSuccess(false)}>حسناً</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
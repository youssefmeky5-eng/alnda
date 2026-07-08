// 1. قاعدة بيانات منتجات شركة الندا المحدثة (الأسعار تبدأ بـ 0 ويتم سحبها تلقائياً من الشيت الجديد)
let products = [
    { id: 1, name: "عسل سدر", fullName: "عسل سدر جبلي فاخر - 1 كيلو", price: 0, category: "أعسال جبلية", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" },
    { id: 2, name: "عسل برسيم", fullName: "عسل زهور البرسيم الطبيعي - 1 كيلو", price: 0, category: "أعسال زهور", img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400" },
    { id: 3, name: "عسل موالح", fullName: "عسل زهور الموالح (الحمضيات) - 1 كيلو", price: 0, category: "أعسال زهور", img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400" },
    { id: 4, name: "شهد العسل مع الشمع", fullName: "شهد العسل الطبيعي مع الشمع - 1 كيلو", price: 0, category: "منتجات الخلية", img: "https://images.unsplash.com/photo-1587049352851-8d4e89134292?w=400" },
    { id: 5, name: "غذاء الملكات", fullName: "غذاء ملكات النحل الصافي - عبوة 5 جرام", price: 0, category: "مكملات غذائية", img: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400" }
];

let cart = [];

// رابط الـ CSV الجديد الخاص بجوجل شيت اللي بتعدل منه حالياً
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRIFei7d13nqOKMQz5boyyJtzo7pmFMk5MXzjc2INALklLvG7JJtimRSLo4sZjiHhPSEYrbTJ3rHHOZ/pub?output=csv';

// أول ما الصفحة تفتح.. اعرض المنتجات فوراً بشكل مبدئي عشان الموقع ميبقاش فاضي
document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    loadPricesFromSheet();
});

// 2. دالة جلب الأسعار من جوجل شيت الجديد وتحديث مصفوفة المنتجات
async function loadPricesFromSheet() {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.text();
        const rows = data.split('\n'); 
        
        rows.forEach(row => {
            const columns = row.split(',');
            if (columns.length >= 2) {
                const sheetItemName = columns[0].trim(); // الاسم في العمود A (مثال: عسل سدر)
                const sheetPrice = columns[1].trim();    // السعر في العمود B (مثال: 400)
                
                // البحث عن المنتج المطابق بالاسم وتحديث السعر تلقائياً
                const product = products.find(p => p.name === sheetItemName);
                if (product) {
                    product.price = parseFloat(sheetPrice) || 0;
                }
            }
        });

        console.log("✅ تم تحديث أسعار أعسال الندا من شيت جوجل الجديد بنجاح");
        renderProducts(products); 
    } catch (error) {
        console.error("❌ عطل في الاتصال بجوجل شيت الجديد:", error);
        renderProducts(products); 
    }
}

// 3. دالة عرض المنتجات بالهوية والتنسيق الجديد
function renderProducts(productsToDisplay) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card" style="border: 1px solid #eee; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); background:#fff; margin:10px;">
            <img src="${product.img}" alt="${product.fullName}" style="width:100%; height:200px; object-fit:cover;">
            <div style="padding:15px">
                <span style="color:#d4a373; font-size:12px; font-weight:bold;">${product.category}</span>
                <h3 style="font-size:16px; margin:5px 0; color:#333;">${product.fullName}</h3>
                <p class="price-tag" style="color: #d4a373; font-weight: bold; font-size:1.2rem; margin:10px 0;">
                    ${product.price > 0 ? product.price + ' جنيه' : 'جاري تحميل السعر...'}
                </p>
                <button class="btn-add" onclick="addToCart(${product.id})" style="background-color:#d4a373; color:white; border:none; padding:10px; width:100%; border-radius:8px; cursor:pointer; font-weight:bold;">
                    <i class="fas fa-cart-plus"></i> إضافة لطلبك
                </button>
            </div>
        </div>
    `).join('');
}

// 4. نظام البحث (يبحث في الاسم أو القسم)
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = products.filter(p => p.fullName.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    renderProducts(filtered);
});

// 5. نظام إضافة المنتجات إلى السلة
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    if (product) {
        if (product.price <= 0) {
            alert("برجاء الانتظار ثواني حتى يتم تحميل الأسعار الحالية...");
            return;
        }
        cart.push(product);
        updateCartCount();
        
        const cartStatus = document.querySelector('.cart-status');
        if (cartStatus) {
            cartStatus.style.transform = "scale(1.2)";
            setTimeout(() => cartStatus.style.transform = "scale(1)", 200);
        }
    }
};

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

// 6. إرسال بيانات الطلب والشحن إلى الواتساب بتنسيق منسق وفخم
window.sendToWhatsApp = () => {
    const name = document.getElementById('userName').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const city = document.getElementById('userCity').value;
    const address = document.getElementById('userAddress').value.trim();

    if (!name || !phone || !address) {
        alert("برجاء ملء كافة بيانات الشحن المطلوبة!");
        return;
    }

    if (cart.length === 0) {
        alert("سلة الطلبات فارغة!");
        return;
    }

    let total = 0;
    let itemsText = "";
    
    cart.forEach((item, index) => {
        itemsText += `${index + 1}- ${item.fullName} (${item.price} ج)%0a`;
        total += item.price;
    });

    const myPhone = "201000367124"; 
    
    let message = `*طلب عسل جديد من موقع شركة الندا* 🍯%0a%0a`;
    message += `*بيانات العميل:*%0a`;
    message += `- الاسم: ${name}%0a`;
    message += `- الموبايل: ${phone}%0a`;
    message += `- المحافظة: ${city}%0a`;
    message += `- العنوان: ${address}%0a%0a`;
    message += `*المنتجات المطلوبة:*%0a${itemsText}%0a`;
    message += `*الإجمالي:* ${total} جنيه مصري`;

    const whatsappUrl = `https://wa.me/${myPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // إغلاق النوافذ المنبثقة وتفريغ السلة بعد نجاح الطلب
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'flex';
    cart = [];
    updateCartCount();
};

window.closeModal = () => {
    document.getElementById('checkoutModal').style.display = 'none';
};

window.closeSuccessModal = () => {
    document.getElementById('successModal').style.display = 'none';
};
// 1. قاعدة بيانات منتجات شركة الندا (الأسعار تبدأ بـ 0 ويتم سحبها تلقائياً من الشيت)
let products = [
    { id: 1, name: "سدر", fullName: "عسل سدر جبلي فاخر - 1 كيلو", price: 0, category: "أعسال جبلية", img: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" },
    { id: 2, name: "برسيم", fullName: "عسل زهور البرسيم الطبيعي - 1 كيلو", price: 0, category: "أعسال زهور", img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400" },
    { id: 3, name: "حبة البركة", fullName: "عسل حبة البركة الصافي - 1 كيلو", price: 0, category: "أعسال علاجية", img: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400" },
    { id: 4, name: "ملكات", fullName: "غذاء ملكات النحل الصافي - عبوة 50 جرام", price: 0, category: "مكملات غذائية", img: "https://images.unsplash.com/photo-1587049352851-8d4e89134292?w=400" },
    { id: 5, name: "موالح", fullName: "عسل زهور الموالح (الحمضيات) - 1 كيلو", price: 0, category: "أعسال زهور", img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400" },
];

let cart = [];

// رابط الـ CSV الخاص بجوجل شيت (تأكد من كتابة الكلمات: سدر، برسيم، حبة البركة، ملكات، موالح في العمود A)
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQII-i5Xu2MSAzVjzXEK2EfQUqBg2QOBnBy44X7H746ti2HIArJlpOc6LS0UojhGZJuExhOY4zhxPeB/pub?output=csv';

// 2. دالة جلب الأسعار من جوجل شيت وتحديث المصفوفة
async function loadPricesFromSheet() {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.text();
        
        // تقسيم البيانات لصفوف (نظام CSV)
        const rows = data.split('\n'); 
        
        rows.forEach(row => {
            const columns = row.split(',');
            if (columns.length >= 2) {
                const sheetItemName = columns[0].trim(); // الكلمة في خانة A (زي سدر، برسيم)
                const sheetPrice = columns[1].trim();    // الرقم في خانة B
                
                // البحث عن المنتج المطابق وتحديث سعره
                const product = products.find(p => p.name === sheetItemName);
                if (product) {
                    product.price = parseFloat(sheetPrice);
                }
            }
        });

        console.log("✅ تم تحديث أسعار أعسال الندا من جوجل شيت");
        renderProducts(products); // إعادة عرض المنتجات بعد وصول الأسعار
    } catch (error) {
        console.error("❌ عطل في الاتصال بجوجل شيت:", error);
        renderProducts(products); // عرض المنتجات بالأسعار الافتراضية في حالة الفشل
    }
}

// 3. دالة عرض المنتجات بتنسيق الهوية الجديدة (اللون العسلي)
function renderProducts(productsToDisplay) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card" style="border: 1px solid #eee; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <img src="${product.img}" alt="${product.fullName}" style="width:100%; height:200px; object-fit:cover;">
            <div style="padding:15px">
                <span style="color:#d4a373; font-size:12px; font-weight:bold;">${product.category}</span>
                <h3 style="font-size:16px; margin:5px 0; color:#333;">${product.fullName}</h3>
                <p class="price-tag" style="color: #d4a373; font-weight: bold; font-size:1.2rem;">
                    ${product.price > 0 ? product.price + ' جنيه' : 'جاري تحميل السعر...'}
                </p>
                <button class="btn-add" onclick="addToCart(${product.id})" style="background-color:#d4a373;">
                    <i class="fas fa-cart-plus"></i> إضافة لطلبك
                </button>
            </div>
        </div>
    `).join('');
}

// 4. نظام البحث (يبحث في اسم العسل أو قسمه)
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.fullName.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    renderProducts(filtered);
});

// 5. الإضافة للسلة
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    if (product && product.price > 0) {
        cart.push(product);
        updateCartCount();
        
        const cartStatus = document.querySelector('.cart-status');
        if (cartStatus) {
            cartStatus.classList.add('bump');
            setTimeout(() => cartStatus.classList.remove('bump'), 300);
        }
    } else {
        alert("برجاء الانتظار ثواني حتى يتم تحميل الأسعار الحالية...");
    }
};

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.innerText = cart.length;
    }
}

// 6. إرسال الطلب للواتساب برقم شركة الندا الجديد والتنسيق الفاخر
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

    // رقم شركة الندا الجديد بالتنسيق الدولي المفعل
    const myPhone = "201000367124"; 
    
    let message = `*طلب عسل جديد من موقع شركة الندا* 🍯%0a%0a`;
    message += `*الاسم:* ${name
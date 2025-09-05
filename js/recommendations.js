// 推荐课程数据
const recommendedCourses = [
  {
    id: 1,
    title: '2024考研政治精讲班',
    type: '录播课程',
    image: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6nfw9120t1u.png?imageView2/2/w/1050/q/100|imageMogr2/ignore-error/1',
    price: 199.00,
    originalPrice: 299.00,
    purchaseCount: 2890
  },
  {
    id: 2,
    title: '考研数学基础强化班',
    type: '直播课程',
    image: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6nfw9120t1u.png?imageView2/2/w/1050/q/100|imageMogr2/ignore-error/1',
    price: 299.00,
    originalPrice: 399.00,
    purchaseCount: 1560
  },
  {
    id: 3,
    title: '英语四级冲刺班',
    type: '系统课程',
    image: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6nfw9120t1u.png?imageView2/2/w/1050/q/100|imageMogr2/ignore-error/1',
    price: 159.00,
    originalPrice: 259.00,
    purchaseCount: 3420
  }
];

// 格式化价格显示
function formatPrice(price) {
  return price.toFixed(2);
}

// 格式化购买人数
function formatPurchaseCount(count) {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万人购买';
  }
  return count + '人购买';
}

// 生成推荐课程列表
function generateRecommendationList() {
  const recommendationList = document.getElementById('recommendationList');

  recommendedCourses.forEach(course => {
    const courseElement = document.createElement('div');
    courseElement.className = 'course-item';

    courseElement.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
                <span class="course-type">${course.type}</span>
            </div>
            <div class="course-info">
                <h3 class="course-title">${course.title}</h3>
                <div class="course-price-info">
                    <div class="price-container">
                        <span class="current-price">¥${formatPrice(course.price)}</span>
                        <span class="original-price">¥${formatPrice(course.originalPrice)}</span>
                    </div>
                    <span class="purchase-count">${formatPurchaseCount(course.purchaseCount)}</span>
                </div>
            </div>
        `;

    recommendationList.appendChild(courseElement);
  });
}

// 页面加载完成后初始化推荐列表
document.addEventListener('DOMContentLoaded', generateRecommendationList);
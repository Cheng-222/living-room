document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.querySelector('.search-button');
    const searchInputWrapper = document.querySelector('.search-input-wrapper');
    const searchCancel = document.querySelector('.search-cancel');
    const searchInput = document.querySelector('.search-input-wrapper input');

    // 点击搜索按钮展开搜索框
    searchButton.addEventListener('click', function () {
        searchInputWrapper.classList.add('active');
        searchCancel.classList.add('active');
        searchInput.focus();
        searchButton.style.opacity = '0';
    });

    // 点击取消按钮收起搜索框
    searchCancel.addEventListener('click', function () {
        searchInputWrapper.classList.remove('active');
        searchCancel.classList.remove('active');
        searchInput.value = '';
        searchButton.style.opacity = '1';
    });

    // 点击页面其他区域收起搜索框
    document.addEventListener('click', function (event) {
        const isClickInside = searchButton.contains(event.target) ||
            searchInputWrapper.contains(event.target) ||
            searchCancel.contains(event.target);

        if (!isClickInside && searchInputWrapper.classList.contains('active')) {
            searchInputWrapper.classList.remove('active');
            searchCancel.classList.remove('active');
            searchInput.value = '';
            searchButton.style.opacity = '1';
        }
    });
});
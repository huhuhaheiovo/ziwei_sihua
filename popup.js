// 中文星期几名称
const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
// 中文月份名称
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
// 获取当前日期
const today = new Date();
// 获取一张星盘数据
var astrolabe = iztro.astro.bySolar(today, 2, '男', true, 'zh-CN');
// 通过阳历获取星盘信息
// 获取运限数据
const horoscope = astrolabe.horoscope(today);
// 获取流日生年四化
const liuRiShengNianSiHua = horoscope.daily;
// 更新四化信息显示
function updateSiHuaInfo(date) {
    const selectedDate = new Date(date);
    const selectedAstrolabe = iztro.astro.bySolar(selectedDate, 2, '男', true, 'zh-CN');
    const selectedHoroscope = selectedAstrolabe.horoscope(selectedDate);
    const selectedSiHua = selectedHoroscope.daily;

    // 定义四化类型
    const sihuaTypes = ['禄', '权', '科', '忌'];
    const sihuaClasses = ['sihua-lu', 'sihua-quan', 'sihua-ke', 'sihua-ji'];

    // 生成带颜色的四化星文本
    const siHuaText = selectedSiHua.mutagen.map((star, index) => {
        return `<span class="sihua-item ${sihuaClasses[index]}">${star}(${sihuaTypes[index]})</span>`;
    }).join('、');

    document.getElementById('calls-info').innerHTML =
        `${selectedSiHua.heavenlyStem}${selectedSiHua.earthlyBranch}日 • ${siHuaText}`;
}
// 初始化时显示当天四化信息
updateSiHuaInfo(today);
const currentDay = today.getDate();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

// 更新月份显示
document.getElementById('current-month').textContent = monthNames[currentMonth];

// 获取当前星期的开始日期（从周一开始）
const getWeekStartDate = (date) => {
    const day = date.getDay();
    // 如果是星期天，向前推6天，否则向前推 (day - 1) 天
    const diff = day === 0 ? 6 : day - 1;
    const mondayDate = new Date(date);
    mondayDate.setDate(date.getDate() - diff);
    return mondayDate;
};

// 定义全局 weekStart 变量
let weekStart = getWeekStartDate(today);

// 生成日期项的函数
function generateDates(startDate) {
    const dates = [];
    // 从传入的日期开始显示7天
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push({
            date: date.getDate(),
            weekday: weekdayNames[date.getDay()],
            fullDate: new Date(date),
            isToday: date.getDate() === currentDay &&
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
        });
    }
    return dates;
}

// 初始化日期显示
function initDateDisplay() {
    const weekDates = generateDates(weekStart);

    // 生成日期项
    const daysContainer = document.getElementById('days-container');
    const indicatorContainer = document.getElementById('indicator-container');
    daysContainer.innerHTML = '';
    indicatorContainer.innerHTML = '';
    indicatorContainer.appendChild(document.createElement('div')).className = 'indicator-line';

    let activeIndex = -1;

    weekDates.forEach((dateInfo, index) => {
        // 创建日期项
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item' + (dateInfo.isToday ? ' day-active' : '');
        dayItem.innerHTML = `
            <div class="day-number">${dateInfo.date}</div>
            <div class="day-name">${dateInfo.weekday}</div>
        `;
        dayItem.setAttribute('data-index', index);
        daysContainer.appendChild(dayItem);

        // 创建指示器点
        const indicatorDot = document.createElement('div');
        indicatorDot.className = 'indicator-dot' + (dateInfo.isToday ? ' indicator-active' : '');
        indicatorDot.setAttribute('data-index', index);
        indicatorContainer.appendChild(indicatorDot);

        // 记录当前选中的日期索引
        if (dateInfo.isToday) {
            activeIndex = index;
        }
    });

    // 如果没有找到当天日期，默认选中第一个
    if (activeIndex === -1 && daysContainer.children.length > 0) {
        activeIndex = 0;
        daysContainer.children[0].classList.add('day-active');
        indicatorContainer.querySelectorAll('.indicator-dot')[0].classList.add('indicator-active');
        
        // 确保为默认选中的第一个日期更新四化信息
        const selectedDate = new Date(weekStart);
        selectedDate.setDate(weekStart.getDate() + activeIndex);
        updateSiHuaInfo(selectedDate);
    }

    // 为当前活跃日期更新四化信息
    if (activeIndex !== -1) {
        const selectedDate = new Date(weekStart);
        selectedDate.setDate(weekStart.getDate() + activeIndex);
        updateSiHuaInfo(selectedDate);
    }

    // 绑定点击事件
    bindDateClickEvents();
}

// 更新日期显示
function updateDateDisplay(startDate) {
    // 更新全局 weekStart 变量
    weekStart = startDate;

    // 清空现有内容并重新生成
    const daysContainer = document.getElementById('days-container');
    const indicatorContainer = document.getElementById('indicator-container');
    daysContainer.innerHTML = '';
    indicatorContainer.innerHTML = '';
    indicatorContainer.appendChild(document.createElement('div')).className = 'indicator-line';

    // 生成新的日期项
    const weekDates = generateDates(startDate);
    
    // 更新右上角月份显示 - 使用周初日期的月份
    currentMonth = startDate.getMonth();
    document.getElementById('current-month').textContent = monthNames[currentMonth];

    let activeIndex = -1;
    weekDates.forEach((dateInfo, index) => {
        // 创建日期项
        const dayItem = document.createElement('div');
        dayItem.className = 'day-item' + (dateInfo.isToday ? ' day-active' : '');
        dayItem.innerHTML = `
            <div class="day-number">${dateInfo.date}</div>
            <div class="day-name">${dateInfo.weekday}</div>
        `;
        daysContainer.appendChild(dayItem);

        // 创建指示器点
        const indicatorDot = document.createElement('div');
        indicatorDot.className = 'indicator-dot' + (dateInfo.isToday ? ' indicator-active' : '');
        indicatorContainer.appendChild(indicatorDot);

        if (dateInfo.isToday) {
            activeIndex = index;
        }
    });

    // 如果没有找到当天日期，默认选中第一个
    if (activeIndex === -1) {
        activeIndex = 0;
        const dayItems = document.querySelectorAll('.day-item');
        const indicatorDots = document.querySelectorAll('.indicator-dot');
        if (dayItems.length > 0 && indicatorDots.length > 0) {
            dayItems[0].classList.add('day-active');
            indicatorDots[0].classList.add('indicator-active');
            
            // 确保为默认选中的第一个日期更新四化信息
            const selectedDate = new Date(startDate);
            selectedDate.setDate(startDate.getDate() + activeIndex);
            updateSiHuaInfo(selectedDate);
        }
    } else {
        // 为找到的今天日期更新四化信息
        const selectedDate = new Date(startDate);
        selectedDate.setDate(startDate.getDate() + activeIndex);
        updateSiHuaInfo(selectedDate);
    }

    // 重新绑定点击事件
    bindDateClickEvents();
}

// 绑定日期点击事件
function bindDateClickEvents() {
    const dayItems = document.querySelectorAll('.day-item');
    const indicatorDots = document.querySelectorAll('.indicator-dot');

    dayItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            dayItems.forEach(day => day.classList.remove('day-active'));
            indicatorDots.forEach(dot => dot.classList.remove('indicator-active'));
            this.classList.add('day-active');
            indicatorDots[index].classList.add('indicator-active');

            // 使用最新的 weekStart 计算选中日期
            const selectedDate = new Date(weekStart);
            selectedDate.setDate(weekStart.getDate() + index);
            updateSiHuaInfo(selectedDate);
            
            // 更新右上角月份显示为选中日期的月份
            if (currentMonth !== selectedDate.getMonth()) {
                currentMonth = selectedDate.getMonth();
                document.getElementById('current-month').textContent = monthNames[currentMonth];
            }
        });
    });

    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            dayItems[index].click();
        });
    });
}

// 初始化日期显示
initDateDisplay();

// 切换到月份视图
function switchToMonthView() {
    const daysContainer = document.getElementById('days-container');

    // 清空日期容器
    daysContainer.innerHTML = '';

    // 创建月份选择器
    const monthSelector = document.createElement('div');
    monthSelector.className = 'month-selector';
    daysContainer.appendChild(monthSelector);

    // 显示全部12个月份
    for (let i = 0; i < 12; i++) {
        const month = monthNames[i];

        const option = document.createElement('div');
        option.className = 'month-option' + (i === currentMonth ? ' active' : '');
        option.textContent = month;

        option.addEventListener('click', function () {
            handleMonthSelect(month, i);
        });

        monthSelector.appendChild(option);
    }

    // 标记为月份视图
    document.querySelector('.date-nav-and-indicators').classList.add('month-view');
}

// 切换回日期视图
function switchToDateView() {
    document.querySelector('.date-nav-and-indicators').classList.remove('month-view');
    updateDateDisplay(weekStart);
}

// 为月份选择器添加点击事件
// document.getElementById('month-selector').addEventListener('click', function (e) {
//     if (document.querySelector('.date-nav-and-indicators').classList.contains('month-view')) {
//         switchToDateView();
//     } else {
//         switchToMonthView();
//     }

//     e.stopPropagation();
// });

// 点击其他地方关闭月份选择器
document.addEventListener('click', function (e) {
    if (!e.target.closest('#days-container') &&
        !e.target.closest('#month-selector') &&
        document.querySelector('.date-nav-and-indicators').classList.contains('month-view')) {
        switchToDateView();
    }
});

// 月份选择事件处理
function handleMonthSelect(month, index) {
    currentMonth = index;
    document.getElementById('current-month').textContent = month;

    // 更新日期显示为选中月份的第一天
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

    // 直接从月份的第一天开始显示，而不是从包含第一天的那周的周一开始
    weekStart = firstDayOfMonth;

    // 切换回日期视图
    document.querySelector('.date-nav-and-indicators').classList.remove('month-view');
    updateDateDisplay(firstDayOfMonth);
}

// 实现滑动导航功能
function initSwipeNavigation() {
    const navContainer = document.querySelector('.date-nav-and-indicators');
    let startX, startY, distX, distY;
    let startTime;
    let threshold = 100; // 最小滑动距离
    let restraint = 100; // 垂直滑动约束
    let allowedTime = 300; // 最长滑动时间
    let isMouseDown = false; // 鼠标按下状态

    // 触摸事件
    navContainer.addEventListener('touchstart', function(e) {
        const touchObj = e.changedTouches[0];
        startX = touchObj.pageX;
        startY = touchObj.pageY;
        startTime = new Date().getTime();
        
        // 添加sliding类来提供适当的过渡效果
        const container = document.querySelector('.date-nav-and-indicators').classList.contains('month-view') 
                         ? document.querySelector('.month-selector') 
                         : document.querySelector('.date-nav-container');
        container.classList.add('sliding');
    }, false);

    navContainer.addEventListener('touchmove', function(e) {
        // 如果是垂直滑动，不阻止默认事件
        const touchObj = e.changedTouches[0];
        distX = touchObj.pageX - startX;
        distY = touchObj.pageY - startY;
        
        if (Math.abs(distX) > Math.abs(distY)) {
            e.preventDefault();
            
            // 在滑动过程中移动容器
            const container = document.querySelector('.date-nav-and-indicators').classList.contains('month-view') 
                            ? document.querySelector('.month-selector') 
                            : document.querySelector('.date-nav-container');
            container.style.transform = `translateX(${distX}px)`;
        }
    }, { passive: false });

    navContainer.addEventListener('touchend', function(e) {
        handleSwipeEnd(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    }, false);

    // 鼠标事件 - 为桌面用户添加
    navContainer.addEventListener('mousedown', function(e) {
        startX = e.pageX;
        startY = e.pageY;
        startTime = new Date().getTime();
        isMouseDown = true;
        
        // 添加sliding类来提供适当的过渡效果
        const container = document.querySelector('.date-nav-and-indicators').classList.contains('month-view') 
                         ? document.querySelector('.month-selector') 
                         : document.querySelector('.date-nav-container');
        container.classList.add('sliding');
        
        // 防止文本选择
        e.preventDefault();
    }, false);

    navContainer.addEventListener('mousemove', function(e) {
        if (!isMouseDown) return;
        
        distX = e.pageX - startX;
        distY = e.pageY - startY;
        
        if (Math.abs(distX) > Math.abs(distY)) {
            // 在滑动过程中移动容器
            const container = document.querySelector('.date-nav-and-indicators').classList.contains('month-view') 
                            ? document.querySelector('.month-selector') 
                            : document.querySelector('.date-nav-container');
            container.style.transform = `translateX(${distX}px)`;
            
            // 防止文本选择和默认行为
            e.preventDefault();
        }
    }, false);

    navContainer.addEventListener('mouseup', function(e) {
        if (isMouseDown) {
            handleSwipeEnd(e.pageX, e.pageY);
            isMouseDown = false;
        }
    }, false);

    // 鼠标移出元素也结束滑动
    navContainer.addEventListener('mouseleave', function(e) {
        if (isMouseDown) {
            handleSwipeEnd(e.pageX, e.pageY);
            isMouseDown = false;
        }
    }, false);

    // 处理滑动结束逻辑 - 抽取公共函数
    function handleSwipeEnd(endX, endY) {
        distX = endX - startX;
        distY = endY - startY;
        const elapsedTime = new Date().getTime() - startTime;
        
        // 清除动画类和样式
        const container = document.querySelector('.date-nav-and-indicators').classList.contains('month-view') 
                        ? document.querySelector('.month-selector') 
                        : document.querySelector('.date-nav-container');
        container.classList.remove('sliding');
        container.style.transform = '';
        
        // 检查是否是有效的水平滑动手势
        const isValidSwipe = elapsedTime <= allowedTime && 
                            Math.abs(distX) >= threshold && 
                            Math.abs(distY) <= restraint;
        
        if (isValidSwipe) {
            // 向左滑动 - 下一周/月
            if (distX < 0) {
                if (document.querySelector('.date-nav-and-indicators').classList.contains('month-view')) {
                    // 切换到下一组月份
                    handleNextMonthsGroup();
                } else {
                    // 切换到下一周
                    const newStartDate = new Date(weekStart);
                    newStartDate.setDate(weekStart.getDate() + 7);
                    updateDateDisplay(newStartDate);
                }
            }
            // 向右滑动 - 上一周/月
            else {
                if (document.querySelector('.date-nav-and-indicators').classList.contains('month-view')) {
                    // 切换到上一组月份
                    handlePrevMonthsGroup();
                } else {
                    // 切换到上一周
                    const newStartDate = new Date(weekStart);
                    newStartDate.setDate(weekStart.getDate() - 7);
                    updateDateDisplay(newStartDate);
                }
            }
        }
    }
}

// 处理上一组月份
function handlePrevMonthsGroup() {
    // 如果是月份视图，重新渲染月份选择器
    switchToMonthView();
}

// 处理下一组月份
function handleNextMonthsGroup() {
    // 如果是月份视图，重新渲染月份选择器
    switchToMonthView();
}

// 初始化滑动导航
initSwipeNavigation();

// 当弹出窗口加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initDateDisplay();
}); 
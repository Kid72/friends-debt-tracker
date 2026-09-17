# Dostlar Borc & Xərc İzləyicisi (Friends Expense & Debt Tracker)
### Material Design 3 Expressive PWA • Zero-Backend • Zero-Authentication • Vercel-Ready

Прогрессивное веб-приложение (PWA) для компании друзей из WhatsApp-чата. Приложение решает проблему забытых долгов, запутанных расчетов после совместных посиделок и избавляет от необходимости вручную напоминать друг другу о переводах.

---

## 🌟 Ключевые возможности и архитектурные решения

1. **Zero Authentication (Доверительная модель)**:
   - Вход без паролей, логинов и токенов.
   - Пользователь просто выбирает свое имя в шапке («Mən — [Ad]»).
   - Выбранный профиль мгновенно адаптирует интерфейс, подсвечивая личный баланс и необходимые переводы.

2. **Material Design 3 Expressive & Google Sans**:
   - Топографика: повсеместное использование семейств шрифтов **Google Sans** / **Google Sans Text** (с полной поддержкой латиницы и кириллицы).
   - Выразительные контейнеры `surface-container`, скругления `rounded-3xl` (28px) для карточек и диалогов, `rounded-full` для чипов и pill-кнопок.
   - Плавающая кнопка действия (**Floating Action Button / FAB**) в правом нижнем углу для быстрого добавления чека.

3. **Мультиязычность (i18n)**:
   - Полная поддержка трех языков: **Азербайджанский (AZ — по умолчанию)**, **Русский (RU)**, **Английский (EN)**.
   - Мгновенный переключатель в шапке с сохранением выбора в памяти сессии.

4. **Алгоритм схлопывания долгов (Debt Simplification)**:
   - Жадный алгоритм минимизации потоков (**Greedy Min-Cash Flow Algorithm**) сокращает количество транзакций более чем в 2 раза.
   - **Прозрачность схлопывания**: система отслеживает исходных кредиторов и генерирует наглядное мультиязычное пояснение перенаправления долга:
     - **AZ**: *«Əməliyyatların sayını azaltmaq üçün Elvinin Raufa olan 15 ₼ borcu Çingizə yönləndirildi»*
     - **RU**: *«Долг Эльвина перед Рауфом на 15 ₼ перенаправлен Чингизу для сокращения числа переводов»*
     - **EN**: *«Elvin's 15 ₼ debt to Rauf was redirected to Chingiz to optimize transfers»*

5. **Закрытие долгов (Settle Up) & Интеграция с WhatsApp**:
   - Расчет в один клик кнопкой **«Borcu bağla»**.
   - Анимация салюта конфетти (**canvas-confetti**).
   - Локальное PWA-уведомление через **Web Notification API**:
     - *«Borc bağlandı: [Borclu] [Məbləğ] [Valyuta] məbləğini [Alan]-a qaytardı! 🎉»*
   - Модальное окно M3 Dialog с кнопкой отправки подтверждения в WhatsApp (`https://wa.me/?text=...` / `whatsapp://send?text=...`):
     ```text
     ✅ Borc bağlandı!
     💸 [Borclu] ➡️ [Məbləğ] [Valyuta] ➡️ [Alan]
     Yığıncaq balansı yeniləndi.
     🔗 [Ссылка на PWA]
     ```

6. **Общий отчет в WhatsApp-группу**:
   - Кнопка **«WhatsApp-da paylaş»** в блоке итогов.
   - Генерирует читаемое структурированное сообщение:
     ```text
     🍻 Yığıncaq nəticələri: [Məkan/Təsvir]
     💰 Ümumi hesab: [Məbləğ] [Valyuta] (ödədi: [Ad])
     
     📋 Kim kimə köçürür (optimallaşdırılmış):
     • [Borclu] ➡️ [Məbləğ] [Valyuta] ➡️ [Alan]
     
     🔗 Balansı yoxlamaq və borcları bağlamaq: [Link]
     ```

7. **Геймификация («Şərəf Lövhəsi» / «Зал славы»)**:
   - ⚡ **«Gecənin sponsoru»** / **«Спонсор вечера»** — участник, оплативший наибольшую сумму счетов.
   - ⚡ **«İldırım ödəyici»** / **«Молниеносный плательщик»** — участник, надежнее и быстрее всех закрывающий долги.
   - 🐢 **«"Sabah ataram" bəy»** / **«Мистер "Завтра скину"»** — шуточный титул для того, чей долг висит дольше всех.
   - 🍕 **«Məclisin canı»** / **«Душа компании»** — участник, посетивший больше всего встреч.

8. **PWA & Offline Ready**:
   - `manifest.webmanifest`, иконки 192x192 и 512x512 maskable, Service Worker (`sw.js`).
   - Установка на домашний экран (Add to Home Screen) на iOS (Safari) и Android (Chrome).

---

## 🗄️ Исследование хранилищ данных (Zero-Backend Data Storage)

Приложение спроектировано с **двухуровневой архитектурой хранения (Dual-Engine)**:

### Режим 1: LocalStorage (Offline-First по умолчанию)
- Работает мгновенно из коробки, не требуя никаких API-ключей и интернета.
- Предустановлены демонстрационные данные для друзей (Rauf Aliyev, Mika, Çingiz, Yusif, Elvin) с валютой **AZN (₼)**.

### Режим 2: Облачная синхронизация (Cloud REST Sync)
В окне настроек (⚙️) можно в 1 клик подключить любой бесплатный REST JSON сервис:

| Сервис | Преимущества | Как настроить |
|---|---|---|
| **npoint.io** | **100% бесплатно**, без регистрации, мгновенный REST GET/POST | Зайти на [npoint.io](https://www.npoint.io), создать пустой bin `{}` и вставить URL в настройках приложения. |
| **JSONBin.io** | Бесплатный тариф (10 000 запросов/мес), версионирование JSON | Зарегистрироваться на [jsonbin.io](https://jsonbin.io), создать bin и указать `Bin ID` + `X-Master-Key`. |
| **Firebase Realtime Database** | Высокая скорость, бесконечные бесплатные чтения в режиме REST | Создать проект Firebase, включить Realtime Database в тестовом режиме (`/room.json`) и указать URL базы. |
| **Custom REST** | Любой сервер / Cloudflare Worker / Vercel Edge Function | Указать URL, поддерживающий `GET` и `PUT` с телом JSON. |

---

## 🚀 Развертывание на Vercel (Vercel Ready)

### Вариант 1: Через веб-интерфейс Vercel (Рекомендуемый)
1. Создайте репозиторий на GitHub и загрузите туда содержимое проекта.
2. Перейдите на [vercel.com](https://vercel.com) и нажмите **Add New Project**.
3. Выберите ваш GitHub репозиторий.
4. Vercel автоматически определит фреймворк как **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Нажмите **Deploy**. Сайт станет доступен через 30 секунд по адресу `https://your-project.vercel.app`.

### Вариант 2: Через Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

Конфигурационный файл `vercel.json` уже настроен в корне проекта:
```json
{
  "framework": "vite",
  "cleanUrls": true,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 💻 Локальный запуск и разработка

```bash
# 1. Установка зависимостей
npm install

# 2. Запуск локального сервера разработки
npm run dev

# 3. Сборка продакшн-версии (PWA)
npm run build

# 4. Предпросмотр сборки
npm run preview
```

---

## 📁 Структура проекта

```text
friends-debt-tracker/
├── index.html                  # Главная страница, Google Sans CDN, PWA мета-теги
├── package.json                # Зависимости (React 18, Vite, Tailwind, Lucide, Confetti)
├── vite.config.js              # Конфиг Vite + vite-plugin-pwa (AutoUpdate, Service Worker)
├── tailwind.config.js          # Material Design 3 Expressive палитра и Google Sans
├── postcss.config.js           # PostCSS Tailwind плагины
├── vercel.json                 # Правила маршрутизации Vercel
├── README.md                   # Документация проекта
├── public/
│   ├── favicon.svg             # Векторная иконка
│   ├── favicon.ico             # Десктопная иконка
│   ├── icon-192.png            # PWA иконка 192x192
│   ├── icon-512.png            # PWA иконка 512x512 maskable
│   ├── manifest.webmanifest    # Манифест PWA (standalone)
│   └── sw.js                   # Service Worker для офлайн-кэширования
└── src/
    ├── main.jsx                # Входная точка приложения
    ├── App.jsx                 # Главный контейнер состояния и табов
    ├── index.css               # Стили Tailwind & Google Sans
    ├── i18n/                   # Модуль локализации
    │   ├── index.jsx           # Провайдер языка и хук useI18n()
    │   ├── az.js               # Азербайджанский словарь (дефолт)
    │   ├── ru.js               # Русский словарь
    │   └── en.js               # Английский словарь
    ├── services/
    │   ├── debtAlgorithm.js    # Greedy Min-Cash Flow + цепочки перенаправлений долгов
    │   ├── storageService.js   # Двухуровневое хранилище (LocalStorage + Cloud REST Sync)
    │   ├── notificationService.js # PWA Web Notification API
    │   └── gamificationService.js # Расчет бейджей и Зала славы
    └── components/
        ├── Header.jsx          # MD3 Top App Bar (Профиль, Язык, Уведомления, Книга)
        ├── HeroBalanceCard.jsx # Крупная карточка персонального баланса
        ├── DebtTransfersList.jsx # Список схлопнутых переводов + WhatsApp экспорт
        ├── ExpenseModal.jsx    # Модалка создания/редактирования чека (Equal & Flexible)
        ├── SettleUpModal.jsx   # Закрытие долга + конфетти + WhatsApp подтверждение
        ├── GamificationHallOfFame.jsx # Таб «Şərəf Lövhəsi» (4 титула и лидерборд)
        ├── ExpensesHistory.jsx # Таб «Xərclər» (Хронология, фильтры, аудит)
        ├── MembersManager.jsx  # Таб «İştirakçılar» (Добавление и смена профиля)
        ├── HelpModal.jsx       # Справка (Как это работает, PWA гайд для iOS/Android)
        ├── SettingsModal.jsx   # Валюта, настройка Cloud Sync, сброс к демо
        ├── FloatingActionButton.jsx # MD3 FAB (+) для добавления расхода
        └── Common/
            └── Avatar.jsx      # Универсальный аватар участника с инициалами
```

---

## 📱 Инструкция по установке как PWA

- **iOS (iPhone / iPad)**:
  1. Откройте сайт в браузере **Safari**.
  2. Нажмите иконку **«Поделиться»** (квадрат со стрелкой вверх по центру внизу).
  3. Прокрутите меню и выберите **«На экран «Домой»» (Add to Home Screen)**.
  4. Нажмите **«Добавить»**. Приложение появится на рабочем столе с нативным окном без адресной строки!

- **Android**:
  1. Откройте сайт в браузере **Chrome**.
  2. Нажмите на меню из трех точек в правом верхнем углу.
  3. Выберите **«Установить приложение»** или **«Добавить на главный экран»**.

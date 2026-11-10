# 📦 Fayd Time Calculator — Инструкция по доступу к репозиторию и разработке

Данная инструкция содержит полную информацию для подключения, авторизации, синхронизации и публикации проекта **Fayd Time**.

---

## 1. Основные сведения о репозитории

* **Имя репозитория:** `faydtime`
* **Владелец (Owner):** `Abdullax00`
* **Основная ветка (Default Branch):** `main`
* **Веб-интерфейс на GitHub:** [https://github.com/Abdullax00/faydtime](https://github.com/Abdullax00/faydtime)
* **Рабочий домен (Production):** [https://faydtime.ru](https://faydtime.ru)
* **Резервный адрес (GitHub Pages):** [https://abdullax00.github.io/faydtime/](https://abdullax00.github.io/faydtime/)

---

## 2. Ссылки для подключения (Git URLs)

### 🔹 SSH URL (Рекомендуется для автоматизации)
```bash
git@github.com:Abdullax00/faydtime.git
```
* **Преимущество:** Не запрашивает пароль или логин при выполнении команд `git push` и `git pull`.
* На текущем рабочем ПК уже настроен и привязан SSH-ключ `id_ed25519` к аккаунту `Abdullax00`.

### 🔹 HTTPS URL
```bash
https://github.com/Abdullax00/faydtime.git
```
* Используется для быстрого клонирования без SSH-ключа или при работе через **Personal Access Token (PAT)**.

---

## 3. Авторизация и доступ (Authentication)

### Вариант А: SSH-доступ (Активен на текущем ПК)
1. **Проверка подключения к GitHub:**
   ```bash
   ssh -T git@github.com
   ```
   *Ожидаемый ответ:* `Hi Abdullax00! You've successfully authenticated, but GitHub does not provide shell access.`
2. **Если настраивается новый компьютер:**
   * Сгенерировать ключ: `ssh-keygen -t ed25519 -C "faydtime-access"`
   * Скопировать публичный ключ: `cat ~/.ssh/id_ed25519.pub`
   * Добавить на GitHub: [GitHub Settings → SSH and GPG keys](https://github.com/settings/keys) → кнопка **New SSH key**.

### Вариант Б: Токен доступа (Personal Access Token — PAT)
Используется, если внешнему AI-агенту, скрипту или CI/CD серверу требуется доступ по HTTPS:
1. Перейдите в раздел создания токена: [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Выберите **Generate new token (classic)**.
3. Отметьте необходимые права (Scopes):
   * `repo` — полный доступ к репозиторию (код, коммиты, ветки).
   * `workflow` — опционально для работы с GitHub Actions.
4. Скопируйте созданный токен.
5. Использование токена в командах Git:
   ```bash
   # Клонирование с токеном:
   git clone https://<ВАШ_ТОКЕН>@github.com/Abdullax00/faydtime.git

   # Привязка токена к уже существующему репозиторию:
   git remote set-url origin https://<ВАШ_ТОКЕН>@github.com/Abdullax00/faydtime.git
   ```

---

## 4. Локальные пути на текущем ПК

* **Рабочая папка проекта (Workspace):**
  `C:\Users\Abdullah\Desktop\Среда работы с Antigravity\Новый дизайн Fayd Time`
* **Папка локального Git-репозитория:**
  `C:\Users\Abdullah\Desktop\Среда работы с Antigravity\Локальный калькулятор Рассрочки\Новый дизайн Fayd Time`

---

## 5. Базовые команды Git для работы с репозиторием

### Проверка статуса файлов:
```bash
git status
```

### Получение свежих обновлений из ветки main:
```bash
git pull origin main
```

### Фиксация и отправка изменений (Commit & Push):
```bash
# 1. Добавить изменённые файлы:
git add .

# 2. Создать коммит с понятным описанием:
git commit -m "feat: описание добавленного функционала"

# 3. Отправить в репозиторий:
git push origin main
```

### Клонирование репозитория с нуля на другое устройство:
```bash
# По SSH:
git clone git@github.com:Abdullax00/faydtime.git

# Или по HTTPS:
git clone https://github.com/Abdullax00/faydtime.git
```

### Откат локальных не сохранённых правок (если нужно вернуть как было):
```bash
git restore <имя_файла>
# Или откат всех файлов в директории:
git restore .
```

---

## 6. Архитектура и ключевые файлы проекта

| Файл / Папка | Назначение |
| :--- | :--- |
| `index.html` | Главное SPA-приложение калькулятора (HTML5, Tailwind CSS, кастомные неоморфные стили Figma, логика расчёта, график платежей и PDF). |
| `sw.js` | Service Worker для 100% автономной офлайн-работы PWA. Кэширует статику и внешние шрифты. |
| `manifest.json` | Манифест прогрессивного веб-приложения (PWA) для установки на домашний экран iOS/Android. |
| `CNAME` | Привязка домена `faydtime.ru` к хостингу GitHub Pages. |
| `apple-touch-icon.png` | Иконка для экрана Домой на iPhone и iPad (180x180, RGB 24-bit). |
| `icon-192.png`, `icon-512.png` | Иконки PWA для Android и десктопа. |
| `favicon.ico`, `favicon.svg` | Векторные и растровые фавиконки для вкладок браузера. |
| `og-image.png` | Изображение Open Graph (1200x630) для красивого предпросмотра при отправке ссылки в Telegram, WhatsApp и соцсетях. |
| `assets/` | Локальные SVG и растровые иконки интерфейса, векторный логотип, фоновые градиенты. |

> [!IMPORTANT]
> **Правило обновления Service Worker (`sw.js`):**
> При внесении любых изменений в код `index.html` или визуальные ресурсы необходимо **увеличивать номер версии кэша** в первой строке файла `sw.js`:
> ```javascript
> const CACHE_NAME = 'faydtime-calc-v2.0.2'; // инкрементировать версию
> ```
> Благодаря слушателю `controllerchange` в `index.html`, телефоны и компьютеры пользователей мгновенно загрузят свежую версию без необходимости вручную сбрасывать кэш браузера.

---

## 7. Деплой и публикация (GitHub Pages)

* Хостинг настроен на ветку `main` репозитория.
* При отправке команды `git push origin main` изменения публикуются в автоматическом режиме через встроенный движок GitHub Pages.
* Время применения изменений на сервере: **от 30 до 90 секунд**.
* Рабочий сайт доступен по адресам:
  * [https://faydtime.ru](https://faydtime.ru)
  * [https://abdullax00.github.io/faydtime/](https://abdullax00.github.io/faydtime/)

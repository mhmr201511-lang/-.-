# منصة درجاتي

منصة لرصد درجات الطلاب ومراسلتهم. تعمل على GitHub Pages، وتحفظ البيانات في Firebase (مجاني).

## ربط قاعدة البيانات (مرة واحدة)

1. ادخل https://console.firebase.google.com واضغط **Create a project** (عطّل Google Analytics، ما تحتاجه).
2. **Build > Firestore Database > Create database** واختر الموقع `eur3` أو الأقرب لك، ثم **Start in production mode**.
3. في Firestore افتح تبويب **Rules**، احذف الموجود والصق محتوى ملف `firestore.rules`، ثم **Publish**.
4. **Build > Authentication > Get started**، وفي **Sign-in method** فعّل:
   - **Email/Password**
   - **Anonymous**
5. في **Authentication > Settings > Authorized domains** اضغط **Add domain** وأضف:
   `mhmr201511-lang.github.io`
6. **Project settings** (رمز الترس) > **Your apps** > رمز الويب `</>`، سجّل التطبيق بأي اسم، وانسخ القيم
   (`apiKey`, `authDomain`, `projectId`, ...) وضعها في `FIREBASE_CONFIG` أعلى ملف `index.html`.
   هذه القيم عامة وآمنة للوضع في الكود؛ الحماية تأتي من قواعد الخطوة 3.
7. ارفع `index.html` إلى GitHub وافتح الموقع، ثم «دخول المعلم» وأنشئ أول حساب معلم.

## الدخول

- **الطالب**: رقم الهوية فقط، ويرى درجاته هو فقط.
- **المعلم**: اسم المستخدم وكلمة المرور. يضيف المعلمين الآخرين من «الإعدادات».
- نسيان كلمة مرور معلم: يحذفه معلم آخر ويضيفه من جديد، أو من Firebase > Authentication.
